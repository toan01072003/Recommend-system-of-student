from __future__ import annotations

from pathlib import Path

try:
    from ..core.config import STUDENT_DB
    from ..repositories.students import StudentRepository
except ImportError:
    from core.config import STUDENT_DB
    from repositories.students import StudentRepository


def _repository(db_path: Path = STUDENT_DB) -> StudentRepository:
    return StudentRepository(db_path)


def list_students_payload(
    *,
    grade: str | int | None = None,
    class_name: str | None = None,
    db_path: Path = STUDENT_DB,
) -> dict:
    normalized_grade = int(grade) if grade not in (None, "") else None
    return {
        "students": _repository(db_path).list(
            grade=normalized_grade,
            class_name=class_name,
        )
    }


def get_student_payload(student_id: str, *, db_path: Path = STUDENT_DB) -> dict:
    student = _repository(db_path).get(student_id)
    if student is None:
        raise LookupError(f"Student not found: {student_id}")
    return {"student": student}


def create_student_payload(payload: dict, *, db_path: Path = STUDENT_DB) -> dict:
    return {"student": _repository(db_path).create(payload)}


def update_student_payload(
    student_id: str,
    payload: dict,
    *,
    db_path: Path = STUDENT_DB,
) -> dict:
    return {"student": _repository(db_path).update(student_id, payload)}


def delete_student_payload(student_id: str, *, db_path: Path = STUDENT_DB) -> dict:
    _repository(db_path).delete(student_id)
    return {"deleted": True, "id": student_id}
