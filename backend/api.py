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


def recommend_payload(payload: dict) -> dict:
    answers_list = payload.get("answers")
    if not isinstance(answers_list, list):
        raise ValueError("answers must be a list of 60 scores")

    answers = {idx + 1: int(value) for idx, value in enumerate(answers_list)}
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


def dashboard_payload() -> dict:
    return student_database.dashboard(STUDENT_DB)


def app_data_payload() -> dict:
    return student_database.app_data(STUDENT_DB)


def students_payload(grade: str | None = None, class_name: str | None = None) -> dict:
    normalized_grade = int(grade) if grade else None
    return {"students": student_database.list_students(STUDENT_DB, normalized_grade, class_name)}


def student_payload(student_id: str) -> dict:
    student = student_database.get_student(student_id, STUDENT_DB)
    if student is None:
        raise LookupError(f"Student not found: {student_id}")
    return {"student": student}
