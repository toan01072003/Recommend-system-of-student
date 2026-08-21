from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
DEFAULT_MODEL = "gemini-3.1-flash-lite"
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"


class CareerChatAgentError(RuntimeError):
    """Raised when Gemini cannot answer the career chat request."""


def load_dotenv(path: Path = ENV_PATH) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def _bounded_text(value: Any, *, max_length: int, required: bool = False) -> str:
    text = str(value or "").strip()
    if required and not text:
        raise ValueError("Missing required text")
    return text[:max_length]


def _bounded_list(value: Any, *, max_items: int = 8, max_length: int = 120) -> list[str]:
    if not isinstance(value, list):
        return []
    result: list[str] = []
    for item in value[:max_items]:
        text = _bounded_text(item, max_length=max_length)
        if text:
            result.append(text)
    return result


def minimal_student_context(student: dict[str, Any]) -> dict[str, Any]:
    context = {
        "grade": student.get("grade"),
        "careerFit": _bounded_text(student.get("careerFit"), max_length=120),
        "favoriteCareer": _bounded_text(student.get("favoriteCareer"), max_length=120),
        "riasecTop3": _bounded_text(student.get("riasecTop3"), max_length=12),
        "preferredActivities": _bounded_text(student.get("preferredActivities"), max_length=240),
        "curiosityTopics": _bounded_text(student.get("curiosityTopics"), max_length=240),
        "favoriteSubject": _bounded_text(student.get("favoriteSubject"), max_length=80),
    }
    return {key: value for key, value in context.items() if value not in (None, "", [])}


def _career_context(career: dict[str, Any]) -> dict[str, Any]:
    universities = career.get("universities")
    schools: list[str] = []
    if isinstance(universities, list):
        for item in universities[:4]:
            if not isinstance(item, dict):
                continue
            short_name = _bounded_text(item.get("shortName") or item.get("name"), max_length=80)
            program = _bounded_text(item.get("program"), max_length=120)
            score = _bounded_text(item.get("score"), max_length=60)
            if short_name:
                schools.append(" - ".join(part for part in [short_name, program, score] if part))

    return {
        "name": _bounded_text(career.get("name"), max_length=120, required=True),
        "field": _bounded_text(career.get("field"), max_length=80),
        "shortDescription": _bounded_text(career.get("desc"), max_length=260),
        "description": _bounded_text(career.get("fullDesc"), max_length=800),
        "salaryRange": _bounded_text(career.get("salaryRange"), max_length=80),
        "education": _bounded_text(career.get("education"), max_length=120),
        "skills": _bounded_list(career.get("skills"), max_items=6),
        "activities": _bounded_list(career.get("activities"), max_items=7),
        "universities": schools,
    }


def _extract_text(response: dict[str, Any]) -> str:
    candidates = response.get("candidates") or []
    if not candidates:
        raise CareerChatAgentError("Gemini không trả về nội dung")
    parts = candidates[0].get("content", {}).get("parts") or []
    text = "".join(str(part.get("text") or "") for part in parts if isinstance(part, dict)).strip()
    if not text:
        raise CareerChatAgentError("Gemini trả về nội dung rỗng")
    return re.sub(r"\s+\n", "\n", text).strip()


def _json_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "intro": {"type": "string"},
            "bullets": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 2,
                "maxItems": 4,
            },
            "nextStep": {"type": "string"},
        },
        "required": ["intro", "bullets", "nextStep"],
    }


def _extract_json_answer(response: dict[str, Any]) -> dict[str, Any]:
    text = _extract_text(response)
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE | re.DOTALL).strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as exc:
        raise CareerChatAgentError("Gemini trả về JSON không hợp lệ") from exc
    if not isinstance(parsed, dict):
        raise CareerChatAgentError("Gemini trả về dữ liệu không hợp lệ")

    intro = _bounded_text(parsed.get("intro"), max_length=420, required=True)
    bullets = _bounded_list(parsed.get("bullets"), max_items=4, max_length=260)
    next_step = _bounded_text(parsed.get("nextStep"), max_length=260, required=True)
    if len(bullets) < 2:
        raise CareerChatAgentError("Gemini trả về quá ít ý chính")
    return {
        "intro": intro,
        "bullets": bullets,
        "nextStep": next_step,
    }


def generate_career_chat_answer(
    student: dict[str, Any],
    career: dict[str, Any],
    question: str,
    locale: str = "vi",
) -> dict[str, Any]:
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    model = os.environ.get("GEMINI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
    if not api_key:
        raise CareerChatAgentError("Chatbot nghề nghiệp chưa được cấu hình GEMINI_API_KEY")

    career_payload = _career_context(career)
    question_text = _bounded_text(question, max_length=500, required=True)
    prompt = {
        "task": "Answer a student's question about one career.",
        "locale": locale,
        "student": minimal_student_context(student),
        "career": career_payload,
        "question": question_text,
            "rules": [
                "Write in natural Vietnamese for Vietnamese middle-school or high-school students.",
                "Use warm, simple, respectful language. Avoid childish or silly wording.",
                "Return JSON only. No Markdown, no bold syntax, no asterisks.",
                "Use intro for 1 short paragraph, bullets for 2-4 clear points, nextStep for 1 practical action.",
                "Use only the provided career data. If salary or school information is uncertain, say it is a reference range.",
                "Do not guarantee admission, salary, employment, medical/legal/financial outcomes.",
            ],
            "output_schema": _json_schema(),
        }
    request_payload = {
        "systemInstruction": {
            "parts": [
                {
                    "text": (
                        "Bạn là chatbot hướng nghiệp cho học sinh cấp 2-3. "
                        "Trả lời tự nhiên, ngắn gọn, dễ hiểu, không dùng giọng trẻ con. "
                        "Không bịa thông tin ngoài dữ liệu được cung cấp. "
                        "Chỉ trả JSON hợp lệ theo schema, không trả Markdown."
                    )
                }
            ]
        },
        "contents": [{"role": "user", "parts": [{"text": json.dumps(prompt, ensure_ascii=False)}]}],
        "generationConfig": {
            "temperature": 0.35,
            "maxOutputTokens": 650,
            "response_mime_type": "application/json",
        },
    }
    request = urllib.request.Request(
        GEMINI_ENDPOINT.format(model=model),
        data=json.dumps(request_payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=18) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise CareerChatAgentError(f"Không gọi được Gemini: {exc}") from exc

    return {
        **_extract_json_answer(raw),
        "provider": "gemini",
        "model": model,
    }
