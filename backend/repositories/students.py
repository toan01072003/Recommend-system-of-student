from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path
from typing import Any

try:
    from ..core.config import STUDENT_DB
    from ..db import connect
    from .. import student_database
    from .base import SQLiteCrudRepository
except ImportError:
    from core.config import STUDENT_DB
    from db import connect
    import student_database
    from repositories.base import SQLiteCrudRepository


STUDENT_FIELD_MAP = {
    "id": "student_id",
    "studentId": "student_id",
    "name": "student_name",
    "studentName": "student_name",
    "fatherName": "father_name",
    "motherName": "mother_name",
    "className": "class_name",
    "typeClass": "class_type",
    "classType": "class_type",
    "province": "province",
    "gender": "gender",
    "ethnicGroup": "ethnic_group",
    "grade": "grade",
    "fatherOccupation": "father_occupation",
    "motherOccupation": "mother_occupation",
    "fatherEducation": "father_education",
    "motherEducation": "mother_education",
    "mathScore": "math_score",
    "literatureScore": "literature_score",
    "englishScore": "english_score",
    "scienceScore": "science_score",
    "historyScore": "history_score",
    "ictScore": "ict_score",
    "avg": "average_score",
    "averageScore": "average_score",
    "scoreTrend": "score_trend",
    "achievements": "academic_achievements",
    "academicAchievements": "academic_achievements",
    "awards": "awards_competitions",
    "awardsCompetitions": "awards_competitions",
    "certificates": "certificates",
    "riasecTop3": "riasec_top3",
    "favoriteSubject": "favorite_subject",
    "leastFavoriteSubject": "least_favorite_subject",
    "preferredActivities": "preferred_activities",
    "curiosityTopics": "curiosity_topics",
    "introExtro": "intro_extro",
    "workStyle": "work_style",
    "iq": "iq_score",
    "iqScore": "iq_score",
    "eq": "eq_score",
    "eqScore": "eq_score",
    "mbti": "mbti",
    "disc": "disc",
    "expectedSalary": "expected_salary_million",
    "expectedSalaryMillion": "expected_salary_million",
    "desiredCareerStyle": "desired_career_style",
    "careerFit": "career_fit",
    "favoriteCareer": "favorite_career",
    "favoriteCareers": "favorite_careers_json",
    "dislikedCareer": "disliked_career",
    "exploredCareers": "explored_careers_json",
    "currentExploredCareer": "current_explored_career",
    "latestRecommendCareer": "latest_recommend_career",
    "recommendHistory": "recommend_history_json",
    "personalStatement": "personal_statement",
    "skillMap": "skill_map_json",
    "skillMapJson": "skill_map_json",
    "targetUniversityId": "target_university_id",
    "targetUniversityName": "target_university_name",
    "targetUniversityProgram": "target_university_program",
    "targetUniversities": "target_universities_json",
    "stressLevel": "stress_level",
    "confidenceLevel": "confidence_level",
    "academicPressureLevel": "academic_pressure_level",
    "medicalHistory": "medical_history_summary",
    "medicalHistorySummary": "medical_history_summary",
    "parentExpectation": "parent_expectation",
    "expectFamily": "parent_expectation",
    "expect-family": "parent_expectation",
    "parentFinanceLevel": "parent_finance_level",
    "risk": "risk_level",
    "riskLevel": "risk_level",
    "progress": "progress",
}

STUDENT_COLUMNS = set(STUDENT_FIELD_MAP.values())
STUDENT_REQUIRED_COLUMNS = {"student_id", "student_name", "class_name", "class_type", "grade"}

STUDENT_DEFAULTS: dict[str, Any] = {
    "father_name": "",
    "mother_name": "",
    "class_type": "Thường",
    "province": "",
    "gender": "",
    "ethnic_group": "Kinh",
    "grade": 9,
    "father_occupation": "",
    "mother_occupation": "",
    "father_education": "",
    "mother_education": "",
    "math_score": 0,
    "literature_score": 0,
    "english_score": 0,
    "science_score": 0,
    "history_score": 0,
    "ict_score": 0,
    "average_score": 0,
    "score_trend": 0,
    "academic_achievements": "",
    "awards_competitions": "",
    "certificates": "",
    "riasec_top3": "",
    "favorite_subject": "",
    "least_favorite_subject": "",
    "preferred_activities": "",
    "curiosity_topics": "",
    "intro_extro": "",
    "work_style": "",
    "iq_score": 0,
    "eq_score": 0,
    "mbti": "",
    "disc": "",
    "expected_salary_million": 0,
    "desired_career_style": "",
    "career_fit": "",
    "favorite_career": "",
    "favorite_careers_json": "[]",
    "disliked_career": "",
    "explored_careers_json": "[]",
    "current_explored_career": "",
    "latest_recommend_career": "",
    "recommend_history_json": "[]",
    "personal_statement": "",
    "skill_map_json": "[]",
    "target_university_id": "",
    "target_university_name": "",
    "target_university_program": "",
    "target_universities_json": "[]",
    "stress_level": "",
    "confidence_level": "",
    "academic_pressure_level": "",
    "medical_history_summary": "",
    "parent_expectation": "",
    "parent_finance_level": "",
    "risk_level": "low",
    "progress": 0,
}

JSON_COLUMNS = {
    "explored_careers_json",
    "recommend_history_json",
    "favorite_careers_json",
    "target_universities_json",
    "skill_map_json",
}
INT_COLUMNS = {
    "grade",
    "iq_score",
    "eq_score",
    "expected_salary_million",
    "progress",
}
FLOAT_COLUMNS = {
    "math_score",
    "literature_score",
    "english_score",
    "science_score",
    "history_score",
    "ict_score",
    "average_score",
    "score_trend",
}


class StudentRepository:
    def __init__(self, db_path: Path = STUDENT_DB) -> None:
        self.db_path = db_path
        self.crud = SQLiteCrudRepository(
            table="students",
            id_column="student_id",
            writable_columns=sorted(STUDENT_COLUMNS - {"student_id"}),
            db_path=db_path,
            row_mapper=lambda row: student_database.row_to_student(row, include_detail=True),
        )

    def list(self, grade: int | None = None, class_name: str | None = None) -> list[dict]:
        return student_database.list_students(self.db_path, grade=grade, class_name=class_name)

    def get(self, student_id: str) -> dict | None:
        return student_database.get_student(student_id, self.db_path)

    def create(self, payload: dict) -> dict:
        values = {**STUDENT_DEFAULTS, **self._to_db_values(payload)}
        if not values.get("student_id"):
            with connect(self.db_path) as conn:
                values["student_id"] = self._next_student_id(conn)
        self._validate_create(values)
        self.crud.create(values)
        created = self.get(str(values["student_id"]))
        if created is None:
            raise LookupError(f"Student not found after create: {values['student_id']}")
        return created

    def update(self, student_id: str, payload: dict) -> dict:
        values = self._to_db_values(payload)
        values.pop("student_id", None)
        self.crud.update(student_id, values)
        updated = self.get(student_id)
        if updated is None:
            raise LookupError(f"Student not found after update: {student_id}")
        return updated

    def delete(self, student_id: str) -> None:
        deleted = self.crud.delete(student_id)
        if not deleted:
            raise LookupError(f"Student not found: {student_id}")

    def _to_db_values(self, payload: dict) -> dict[str, Any]:
        values: dict[str, Any] = {}
        for key, value in payload.items():
            column = STUDENT_FIELD_MAP.get(key)
            if column is None:
                continue
            values[column] = self._normalize_value(column, value)
        return values

    def _normalize_value(self, column: str, value: Any) -> Any:
        if column in JSON_COLUMNS:
            if isinstance(value, str):
                try:
                    json.loads(value)
                    return value
                except json.JSONDecodeError:
                    return json.dumps([value], ensure_ascii=False)
            return json.dumps(value if value is not None else [], ensure_ascii=False)
        if column in INT_COLUMNS:
            return int(value or 0)
        if column in FLOAT_COLUMNS:
            return float(value or 0)
        return "" if value is None else str(value).strip()

    def _validate_create(self, values: dict[str, Any]) -> None:
        missing = [column for column in STUDENT_REQUIRED_COLUMNS if not values.get(column)]
        if missing:
            raise ValueError(f"Missing required student fields: {', '.join(missing)}")

    def _next_student_id(self, conn: sqlite3.Connection) -> str:
        rows = conn.execute("SELECT student_id FROM students").fetchall()
        max_number = 0
        for row in rows:
            match = re.fullmatch(r"STU(\d+)", str(row["student_id"]))
            if match:
                max_number = max(max_number, int(match.group(1)))
        return f"STU{max_number + 1:03d}"
