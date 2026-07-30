from __future__ import annotations

import argparse
import json
import re
import sqlite3
from collections import defaultdict
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

try:
    from . import student_database
except ImportError:
    import student_database


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_EXCEL = PROJECT_ROOT / "data" / "synthetic_student_profiles_50_v2_names_score_history.xlsx"
DEFAULT_DB = PROJECT_ROOT / "data" / "recommend_system.db"

SPREADSHEET_NS = {
    "a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
PACKAGE_NS = {"rel": "http://schemas.openxmlformats.org/package/2006/relationships"}

SUBJECT_MAP = {
    "Math": "Toán",
    "Literature": "Ngữ văn",
    "English": "Tiếng Anh",
    "Science": "Khoa học",
    "History": "Lịch sử",
    "ICT": "Tin học",
}
SUBJECT_ORDER = ["Math", "Literature", "English", "Science", "History", "ICT"]
CAREER_STYLE_MAP = {
    "Technical/building": "Kỹ thuật & Công nghệ",
    "Research/analysis": "Nghiên cứu & Phân tích",
    "Business/leadership": "Kinh tế & Lãnh đạo",
    "People/helping": "Giáo dục & Xã hội",
    "Outdoor/practical": "Thực hành & Kỹ thuật",
    "Healthcare/service": "Y tế & Dịch vụ",
    "Creative/design": "Nghệ thuật & Thiết kế",
    "Stable administrative": "Hành chính & Dữ liệu",
}


def col_to_idx(cell_ref: str) -> int:
    match = re.match(r"([A-Z]+)", cell_ref)
    if not match:
        return 0
    idx = 0
    for char in match.group(1):
        idx = idx * 26 + ord(char) - ord("A") + 1
    return idx - 1


def load_sheet(workbook_path: Path, sheet_name: str) -> list[dict[str, str | None]]:
    with ZipFile(workbook_path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in root.findall("a:si", SPREADSHEET_NS):
                shared_strings.append("".join(text.text or "" for text in item.findall(".//a:t", SPREADSHEET_NS)))

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_map = {
            rel.attrib["Id"]: rel.attrib["Target"]
            for rel in rels.findall("rel:Relationship", PACKAGE_NS)
        }

        sheet_path: str | None = None
        for sheet in workbook.findall("a:sheets/a:sheet", SPREADSHEET_NS):
            if sheet.attrib["name"] != sheet_name:
                continue
            rel_id = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            target = rel_map[rel_id].lstrip("/")
            sheet_path = target if target.startswith("xl/") else f"xl/{target}"
            break
        if sheet_path is None:
            raise ValueError(f"Sheet not found: {sheet_name}")

        worksheet = ET.fromstring(archive.read(sheet_path))
        table: list[list[str | None]] = []
        for row in worksheet.findall("a:sheetData/a:row", SPREADSHEET_NS):
            values: list[str | None] = []
            for cell in row.findall("a:c", SPREADSHEET_NS):
                ref = cell.attrib.get("r", "")
                while len(values) <= col_to_idx(ref):
                    values.append(None)

                cell_type = cell.attrib.get("t")
                raw_value = cell.find("a:v", SPREADSHEET_NS)
                inline = cell.find("a:is/a:t", SPREADSHEET_NS)
                if cell_type == "s" and raw_value is not None:
                    value = shared_strings[int(raw_value.text or "0")]
                elif inline is not None:
                    value = inline.text
                elif raw_value is not None:
                    value = raw_value.text
                else:
                    value = None
                values[col_to_idx(ref)] = value
            table.append(values)

    if not table:
        return []
    header = [str(item) if item is not None else "" for item in table[0]]
    rows: list[dict[str, str | None]] = []
    for values in table[1:]:
        padded = values + [None] * (len(header) - len(values))
        rows.append(dict(zip(header, padded)))
    return rows


def to_float(value: str | None, default: float = 0.0) -> float:
    try:
        return float(value or default)
    except ValueError:
        return default


def to_int(value: str | None, default: int = 0) -> int:
    return int(round(to_float(value, default)))


def gender_vi(value: str | None) -> str:
    return {"Male": "Nam", "Female": "Nữ"}.get(value or "", value or "")


def ethnic_group_vi(value: str | None) -> str:
    return "Kinh" if value == "Kinh ethnic group" else "Khác"


def class_type_vi(value: str | None) -> str:
    return "Lớp nâng cao" if value == "Advanced" else "Lớp thường"


def risk_level(row: dict[str, str | None]) -> str:
    avg = to_float(row.get("Average_Score_2026_T1"))
    stress = row.get("Stress_Burnout_Level")
    pressure = row.get("Academic_Pressure_Level")
    confidence = row.get("Confidence_Level")
    if (stress == "High" and pressure == "High") or avg < 6.5:
        return "high"
    if stress == "High" or pressure == "High" or avg < 7.0:
        return "medium"
    if stress == "Moderate" or confidence == "Low":
        return "low"
    return "none"


def profile_progress(row: dict[str, str | None]) -> int:
    avg = to_float(row.get("Average_Score_2026_T1"))
    progress = 68
    if row.get("Academic_Achievements") and row.get("Academic_Achievements") != "None yet":
        progress += 8
    if row.get("Awards_Competitions") and row.get("Awards_Competitions") != "None yet":
        progress += 7
    if row.get("Certificates") and row.get("Certificates") != "None yet":
        progress += 7
    if row.get("RIASEC_Top3"):
        progress += 5
    if row.get("MBTI"):
        progress += 4
    if row.get("Confidence_Level") == "High":
        progress += 4
    if row.get("Stress_Burnout_Level") == "High":
        progress -= 8
    if avg < 6.5:
        progress -= 8
    return max(35, min(99, progress))


def assign_class_names(rows: list[dict[str, str | None]]) -> None:
    counters: dict[str, int] = defaultdict(int)
    letters = "ABCDEFGH"
    for row in rows:
        grade = str(row.get("Grade") or "")
        idx = counters[grade]
        counters[grade] += 1
        row["Class_Name"] = f"{grade}{letters[idx % len(letters)]}"


def create_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        PRAGMA foreign_keys = ON;

        DROP TABLE IF EXISTS survey_results;
        DROP TABLE IF EXISTS surveys;
        DROP TABLE IF EXISTS family_notes;
        DROP TABLE IF EXISTS advice_notes;
        DROP TABLE IF EXISTS messages;
        DROP TABLE IF EXISTS meetings;
        DROP TABLE IF EXISTS parent_students;
        DROP TABLE IF EXISTS counselor_students;
        DROP TABLE IF EXISTS teacher_classes;
        DROP TABLE IF EXISTS student_users;
        DROP TABLE IF EXISTS accounts;
        DROP TABLE IF EXISTS parents;
        DROP TABLE IF EXISTS counselors;
        DROP TABLE IF EXISTS teachers;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS score_history;
        DROP TABLE IF EXISTS students;
        DROP TABLE IF EXISTS import_metadata;

        CREATE TABLE import_metadata (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

        CREATE TABLE students (
            student_id TEXT PRIMARY KEY,
            student_name TEXT NOT NULL,
            father_name TEXT,
            mother_name TEXT,
            class_name TEXT NOT NULL,
            class_type TEXT NOT NULL,
            province TEXT,
            gender TEXT,
            ethnic_group TEXT,
            grade INTEGER NOT NULL,
            father_occupation TEXT,
            mother_occupation TEXT,
            father_education TEXT,
            mother_education TEXT,
            math_score REAL,
            literature_score REAL,
            english_score REAL,
            science_score REAL,
            history_score REAL,
            ict_score REAL,
            average_score REAL,
            score_trend REAL,
            academic_achievements TEXT,
            awards_competitions TEXT,
            certificates TEXT,
            riasec_top3 TEXT,
            favorite_subject TEXT,
            least_favorite_subject TEXT,
            preferred_activities TEXT,
            curiosity_topics TEXT,
            intro_extro TEXT,
            work_style TEXT,
            iq_score INTEGER,
            eq_score INTEGER,
            mbti TEXT,
            disc TEXT,
            expected_salary_million INTEGER,
            desired_career_style TEXT,
            career_fit TEXT,
            favorite_career TEXT,
            favorite_careers_json TEXT NOT NULL DEFAULT '[]',
            disliked_career TEXT,
            explored_careers_json TEXT NOT NULL,
            current_explored_career TEXT,
            latest_recommend_career TEXT,
            recommend_history_json TEXT NOT NULL DEFAULT '[]',
            personal_statement TEXT,
            skill_map_json TEXT NOT NULL DEFAULT '[]',
            target_university_id TEXT,
            target_university_name TEXT,
            target_university_program TEXT,
            target_universities_json TEXT NOT NULL DEFAULT '[]',
            stress_level TEXT,
            confidence_level TEXT,
            academic_pressure_level TEXT,
            medical_history_summary TEXT,
            parent_expectation TEXT,
            parent_finance_level TEXT,
            risk_level TEXT NOT NULL,
            progress INTEGER NOT NULL
        );

        CREATE TABLE score_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
            student_name TEXT NOT NULL,
            current_grade INTEGER NOT NULL,
            grade_level INTEGER NOT NULL,
            school_year TEXT NOT NULL,
            term TEXT NOT NULL,
            subject TEXT NOT NULL,
            score REAL NOT NULL
        );

        CREATE TABLE meetings (
            meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
            student_name TEXT NOT NULL,
            class_name TEXT,
            counselor_id TEXT NOT NULL DEFAULT 'COUNSELOR001' REFERENCES counselors(counselor_id) ON DELETE CASCADE,
            counselor_name TEXT NOT NULL DEFAULT 'Nguyễn Văn Minh',
            topic TEXT NOT NULL,
            meeting_type TEXT NOT NULL CHECK(meeting_type IN ('offline', 'online')),
            meeting_url TEXT,
            scheduled_at TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'scheduled',
            meeting_note TEXT,
            student_seen_at TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE messages (
            message_id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_type TEXT NOT NULL DEFAULT 'student' CHECK(conversation_type IN ('student', 'parent')),
            student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
            student_name TEXT NOT NULL,
            class_name TEXT,
            parent_id TEXT REFERENCES parents(parent_id) ON DELETE CASCADE,
            parent_name TEXT,
            counselor_id TEXT NOT NULL DEFAULT 'COUNSELOR001' REFERENCES counselors(counselor_id) ON DELETE CASCADE,
            counselor_name TEXT NOT NULL DEFAULT 'Nguyễn Văn Minh',
            sender_role TEXT NOT NULL CHECK(sender_role IN ('student', 'parent', 'counselor')),
            message_text TEXT NOT NULL,
            sent_at TEXT NOT NULL,
            student_seen_at TEXT,
            parent_seen_at TEXT,
            counselor_seen_at TEXT
        );

        CREATE TABLE advice_notes (
            advice_id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
            student_name TEXT NOT NULL,
            class_name TEXT,
            counselor_id TEXT NOT NULL DEFAULT 'COUNSELOR001' REFERENCES counselors(counselor_id) ON DELETE CASCADE,
            counselor_name TEXT NOT NULL DEFAULT 'Nguyễn Văn Minh',
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('high', 'medium', 'low')),
            student_seen_at TEXT,
            created_at TEXT NOT NULL
        );

        CREATE INDEX idx_students_grade_class ON students(grade, class_name);
        CREATE INDEX idx_students_risk ON students(risk_level);
        CREATE INDEX idx_score_history_student ON score_history(student_id, grade_level, term);
        CREATE INDEX idx_meetings_student_time ON meetings(student_id, scheduled_at);
        CREATE INDEX idx_meetings_counselor_time ON meetings(counselor_id, scheduled_at);
        CREATE INDEX idx_meetings_time ON meetings(scheduled_at);
        CREATE INDEX idx_messages_student_time ON messages(student_id, sent_at);
        CREATE INDEX idx_messages_counselor_time ON messages(counselor_id, sent_at);
        CREATE INDEX idx_messages_parent_time ON messages(parent_id, student_id, sent_at);
        CREATE INDEX idx_messages_conversation_time ON messages(conversation_type, sent_at);
        CREATE INDEX idx_advice_notes_student_time ON advice_notes(student_id, created_at);
        CREATE INDEX idx_advice_notes_counselor_time ON advice_notes(counselor_id, created_at);
        CREATE INDEX idx_advice_notes_priority ON advice_notes(priority);
        """
    )


def insert_students(conn: sqlite3.Connection, rows: list[dict[str, str | None]]) -> None:
    for row in rows:
        explored = [item.strip() for item in (row.get("Explored_Careers") or "").split(",") if item.strip()]
        desired_style = row.get("Desired_Career_Style") or ""
        conn.execute(
            """
            INSERT INTO students (
                student_id, student_name, father_name, mother_name, class_name, class_type,
                province, gender, ethnic_group, grade, father_occupation, mother_occupation,
                father_education, mother_education, math_score, literature_score, english_score,
                science_score, history_score, ict_score, average_score, score_trend,
                academic_achievements, awards_competitions, certificates, riasec_top3,
                favorite_subject, least_favorite_subject, preferred_activities, curiosity_topics,
                intro_extro, work_style, iq_score, eq_score, mbti, disc,
                expected_salary_million, desired_career_style, career_fit, favorite_career,
                favorite_careers_json, disliked_career, explored_careers_json, current_explored_career,
                latest_recommend_career, recommend_history_json, personal_statement, skill_map_json,
                target_university_id, target_university_name, target_university_program,
                target_universities_json, stress_level,
                confidence_level, academic_pressure_level, medical_history_summary,
                parent_expectation, parent_finance_level, risk_level, progress
            ) VALUES (
                :student_id, :student_name, :father_name, :mother_name, :class_name, :class_type,
                :province, :gender, :ethnic_group, :grade, :father_occupation, :mother_occupation,
                :father_education, :mother_education, :math_score, :literature_score, :english_score,
                :science_score, :history_score, :ict_score, :average_score, :score_trend,
                :academic_achievements, :awards_competitions, :certificates, :riasec_top3,
                :favorite_subject, :least_favorite_subject, :preferred_activities, :curiosity_topics,
                :intro_extro, :work_style, :iq_score, :eq_score, :mbti, :disc,
                :expected_salary_million, :desired_career_style, :career_fit, :favorite_career,
                :favorite_careers_json, :disliked_career, :explored_careers_json, :current_explored_career,
                :latest_recommend_career, :recommend_history_json, :personal_statement, :skill_map_json,
                :target_university_id, :target_university_name, :target_university_program,
                :target_universities_json, :stress_level,
                :confidence_level, :academic_pressure_level, :medical_history_summary,
                :parent_expectation, :parent_finance_level, :risk_level, :progress
            )
            """,
            {
                "student_id": row.get("Student_ID"),
                "student_name": row.get("Student_Name"),
                "father_name": row.get("Father_Name"),
                "mother_name": row.get("Mother_Name"),
                "class_name": row.get("Class_Name"),
                "class_type": class_type_vi(row.get("Type_Class")),
                "province": row.get("Province"),
                "gender": gender_vi(row.get("Gender")),
                "ethnic_group": ethnic_group_vi(row.get("Ethnic_Group")),
                "grade": to_int(row.get("Grade")),
                "father_occupation": row.get("Father_Occupation"),
                "mother_occupation": row.get("Mother_Occupation"),
                "father_education": row.get("Father_Education"),
                "mother_education": row.get("Mother_Education"),
                "math_score": to_float(row.get("Math_2026_T1")),
                "literature_score": to_float(row.get("Literature_2026_T1")),
                "english_score": to_float(row.get("English_2026_T1")),
                "science_score": to_float(row.get("Science_2026_T1")),
                "history_score": to_float(row.get("History_2026_T1")),
                "ict_score": to_float(row.get("ICT_2026_T1")),
                "average_score": to_float(row.get("Average_Score_2026_T1")),
                "score_trend": to_float(row.get("Score_Trend_2025T1_to_2026T1")),
                "academic_achievements": row.get("Academic_Achievements"),
                "awards_competitions": row.get("Awards_Competitions"),
                "certificates": row.get("Certificates"),
                "riasec_top3": row.get("RIASEC_Top3"),
                "favorite_subject": SUBJECT_MAP.get(row.get("Favorite_Subject") or "", row.get("Favorite_Subject")),
                "least_favorite_subject": SUBJECT_MAP.get(row.get("Least_Favorite_Subject") or "", row.get("Least_Favorite_Subject")),
                "preferred_activities": row.get("Preferred_Activities"),
                "curiosity_topics": row.get("Curiosity_Topics"),
                "intro_extro": row.get("Personality_Intro_Extro"),
                "work_style": row.get("Personality_Work_Style"),
                "iq_score": to_int(row.get("IQ_Test_Score")),
                "eq_score": to_int(row.get("EQ_Test_Score")),
                "mbti": row.get("MBTI"),
                "disc": row.get("DISC"),
                "expected_salary_million": to_int(row.get("Expected_Salary_VND_Month_Million")),
                "desired_career_style": desired_style,
                "career_fit": CAREER_STYLE_MAP.get(desired_style, desired_style),
                "favorite_career": row.get("Favorite_Career"),
                "favorite_careers_json": json.dumps(
                    [row.get("Favorite_Career")] if row.get("Favorite_Career") else [],
                    ensure_ascii=False,
                ),
                "disliked_career": row.get("Disliked_Career"),
                "explored_careers_json": json.dumps(explored, ensure_ascii=False),
                "current_explored_career": explored[0] if explored else row.get("Favorite_Career"),
                "latest_recommend_career": None,
                "recommend_history_json": "[]",
                "personal_statement": "",
                "skill_map_json": "[]",
                "target_university_id": "",
                "target_university_name": "",
                "target_university_program": "",
                "target_universities_json": "[]",
                "stress_level": row.get("Stress_Burnout_Level"),
                "confidence_level": row.get("Confidence_Level"),
                "academic_pressure_level": row.get("Academic_Pressure_Level"),
                "medical_history_summary": row.get("Medical_History_Summary"),
                "parent_expectation": row.get("Parent_Expectation"),
                "parent_finance_level": row.get("Parent_Finance_Level"),
                "risk_level": risk_level(row),
                "progress": profile_progress(row),
            },
        )


def insert_score_history(conn: sqlite3.Connection, rows: list[dict[str, str | None]]) -> None:
    for row in rows:
        conn.execute(
            """
            INSERT INTO score_history (
                student_id, student_name, current_grade, grade_level, school_year, term, subject, score
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                row.get("Student_ID"),
                row.get("Student_Name"),
                to_int(row.get("Current_Grade")),
                to_int(row.get("Grade_Level")),
                row.get("School_Year"),
                row.get("Term"),
                SUBJECT_MAP.get(row.get("Subject") or "", row.get("Subject")),
                to_float(row.get("Score")),
            ),
        )


def import_workbook(excel_path: Path, db_path: Path) -> dict:
    profiles = load_sheet(excel_path, "Wide_Profile_50")
    score_history = load_sheet(excel_path, "Score_History_Long")
    assign_class_names(profiles)

    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        create_schema(conn)
        insert_students(conn, profiles)
        student_database.seed_student_career_profile_data(conn)
        insert_score_history(conn, score_history)
        student_database.ensure_identity_tables(conn)
        student_database.seed_identity_data(conn)
        student_database.ensure_surveys_tables(conn)
        conn.executemany(
            "INSERT INTO import_metadata(key, value) VALUES (?, ?)",
            [
                ("source_excel", str(excel_path)),
                ("profile_count", str(len(profiles))),
                ("score_history_count", str(len(score_history))),
            ],
        )
        conn.commit()

    return {
        "db": str(db_path),
        "source": str(excel_path),
        "students": len(profiles),
        "score_history_rows": len(score_history),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import synthetic student profiles Excel into SQLite.")
    parser.add_argument("--excel", type=Path, default=DEFAULT_EXCEL)
    parser.add_argument("--db", type=Path, default=DEFAULT_DB)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    result = import_workbook(args.excel, args.db)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
