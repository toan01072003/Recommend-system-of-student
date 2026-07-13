from __future__ import annotations

import json
from pathlib import Path

try:
    from . import student_database
    from .recommend_engine import (
        RIASEC_ORDER,
        load_career_vectors,
        load_question_map,
        rank_careers,
        score_student_answers,
    )
except ImportError:
    import student_database
    from recommend_engine import (
        RIASEC_ORDER,
        load_career_vectors,
        load_question_map,
        rank_careers,
        score_student_answers,
    )


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA = PROJECT_ROOT / "data"
QUESTION_JSON = DATA / "onet_interest_profiler_questions.json"
QUESTION_MAP_ONET = DATA / "question_map_onet.csv"
QUESTION_MAP_TEMPLATE = DATA / "question_map_template.csv"
CAREER_VECTORS = DATA / "career_vectors_onet.csv"
STUDENT_DB = DATA / "recommend_system.db"

DEMO_TEXT = {
    "R": "Toi thich lam viec voi vat lieu, may moc, cong cu hoac hoat dong thuc hanh.",
    "I": "Toi thich phan tich du lieu, nghien cuu, tim loi giai cho van de phuc tap.",
    "A": "Toi thich sang tao noi dung, thiet ke, viet, ve hoac bieu dat y tuong.",
    "S": "Toi thich giup do, huong dan, day hoc hoac lam viec truc tiep voi con nguoi.",
    "E": "Toi thich thuyet phuc, lanh dao, kinh doanh hoac khoi xuong du an.",
    "C": "Toi thich sap xep thong tin, lam viec voi quy trinh, so lieu va chi tiet.",
}


def active_question_map_path() -> Path:
    return QUESTION_MAP_ONET if QUESTION_MAP_ONET.exists() else QUESTION_MAP_TEMPLATE


def load_questions() -> list[dict]:
    if QUESTION_JSON.exists():
        payload = json.loads(QUESTION_JSON.read_text(encoding="utf-8"))
        return [
            {
                "id": int(item["index"]),
                "area": item["area"],
                "text": item["text"],
                "source": "onet",
            }
            for item in payload["question"]
        ]

    question_map = load_question_map(active_question_map_path())
    return [
        {
            "id": question_id,
            "area": dimension.lower(),
            "text": f"{DEMO_TEXT[dimension]} ({question_id})",
            "source": "demo",
        }
        for question_id, dimension in sorted(question_map.items())
    ]


def questions_payload() -> dict:
    return {"questions": load_questions()}


def surveys_payload(
    role: str | None = None,
    counselor_id: str | None = None,
    student_id: str | None = None,
) -> dict:
    return {
        "surveys": student_database.list_surveys(
            STUDENT_DB,
            role=role,
            counselor_id=counselor_id,
            student_id=student_id,
        )
    }


def survey_payload(survey_id: int) -> dict:
    return student_database.get_survey(survey_id, STUDENT_DB)


def create_survey_payload(payload: dict) -> dict:
    return {"survey": student_database.create_survey(payload, STUDENT_DB)}


def submit_survey_result_payload(survey_id: int, payload: dict) -> dict:
    return student_database.submit_survey_result(survey_id, payload, STUDENT_DB)


def recommend_payload(payload: dict) -> dict:
    answers_list = payload.get("answers")
    if not isinstance(answers_list, list):
        raise ValueError("answers must be a list of 60 scores")

    answers = {idx + 1: int(value) for idx, value in enumerate(answers_list)}
    return recommend_from_answers(answers)


def recommend_from_answers(answers: dict[int, int]) -> dict:
    question_map = load_question_map(active_question_map_path())
    careers = load_career_vectors(CAREER_VECTORS)
    student_vector = score_student_answers(answers, question_map)
    ranked = rank_careers(student_vector, careers, top_n=10)

    return {
        "student_vector": dict(zip(RIASEC_ORDER, student_vector)),
        "results": [
            {
                "rank": item.rank,
                "soc_code": item.soc_code,
                "title": item.title,
                "score": round(item.score, 4),
                "vector": dict(zip(RIASEC_ORDER, item.vector)),
            }
            for item in ranked
        ],
    }


def _profile_text(student: dict) -> str:
    fields = [
        "careerFit",
        "favoriteCareer",
        "desiredCareerStyle",
        "preferredActivities",
        "curiosityTopics",
        "favoriteSubject",
        "leastFavoriteSubject",
        "riasecTop3",
        "mbti",
        "disc",
    ]
    return " ".join(str(student.get(field, "")) for field in fields).lower()


def _student_profile_weights(student: dict) -> dict[str, int]:
    weights = dict.fromkeys(RIASEC_ORDER, 3)

    riasec = str(student.get("riasecTop3", "")).upper()
    for index, dimension in enumerate([char for char in riasec if char in RIASEC_ORDER][:3]):
        weights[dimension] = max(weights[dimension], 5 if index == 0 else 4)

    text = _profile_text(student)
    keyword_weights = [
        (("technology", "công nghệ", "kỹ thuật", "technical", "building", "robot", "ict", "tin học"), {"R": 4, "I": 5, "C": 4}),
        (("science", "research", "nghiên cứu", "phân tích", "data", "logic"), {"I": 5, "C": 4}),
        (("design", "architecture", "art", "nghệ thuật", "creative", "writing", "viết"), {"A": 5, "I": 4}),
        (("teaching", "education", "giáo dục", "helping", "dịch vụ", "social"), {"S": 5, "E": 4}),
        (("business", "kinh tế", "finance", "lãnh đạo", "debating", "sales"), {"E": 5, "C": 4}),
        (("administration", "accounting", "hành chính", "organized", "finance"), {"C": 5, "E": 4}),
        (("health", "medical", "y tế", "sức khỏe"), {"I": 5, "S": 5}),
    ]
    for keywords, additions in keyword_weights:
        if any(keyword in text for keyword in keywords):
            for dimension, value in additions.items():
                weights[dimension] = max(weights[dimension], value)

    iq = student.get("iq")
    eq = student.get("eq")
    if isinstance(iq, (int, float)) and iq >= 115:
        weights["I"] = max(weights["I"], 5)
    if isinstance(eq, (int, float)) and eq >= 75:
        weights["S"] = max(weights["S"], 4)

    return weights


def student_recommend_payload(payload: dict) -> dict:
    student = payload.get("student")
    student_id = payload.get("student_id")
    if not isinstance(student, dict):
        if not student_id:
            raise ValueError("student or student_id is required")
        student = student_database.get_student(str(student_id), STUDENT_DB)
        if student is None:
            raise LookupError(f"Student not found: {student_id}")
    else:
        student_id = student.get("id") or student_id

    question_map = load_question_map(active_question_map_path())
    weights = _student_profile_weights(student)
    answers = {
        question_id: weights.get(dimension, 3)
        for question_id, dimension in question_map.items()
    }
    recommendation = recommend_from_answers(answers)
    recommendation["student"] = {
        "id": student.get("id"),
        "name": student.get("name"),
        "careerFit": student.get("careerFit"),
        "favoriteCareer": student.get("favoriteCareer"),
        "riasecTop3": student.get("riasecTop3"),
    }
    recommendation["profile_weights"] = weights
    recommendation["source"] = "student_profile"
    if payload.get("persist"):
        if not student_id:
            raise ValueError("student_id is required when persist is true")
        recommendation = student_database.save_student_recommendation(
            str(student_id),
            recommendation,
            STUDENT_DB,
        )
    return recommendation


def dashboard_payload() -> dict:
    return student_database.dashboard(STUDENT_DB)


def app_data_payload() -> dict:
    return student_database.app_data(STUDENT_DB)


def identity_payload() -> dict:
    return student_database.identity_data(STUDENT_DB)


def reference_actions_payload() -> dict:
    return {"actions": student_database.list_reference_actions(STUDENT_DB)}


def sync_reference_actions_payload(payload: dict) -> dict:
    actions = student_database.sync_reference_actions(payload.get("actions"), STUDENT_DB)
    return {"actions": actions}


def student_references_payload(student_id: str) -> dict:
    if not student_id:
        raise ValueError("student_id is required")
    return student_database.get_student_references(student_id, STUDENT_DB)


def save_student_reference_payload(payload: dict) -> dict:
    return student_database.save_student_reference(payload, STUDENT_DB)


def students_payload(grade: str | None = None, class_name: str | None = None) -> dict:
    normalized_grade = int(grade) if grade else None
    return {"students": student_database.list_students(STUDENT_DB, normalized_grade, class_name)}


def student_payload(student_id: str) -> dict:
    student = student_database.get_student(student_id, STUDENT_DB)
    if student is None:
        raise LookupError(f"Student not found: {student_id}")
    return {"student": student}


def meetings_payload(
    role: str | None = None,
    student_id: str | None = None,
    counselor_id: str | None = None,
) -> dict:
    return {
        "meetings": student_database.list_meetings(
            STUDENT_DB,
            role=role,
            student_id=student_id,
            counselor_id=counselor_id,
        )
    }


def create_meeting_payload(payload: dict) -> dict:
    return {"meeting": student_database.create_meeting(payload, STUDENT_DB)}


def messages_payload(
    role: str | None = None,
    student_id: str | None = None,
    counselor_id: str | None = None,
) -> dict:
    return {
        "messages": student_database.list_messages(
            STUDENT_DB,
            role=role,
            student_id=student_id,
            counselor_id=counselor_id,
        )
    }


def create_message_payload(payload: dict) -> dict:
    return {"message": student_database.create_message(payload, STUDENT_DB)}


def mark_messages_seen_payload(payload: dict) -> dict:
    return {
        "messages": student_database.mark_messages_seen(
            payload,
            STUDENT_DB,
        )
    }


def advice_notes_payload(
    student_id: str | None = None,
    counselor_id: str | None = None,
    sort: str = "newest",
    page: str | int = 1,
    page_size: str | int = 25,
) -> dict:
    return student_database.list_advice_notes(
        STUDENT_DB,
        student_id=student_id,
        counselor_id=counselor_id,
        sort=sort,
        page=int(page or 1),
        page_size=int(page_size or 25),
    )


def create_advice_note_payload(payload: dict) -> dict:
    return {"note": student_database.create_advice_note(payload, STUDENT_DB)}


def delete_advice_note_payload(advice_id: int, counselor_id: str | None = None) -> dict:
    student_database.delete_advice_note(
        advice_id,
        STUDENT_DB,
        counselor_id=counselor_id,
    )
    return {"deleted": True, "id": advice_id}
