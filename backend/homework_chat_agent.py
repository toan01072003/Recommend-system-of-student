from __future__ import annotations

import base64
import binascii
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
MAX_IMAGE_BASE64_CHARS = 6_000_000


class HomeworkChatAgentError(RuntimeError):
    """Raised when Gemini cannot answer the homework support request."""


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


def _bounded_list(value: Any, *, max_items: int = 8, max_length: int = 260) -> list[str]:
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
        "className": _bounded_text(student.get("className"), max_length=40),
        "favoriteSubject": _bounded_text(student.get("favoriteSubject"), max_length=80),
        "leastFavoriteSubject": _bounded_text(student.get("leastFavoriteSubject"), max_length=80),
        "academicPressureLevel": _bounded_text(student.get("academicPressureLevel"), max_length=80),
        "confidenceLevel": _bounded_text(student.get("confidenceLevel"), max_length=80),
    }
    return {key: value for key, value in context.items() if value not in (None, "", [])}


def _extract_text(response: dict[str, Any]) -> str:
    candidates = response.get("candidates") or []
    if not candidates:
        raise HomeworkChatAgentError("Gemini không trả về nội dung")
    parts = candidates[0].get("content", {}).get("parts") or []
    text = "".join(str(part.get("text") or "") for part in parts if isinstance(part, dict)).strip()
    if not text:
        raise HomeworkChatAgentError("Gemini trả về nội dung rỗng")
    return re.sub(r"\s+\n", "\n", text).strip()


def _json_schema() -> dict[str, Any]:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "detectedProblem": {"type": "string"},
            "subject": {"type": "string"},
            "grade": {"type": "string"},
            "textbookArea": {"type": "string"},
            "recommendedLessons": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1,
                "maxItems": 5,
            },
            "solutionGuide": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 2,
                "maxItems": 6,
            },
            "commonMistakes": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1,
                "maxItems": 4,
            },
            "nextQuestion": {"type": "string"},
        },
        "required": [
            "detectedProblem",
            "subject",
            "grade",
            "textbookArea",
            "recommendedLessons",
            "solutionGuide",
            "commonMistakes",
            "nextQuestion",
        ],
    }


def _extract_json_answer(response: dict[str, Any]) -> dict[str, Any]:
    text = _extract_text(response)
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE | re.DOTALL).strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as exc:
        raise HomeworkChatAgentError("Gemini trả về JSON không hợp lệ") from exc
    if not isinstance(parsed, dict):
        raise HomeworkChatAgentError("Gemini trả về dữ liệu không hợp lệ")

    result = {
        "detectedProblem": _bounded_text(parsed.get("detectedProblem"), max_length=520, required=True),
        "subject": _bounded_text(parsed.get("subject"), max_length=80, required=True),
        "grade": _bounded_text(parsed.get("grade"), max_length=80, required=True),
        "textbookArea": _bounded_text(parsed.get("textbookArea"), max_length=180, required=True),
        "recommendedLessons": _bounded_list(parsed.get("recommendedLessons"), max_items=5, max_length=180),
        "solutionGuide": _bounded_list(parsed.get("solutionGuide"), max_items=6, max_length=280),
        "commonMistakes": _bounded_list(parsed.get("commonMistakes"), max_items=4, max_length=220),
        "nextQuestion": _bounded_text(parsed.get("nextQuestion"), max_length=240, required=True),
    }
    if not result["recommendedLessons"] or len(result["solutionGuide"]) < 2:
        raise HomeworkChatAgentError("Gemini trả về hướng dẫn chưa đủ chi tiết")
    return result


def _image_part(image: dict[str, Any] | None) -> dict[str, Any] | None:
    if not isinstance(image, dict):
        return None
    mime_type = _bounded_text(image.get("mimeType") or image.get("mime_type"), max_length=80)
    data = str(image.get("data") or image.get("base64") or "").strip()
    if "," in data and data.startswith("data:"):
        data = data.split(",", 1)[1]
    if not mime_type or not data:
        return None
    if not mime_type.startswith("image/"):
        raise ValueError("image.mimeType must be an image MIME type")
    if len(data) > MAX_IMAGE_BASE64_CHARS:
        raise ValueError("Ảnh quá lớn, hãy chọn ảnh dưới khoảng 4MB")
    try:
        base64.b64decode(data, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ValueError("image.data must be valid base64") from exc
    return {"inlineData": {"mimeType": mime_type, "data": data}}


def generate_homework_chat_answer(
    student: dict[str, Any],
    question: str = "",
    image: dict[str, Any] | None = None,
    locale: str = "vi",
) -> dict[str, Any]:
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    model = os.environ.get("GEMINI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
    if not api_key:
        raise HomeworkChatAgentError("Chatbot bài tập chưa được cấu hình GEMINI_API_KEY")

    question_text = _bounded_text(question, max_length=1200)
    image_inline_part = _image_part(image)
    if not question_text and image_inline_part is None:
        raise ValueError("question or image is required")

    prompt = {
        "task": "Guide a Vietnamese middle-school or high-school student through a homework problem.",
        "locale": locale,
        "student": minimal_student_context(student),
        "studentSubmissionText": question_text or "Học sinh gửi ảnh bài tập, hãy đọc nội dung trong ảnh.",
        "rules": [
            "Write natural Vietnamese for Vietnamese grade 6-12 students.",
            "Be clear, supportive, and not childish.",
            "First identify what problem the student sent. If the image/text is unclear, say exactly what is unclear.",
            "Infer subject, grade, textbook unit/chapter/lesson only when there is enough evidence. If not sure, say 'Chưa xác định chắc chắn'.",
            "Recommend the lesson, formula, grammar point, reading skill, or topic the student should review before solving.",
            "Guide step by step with hints and method. Avoid dumping only the final answer.",
            "For math/science, include the key formula or idea when useful. For literature/language, include reading/writing strategy.",
            "Return JSON only. No Markdown, no bold syntax, no asterisks.",
        ],
        "output_schema": _json_schema(),
    }
    parts: list[dict[str, Any]] = [{"text": json.dumps(prompt, ensure_ascii=False)}]
    if image_inline_part:
        parts.append(image_inline_part)

    request_payload = {
        "systemInstruction": {
            "parts": [
                {
                    "text": (
                        "Bạn là chatbot gia sư cho học sinh cấp 2-3 ở Việt Nam. "
                        "Nhiệm vụ là nhận đề bài bằng chữ hoặc ảnh, nhận diện môn/lớp/phần SGK có thể liên quan, "
                        "rồi hướng dẫn cách giải từng bước bằng tiếng Việt tự nhiên. "
                        "Chỉ trả JSON hợp lệ theo schema, không trả Markdown."
                    )
                }
            ]
        },
        "contents": [{"role": "user", "parts": parts}],
        "generationConfig": {
            "temperature": 0.25,
            "maxOutputTokens": 900,
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
        with urllib.request.urlopen(request, timeout=24) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise HomeworkChatAgentError(f"Không gọi được Gemini: {exc}") from exc

    return {
        **_extract_json_answer(raw),
        "provider": "gemini",
        "model": model,
    }
