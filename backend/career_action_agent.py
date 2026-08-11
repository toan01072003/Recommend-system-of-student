from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "google/gemini-3.1-flash-lite"
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"
YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"}
VIDEO_ID_PATTERN = re.compile(r"^[A-Za-z0-9_-]{6,20}$")


class CareerActionAgentError(RuntimeError):
    """Raised when the upstream learning agent cannot produce usable content."""


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
        raise ValueError("AI response is missing required text")
    return text[:max_length]


def _bounded_list(value: Any, *, max_items: int = 8, max_length: int = 160) -> list[str]:
    if not isinstance(value, list):
        return []
    return [
        _bounded_text(item, max_length=max_length)
        for item in value[:max_items]
        if _bounded_text(item, max_length=max_length)
    ]


def minimal_student_context(student: dict[str, Any]) -> dict[str, Any]:
    """Project only child-learning context; omit identity, family and sensitive records."""
    context: dict[str, Any] = {
        "grade": student.get("grade"),
        "className": _bounded_text(student.get("className"), max_length=40),
        "careerFit": _bounded_text(student.get("careerFit"), max_length=120),
        "favoriteCareer": _bounded_text(student.get("favoriteCareer"), max_length=120),
        "favoriteCareers": _bounded_list(student.get("favoriteCareers"), max_items=5),
        "riasecTop3": _bounded_text(student.get("riasecTop3"), max_length=12),
        "preferredActivities": _bounded_text(student.get("preferredActivities"), max_length=300),
        "curiosityTopics": _bounded_text(student.get("curiosityTopics"), max_length=300),
        "desiredCareerStyle": _bounded_text(student.get("desiredCareerStyle"), max_length=160),
        "workStyle": _bounded_text(student.get("workStyle"), max_length=120),
    }
    return {key: value for key, value in context.items() if value not in (None, "", [])}


def _json_schema() -> dict[str, Any]:
    interactive = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "kind": {"type": "string", "enum": ["multiple_choice", "true_false"]},
            "prompt": {"type": "string"},
            "options": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "id": {"type": "string"},
                        "label": {"type": "string"},
                    },
                    "required": ["id", "label"],
                },
                "minItems": 2,
                "maxItems": 4,
            },
            "correctOptionId": {"type": "string"},
            "hint": {"type": "string"},
            "successMessage": {"type": "string"},
        },
        "required": [
            "kind",
            "prompt",
            "options",
            "correctOptionId",
            "hint",
            "successMessage",
        ],
    }
    video = {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "url": {"type": "string"},
            "title": {"type": "string"},
            "channel": {"type": "string"},
            "description": {"type": "string"},
        },
        "required": ["url", "title", "channel", "description"],
    }
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "mode": {"type": "string", "enum": ["interactive", "video"]},
            "title": {"type": "string"},
            "summary": {"type": "string"},
            "explanation": {"type": "string"},
            "interactive": {"anyOf": [interactive, {"type": "null"}]},
            "video": {"anyOf": [video, {"type": "null"}]},
        },
        "required": ["mode", "title", "summary", "explanation", "interactive", "video"],
    }


def _agent_prompt(
    student_context: dict[str, Any],
    career: dict[str, str],
    action: dict[str, str],
    locale: str,
) -> str:
    return json.dumps(
        {
            "task": "Explain one career action to a child in a playful, concrete way.",
            "locale": locale,
            "student": student_context,
            "career": career,
            "action": action,
            "rules": [
                "Write in simple Vietnamese suitable for the student's grade.",
                "Choose exactly one mode: interactive or video.",
                "For interactive mode, create a short multiple-choice or true/false mini-game.",
                "For video mode, use web search and choose one child-friendly educational YouTube video.",
                "Never generate a video, HTML, JSX, JavaScript, iframe code or arbitrary UI markup.",
                "Never include private, family, medical or academic-score details.",
                "Do not include ads, unsafe content, mature content or unrelated entertainment.",
                "Set the unused mode field to null.",
            ],
            "output_schema": _json_schema(),
        },
        ensure_ascii=False,
    )


def build_openrouter_payload(
    student_context: dict[str, Any],
    career: dict[str, str],
    action: dict[str, str],
    locale: str = "vi",
) -> dict[str, Any]:
    return {
        "model": os.environ.get("OPENROUTER_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "Bạn là trợ lý hướng nghiệp cho trẻ em. "
                    "Trả về đúng JSON theo response schema, không thêm markdown. "
                    "Nếu cần video, chỉ tìm video YouTube giáo dục phù hợp với trẻ."
                ),
            },
            {
                "role": "user",
                "content": _agent_prompt(student_context, career, action, locale),
            },
        ],
        "tools": [{"type": "openrouter:web_search"}],
        "tool_choice": "auto",
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "career_action_learning",
                "strict": True,
                "schema": _json_schema(),
            },
        },
        "temperature": 0.3,
        "max_tokens": 1000,
        "stream": False,
    }


def _extract_content(response: dict[str, Any]) -> str:
    choices = response.get("choices")
    if not isinstance(choices, list) or not choices:
        raise CareerActionAgentError("AI agent không trả về nội dung")
    message = choices[0].get("message") or {}
    content = message.get("content")
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(str(part.get("text") or "") for part in content if isinstance(part, dict))
    raise CareerActionAgentError("AI agent trả về định dạng không hỗ trợ")


def _parse_json_content(content: str) -> dict[str, Any]:
    text = content.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.IGNORECASE | re.DOTALL).strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError as exc:
        raise CareerActionAgentError("AI agent trả về JSON không hợp lệ") from exc
    if not isinstance(parsed, dict):
        raise CareerActionAgentError("AI agent trả về dữ liệu không hợp lệ")
    return parsed


def _youtube_video_id(url: str) -> str | None:
    parsed = urllib.parse.urlparse(url.strip())
    if parsed.scheme != "https" or (parsed.hostname or "").lower() not in YOUTUBE_HOSTS:
        return None
    host = (parsed.hostname or "").lower()
    if host == "youtu.be":
        candidate = parsed.path.strip("/").split("/")[0]
    else:
        query_id = urllib.parse.parse_qs(parsed.query).get("v", [""])[0]
        path_parts = [part for part in parsed.path.split("/") if part]
        candidate = query_id or (path_parts[1] if len(path_parts) > 1 and path_parts[0] in {"embed", "shorts", "live"} else "")
    return candidate if VIDEO_ID_PATTERN.fullmatch(candidate) else None


def _normalize_interactive(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("AI interactive content is missing")
    kind = raw.get("kind")
    if kind not in {"multiple_choice", "true_false"}:
        raise ValueError("AI interactive content has an unsupported kind")
    options_raw = raw.get("options")
    if not isinstance(options_raw, list) or not 2 <= len(options_raw) <= 4:
        raise ValueError("AI interactive content needs 2 to 4 options")
    options: list[dict[str, str]] = []
    for option in options_raw:
        if not isinstance(option, dict):
            raise ValueError("AI interactive option is invalid")
        option_id = _bounded_text(option.get("id"), max_length=40, required=True)
        label = _bounded_text(option.get("label"), max_length=180, required=True)
        options.append({"id": option_id, "label": label})
    correct_id = _bounded_text(raw.get("correctOptionId"), max_length=40, required=True)
    if correct_id not in {option["id"] for option in options}:
        raise ValueError("AI interactive answer does not match an option")
    return {
        "kind": kind,
        "prompt": _bounded_text(raw.get("prompt"), max_length=500, required=True),
        "options": options,
        "correctOptionId": correct_id,
        "hint": _bounded_text(raw.get("hint"), max_length=240),
        "successMessage": _bounded_text(raw.get("successMessage"), max_length=240),
    }


def _normalize_video(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("AI video content is missing")
    url = _bounded_text(raw.get("url"), max_length=500, required=True)
    video_id = _youtube_video_id(url)
    if not video_id:
        raise ValueError("AI video URL must be a secure YouTube URL")
    return {
        "url": f"https://www.youtube.com/watch?v={video_id}",
        "embedUrl": f"https://www.youtube-nocookie.com/embed/{video_id}",
        "title": _bounded_text(raw.get("title"), max_length=180, required=True),
        "channel": _bounded_text(raw.get("channel"), max_length=120, required=True),
        "description": _bounded_text(raw.get("description"), max_length=400, required=True),
        "source": "YouTube",
    }


def normalize_agent_response(raw: dict[str, Any]) -> dict[str, Any]:
    mode = raw.get("mode")
    if mode not in {"interactive", "video"}:
        raise ValueError("AI response mode is invalid")
    result = {
        "mode": mode,
        "title": _bounded_text(raw.get("title"), max_length=180, required=True),
        "summary": _bounded_text(raw.get("summary"), max_length=500, required=True),
        "explanation": _bounded_text(raw.get("explanation"), max_length=900, required=True),
        "interactive": None,
        "video": None,
    }
    if mode == "interactive":
        result["interactive"] = _normalize_interactive(raw.get("interactive"))
    else:
        result["video"] = _normalize_video(raw.get("video"))
    return result


def generate_career_action(
    student: dict[str, Any],
    career: dict[str, str],
    action: dict[str, str],
    locale: str = "vi",
) -> dict[str, Any]:
    load_dotenv()
    api_key = os.environ.get("OPENROUTER_API_KEY", "").strip()
    if not api_key:
        raise CareerActionAgentError("AI agent chưa được cấu hình OPENROUTER_API_KEY")

    payload = build_openrouter_payload(
        minimal_student_context(student),
        career,
        action,
        locale if locale in {"vi", "en"} else "vi",
    )
    request = urllib.request.Request(
        OPENROUTER_ENDPOINT,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "RIASEC Career Recommendation",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            upstream = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        if exc.code in {401, 403}:
            raise CareerActionAgentError("OpenRouter API key không hợp lệ hoặc đã hết quyền") from exc
        raise CareerActionAgentError("OpenRouter đang tạm thời không khả dụng") from exc
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise CareerActionAgentError("Không kết nối được AI agent") from exc

    return normalize_agent_response(_parse_json_content(_extract_content(upstream)))
