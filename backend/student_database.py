from __future__ import annotations

import json
import sqlite3
from collections import Counter, defaultdict
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB = PROJECT_ROOT / "data" / "recommend_system.db"

CAREER_COLORS = ["#EA580C", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#0F766E", "#3B82F6", "#78716C"]
SUBJECT_FIELDS = [
    ("Toán", "math_score"),
    ("Ngữ văn", "literature_score"),
    ("Tiếng Anh", "english_score"),
    ("Khoa học", "science_score"),
    ("Lịch sử", "history_score"),
    ("Tin học", "ict_score"),
]


def connect(db_path: Path = DEFAULT_DB) -> sqlite3.Connection:
    if not db_path.exists():
        raise FileNotFoundError(f"Database not found: {db_path}. Run backend/import_student_profiles.py first.")
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def row_to_student(row: sqlite3.Row, *, include_detail: bool = False) -> dict:
    student = {
        "id": row["student_id"],
        "name": row["student_name"],
        "gender": row["gender"],
        "grade": row["grade"],
        "className": row["class_name"],
        "typeClass": row["class_type"],
        "province": row["province"],
        "ethnicGroup": row["ethnic_group"],
        "avg": round(row["average_score"], 2),
        "scoreTrend": round(row["score_trend"], 2),
        "careerFit": row["career_fit"],
        "testStatus": "Hoàn thành",
        "risk": row["risk_level"],
        "progress": row["progress"],
        "riasecTop3": row["riasec_top3"],
        "mbti": row["mbti"],
        "disc": row["disc"],
        "favoriteCareer": row["favorite_career"],
        "exploredCareers": json.loads(row["explored_careers_json"] or "[]"),
    }
    if not include_detail:
        return student

    student.update(
        {
            "fatherName": row["father_name"],
            "motherName": row["mother_name"],
            "fatherOccupation": row["father_occupation"],
            "motherOccupation": row["mother_occupation"],
            "fatherEducation": row["father_education"],
            "motherEducation": row["mother_education"],
            "scores": [{"subject": label, "score": row[field]} for label, field in SUBJECT_FIELDS],
            "achievements": row["academic_achievements"],
            "awards": row["awards_competitions"],
            "certificates": row["certificates"],
            "favoriteSubject": row["favorite_subject"],
            "leastFavoriteSubject": row["least_favorite_subject"],
            "preferredActivities": row["preferred_activities"],
            "curiosityTopics": row["curiosity_topics"],
            "introExtro": row["intro_extro"],
            "workStyle": row["work_style"],
            "iq": row["iq_score"],
            "eq": row["eq_score"],
            "expectedSalary": row["expected_salary_million"],
            "desiredCareerStyle": row["desired_career_style"],
            "dislikedCareer": row["disliked_career"],
            "stressLevel": row["stress_level"],
            "confidenceLevel": row["confidence_level"],
            "academicPressureLevel": row["academic_pressure_level"],
            "medicalHistory": row["medical_history_summary"],
            "parentExpectation": row["parent_expectation"],
            "parentFinanceLevel": row["parent_finance_level"],
        }
    )
    return student


def list_students(db_path: Path = DEFAULT_DB, grade: int | None = None, class_name: str | None = None) -> list[dict]:
    clauses: list[str] = []
    params: list[object] = []
    if grade is not None:
        clauses.append("grade = ?")
        params.append(grade)
    if class_name:
        clauses.append("class_name = ?")
        params.append(class_name)
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    with connect(db_path) as conn:
        rows = conn.execute(
            f"""
            SELECT * FROM students
            {where}
            ORDER BY grade DESC, class_name ASC, student_id ASC
            """,
            params,
        ).fetchall()
    return [row_to_student(row) for row in rows]


def academic_trend(conn: sqlite3.Connection, student_id: str) -> list[dict]:
    rows = conn.execute(
        """
        SELECT grade_level, term, AVG(score) AS average_score
        FROM score_history
        WHERE student_id = ?
        GROUP BY grade_level, term
        ORDER BY grade_level, term
        """,
        (student_id,),
    ).fetchall()
    return [
        {
            "term": f"{'HK1' if row['term'] == 'Semester 1' else 'HK2'}-{row['grade_level']}",
            "score": round(row["average_score"], 2),
        }
        for row in rows
    ]


def score_history(conn: sqlite3.Connection, student_id: str) -> list[dict]:
    rows = conn.execute(
        """
        SELECT grade_level, school_year, term, subject, score
        FROM score_history
        WHERE student_id = ?
        ORDER BY grade_level, term, subject
        """,
        (student_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def get_student(student_id: str, db_path: Path = DEFAULT_DB) -> dict | None:
    with connect(db_path) as conn:
        row = conn.execute("SELECT * FROM students WHERE student_id = ?", (student_id,)).fetchone()
        if row is None:
            return None
        student = row_to_student(row, include_detail=True)
        student["academicTrend"] = academic_trend(conn, student_id)
        student["scoreHistory"] = score_history(conn, student_id)
        return student


def dashboard(db_path: Path = DEFAULT_DB) -> dict:
    with connect(db_path) as conn:
        rows = conn.execute("SELECT * FROM students ORDER BY grade DESC, class_name ASC, student_id ASC").fetchall()

    students = [row_to_student(row) for row in rows]
    by_grade: dict[int, list[dict]] = defaultdict(list)
    by_class: dict[str, list[dict]] = defaultdict(list)
    career_counts: Counter[str] = Counter()
    for student in students:
        by_grade[student["grade"]].append(student)
        by_class[student["className"]].append(student)
        career_counts[student["careerFit"]] += 1

    grade_data = [
        {
            "grade": f"Lớp {grade}",
            "students": len(items),
            "completion": round(sum(item["progress"] for item in items) / len(items)),
            "tests": len(items),
        }
        for grade, items in sorted(by_grade.items())
    ]
    classes_data = [
        {
            "name": class_name,
            "grade": int(class_name[:-1]),
            "students": len(items),
            "completion": round(sum(item["progress"] for item in items) / len(items)),
            "avg": round(sum(item["avg"] for item in items) / len(items), 2),
            "risk": sum(1 for item in items if item["risk"] in {"medium", "high"}),
        }
        for class_name, items in sorted(by_class.items(), key=lambda item: (int(item[0][:-1]), item[0][-1]))
    ]

    class_progress = {item["name"]: item["completion"] for item in classes_data}
    heatmap_data = [
        {
            "grade": f"Lớp {grade}",
            "vals": [class_progress.get(f"{grade}{letter}", 0) for letter in "ABCDEFGH"],
        }
        for grade in sorted(by_grade)
    ]
    career_interest_dist = [
        {"name": name, "value": value, "color": CAREER_COLORS[idx % len(CAREER_COLORS)]}
        for idx, (name, value) in enumerate(career_counts.most_common())
    ]

    return {
        "summary": {
            "students": len(students),
            "grades": len(by_grade),
            "classes": len(by_class),
            "completion": round(sum(item["progress"] for item in students) / len(students)) if students else 0,
        },
        "gradeData": grade_data,
        "classesData": classes_data,
        "careerInterestDist": career_interest_dist,
        "heatmapData": heatmap_data,
    }


def app_data(db_path: Path = DEFAULT_DB) -> dict:
    payload = dashboard(db_path)
    payload["studentsInClass"] = list_students(db_path)
    return payload
