from __future__ import annotations

import json
import os
import re
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any


GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
DEFAULT_MODEL = "gemini-2.0-flash"
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ENV_PATH = PROJECT_ROOT / ".env"
SUPPORT_CODES = {
    "motivation_drop",
    "avoidance",
    "stress_language",
    "low_confidence",
    "family_pressure",
    "social_isolation",
    "academic_overload",
}
CAREER_CODES = {
    "career_confusion",
    "unrealistic_goal",
    "parent_student_conflict",
    "missing_major_bridge",
    "weak_self_knowledge",
    "interest_inconsistency",
}
CATEGORY_BY_CODE = {
    "motivation_drop": "wellbeing",
    "avoidance": "wellbeing",
    "stress_language": "wellbeing",
    "low_confidence": "wellbeing",
    "family_pressure": "family",
    "social_isolation": "wellbeing",
    "academic_overload": "academic",
    "career_confusion": "career",
    "unrealistic_goal": "career",
    "parent_student_conflict": "family",
    "missing_major_bridge": "career",
    "weak_self_knowledge": "career",
    "interest_inconsistency": "career",
}
POINTS_BY_SEVERITY = {"low": 5, "medium": 10, "high": 15}


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


def _text_blob(student: dict[str, Any]) -> str:
    values = [
        student.get("personalStatement"),
        student.get("parentExpectation"),
        student.get("careerFit"),
        student.get("favoriteCareer"),
        student.get("desiredCareerStyle"),
        student.get("preferredActivities"),
        student.get("curiosityTopics"),
        student.get("medicalHistory"),
        student.get("leastFavoriteSubject"),
    ]
    return " ".join(str(value or "") for value in values).strip()


def _normalize_signal(raw: dict[str, Any], source: str) -> dict[str, Any] | None:
    code = str(raw.get("code") or "").strip().lower()
    if code not in SUPPORT_CODES and code not in CAREER_CODES:
        return None

    severity = str(raw.get("severity") or "low").strip().lower()
    if severity not in POINTS_BY_SEVERITY:
        severity = "low"
    confidence = raw.get("confidence", 0.5)
    try:
        confidence_value = max(0.0, min(1.0, float(confidence)))
    except (TypeError, ValueError):
        confidence_value = 0.5

    points = raw.get("points")
    try:
        point_value = int(points)
    except (TypeError, ValueError):
        point_value = POINTS_BY_SEVERITY[severity]
    point_value = max(0, min(15, point_value))

    evidence = str(raw.get("evidence") or raw.get("label") or code).strip()
    if len(evidence) > 220:
        evidence = evidence[:217].rstrip() + "..."

    return {
        "code": code,
        "category": CATEGORY_BY_CODE[code],
        "severity": severity,
        "points": point_value,
        "evidence": evidence,
        "confidence": round(confidence_value, 2),
        "source": source,
    }


def _fallback_signals(student: dict[str, Any]) -> dict[str, Any]:
    text = _text_blob(student).lower()
    checks = [
        ("stress_language", "wellbeing", ("stress", "áp lực", "ap luc", "burnout", "mệt", "met", "tired")),
        ("low_confidence", "wellbeing", ("low confidence", "thiếu tự tin", "thieu tu tin", "không tự tin", "khong tu tin")),
        ("family_pressure", "family", ("parent", "phụ huynh", "phu huynh", "gia đình", "gia dinh", "expectation")),
        ("career_confusion", "career", ("không biết", "khong biet", "confused", "many careers", "nhiều nghề", "nhieu nghe")),
        ("missing_major_bridge", "career", ("ngành", "nganh", "university", "trường", "truong")),
        ("interest_inconsistency", "career", ("conflict", "mismatch", "khác", "khac")),
    ]
    signals: list[dict[str, Any]] = []
    for code, category, keywords in checks:
        if any(keyword in text for keyword in keywords):
            signals.append(
                {
                    "code": code,
                    "category": category,
                    "severity": "medium",
                    "points": 10,
                    "evidence": f"Local scanner matched keywords for {code}.",
                    "confidence": 0.55,
                    "source": "fallback",
                }
            )

    return {
        "provider": "fallback",
        "model": "local_keyword_scanner",
        "signals": signals[:6],
        "summary": "Fallback local scanner used; set GEMINI_API_KEY for Gemini signals.",
        "error": None,
    }


def _extract_json_text(response: dict[str, Any]) -> str:
    candidates = response.get("candidates") or []
    if not candidates:
        return "{}"
    parts = candidates[0].get("content", {}).get("parts") or []
    text = "".join(str(part.get("text") or "") for part in parts)
    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    return match.group(0) if match else text


def _gemini_payload(student: dict[str, Any]) -> dict[str, Any]:
    prompt = {
        "task": "Extract educational triage signals. Do not diagnose. Do not decide whether a meeting is mandatory.",
        "allowed_codes": sorted(SUPPORT_CODES | CAREER_CODES),
        "student": student,
        "output_schema": {
            "signals": [
                {
                    "code": "one allowed code",
                    "category": "academic|wellbeing|career|family|transition",
                    "severity": "low|medium|high",
                    "points": "integer 0..15",
                    "evidence": "short evidence grounded in provided data only",
                    "confidence": "number 0..1",
                }
            ],
            "summary": "short neutral summary",
        },
    }
    return {
        "systemInstruction": {
            "parts": [
                {
                    "text": (
                        "You are an educational triage signal extractor. "
                        "Return JSON only. Do not diagnose mental health conditions. "
                        "Do not invent facts. Use only the provided student data."
                    )
                }
            ]
        },
        "contents": [{"role": "user", "parts": [{"text": json.dumps(prompt, ensure_ascii=False)}]}],
        "generationConfig": {
            "temperature": 0.1,
            "response_mime_type": "application/json",
        },
    }


def extract_student_signals(student: dict[str, Any]) -> dict[str, Any]:
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    model = os.environ.get("GEMINI_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL
    if not api_key:
        return _fallback_signals(student)

    request = urllib.request.Request(
        GEMINI_ENDPOINT.format(model=model),
        data=json.dumps(_gemini_payload(student), ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": api_key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=12) as response:
            raw = json.loads(response.read().decode("utf-8"))
        parsed = json.loads(_extract_json_text(raw))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError, ValueError) as exc:
        fallback = _fallback_signals(student)
        fallback["provider"] = "fallback_after_gemini_error"
        fallback["model"] = model
        fallback["error"] = str(exc)
        return fallback

    normalized = [
        signal
        for signal in (_normalize_signal(item, "gemini") for item in parsed.get("signals", []))
        if signal is not None
    ]
    return {
        "provider": "gemini",
        "model": model,
        "signals": normalized[:8],
        "summary": str(parsed.get("summary") or "").strip(),
        "error": None,
    }
