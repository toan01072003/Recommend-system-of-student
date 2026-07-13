from __future__ import annotations

import json
import sqlite3
from collections import Counter, defaultdict
from datetime import datetime, timezone
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
    conn.execute("PRAGMA foreign_keys = ON")
    conn.row_factory = sqlite3.Row
    ensure_recommendation_columns(conn)
    ensure_identity_tables(conn)
    seed_identity_data(conn)
    ensure_meetings_table(conn)
    ensure_messages_table(conn)
    ensure_advice_notes_table(conn)
    ensure_surveys_tables(conn)
    ensure_reference_tables(conn)
    return conn


def ensure_recommendation_columns(conn: sqlite3.Connection) -> None:
    columns = {row["name"] for row in conn.execute("PRAGMA table_info(students)").fetchall()}
    additions = [
        ("current_explored_career", "TEXT"),
        ("latest_recommend_career", "TEXT"),
        ("recommend_history_json", "TEXT NOT NULL DEFAULT '[]'"),
    ]

    for column, definition in additions:
        if column not in columns:
            conn.execute(f"ALTER TABLE students ADD COLUMN {column} {definition}")

    conn.execute(
        """
        UPDATE students
        SET current_explored_career = COALESCE(
            NULLIF(current_explored_career, ''),
            NULLIF(json_extract(explored_careers_json, '$[0]'), ''),
            favorite_career
        )
        WHERE current_explored_career IS NULL OR current_explored_career = ''
        """
    )
    conn.execute(
        """
        UPDATE students
        SET recommend_history_json = '[]'
        WHERE recommend_history_json IS NULL OR recommend_history_json = ''
        """
    )


def _table_exists(conn: sqlite3.Connection, table: str) -> bool:
    return (
        conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
            (table,),
        ).fetchone()
        is not None
    )


def _table_columns(conn: sqlite3.Connection, table: str) -> set[str]:
    if not _table_exists(conn, table):
        return set()
    return {row["name"] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}


def _has_foreign_key(
    conn: sqlite3.Connection,
    table: str,
    column: str,
    target_table: str,
    target_column: str,
) -> bool:
    if not _table_exists(conn, table):
        return False
    return any(
        row["from"] == column and row["table"] == target_table and row["to"] == target_column
        for row in conn.execute(f"PRAGMA foreign_key_list({table})").fetchall()
    )


def _read_existing_rows(conn: sqlite3.Connection, table: str) -> list[dict]:
    if not _table_exists(conn, table):
        return []
    return [dict(row) for row in conn.execute(f"SELECT * FROM {table}").fetchall()]


def _student_lookup(conn: sqlite3.Connection) -> dict[str, dict]:
    rows = conn.execute(
        """
        SELECT student_id, student_name, class_name
        FROM students
        """
    ).fetchall()
    return {row["student_id"]: dict(row) for row in rows}


def _counselor_lookup(conn: sqlite3.Connection) -> dict[str, str]:
    rows = conn.execute(
        """
        SELECT counselors.counselor_id, users.full_name
        FROM counselors
        JOIN users ON users.user_id = counselors.user_id
        """
    ).fetchall()
    return {row["counselor_id"]: row["full_name"] for row in rows}


def _get_counselor(conn: sqlite3.Connection, counselor_id: str) -> sqlite3.Row:
    row = conn.execute(
        """
        SELECT counselors.counselor_id, users.full_name
        FROM counselors
        JOIN users ON users.user_id = counselors.user_id
        WHERE counselors.counselor_id = ?
        """,
        (counselor_id,),
    ).fetchone()
    if row is None:
        raise LookupError(f"Counselor not found: {counselor_id}")
    return row


def _normalize_counselor_id(row: dict, counselors: dict[str, str]) -> str:
    counselor_id = str(row.get("counselor_id") or "COUNSELOR001").strip() or "COUNSELOR001"
    if counselor_id in counselors:
        return counselor_id
    return "COUNSELOR001"


MEETINGS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS meetings (
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
    student_seen_at TEXT,
    created_at TEXT NOT NULL
);
"""


MEETINGS_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_meetings_student_time
    ON meetings(student_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_counselor_time
    ON meetings(counselor_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_time
    ON meetings(scheduled_at);
"""


MESSAGES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_name TEXT,
    counselor_id TEXT NOT NULL DEFAULT 'COUNSELOR001' REFERENCES counselors(counselor_id) ON DELETE CASCADE,
    counselor_name TEXT NOT NULL DEFAULT 'Nguyễn Văn Minh',
    sender_role TEXT NOT NULL CHECK(sender_role IN ('student', 'counselor')),
    message_text TEXT NOT NULL,
    sent_at TEXT NOT NULL,
    student_seen_at TEXT,
    counselor_seen_at TEXT
);
"""


MESSAGES_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_messages_student_time
    ON messages(student_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_messages_counselor_time
    ON messages(counselor_id, sent_at);
"""


ADVICE_NOTES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS advice_notes (
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
"""


ADVICE_NOTES_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_advice_notes_student_time
    ON advice_notes(student_id, created_at);
CREATE INDEX IF NOT EXISTS idx_advice_notes_counselor_time
    ON advice_notes(counselor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_advice_notes_priority
    ON advice_notes(priority);
"""


def _communication_table_needs_rebuild(conn: sqlite3.Connection, table: str) -> bool:
    return (
        not _table_exists(conn, table)
        or "counselor_id" not in _table_columns(conn, table)
        or not _has_foreign_key(conn, table, "student_id", "students", "student_id")
        or not _has_foreign_key(conn, table, "counselor_id", "counselors", "counselor_id")
    )


def _rebuild_meetings_table(conn: sqlite3.Connection) -> None:
    rows = _read_existing_rows(conn, "meetings")
    students = _student_lookup(conn)
    counselors = _counselor_lookup(conn)

    conn.execute("DROP TABLE IF EXISTS meetings")
    conn.executescript(MEETINGS_TABLE_SQL)
    for row in rows:
        student = students.get(str(row.get("student_id") or ""))
        if student is None:
            continue
        counselor_id = _normalize_counselor_id(row, counselors)
        conn.execute(
            """
            INSERT INTO meetings (
                meeting_id, student_id, student_name, class_name, counselor_id,
                counselor_name, topic, meeting_type, meeting_url, scheduled_at,
                status, student_seen_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                row.get("meeting_id"),
                student["student_id"],
                student["student_name"],
                student["class_name"],
                counselor_id,
                counselors.get(counselor_id, row.get("counselor_name") or "Nguyễn Văn Minh"),
                row.get("topic"),
                row.get("meeting_type"),
                row.get("meeting_url"),
                row.get("scheduled_at"),
                row.get("status") or "scheduled",
                row.get("student_seen_at"),
                row.get("created_at"),
            ),
        )
    conn.executescript(MEETINGS_INDEX_SQL)
    conn.commit()


def _rebuild_messages_table(conn: sqlite3.Connection) -> None:
    rows = _read_existing_rows(conn, "messages")
    students = _student_lookup(conn)
    counselors = _counselor_lookup(conn)

    conn.execute("DROP TABLE IF EXISTS messages")
    conn.executescript(MESSAGES_TABLE_SQL)
    for row in rows:
        student = students.get(str(row.get("student_id") or ""))
        if student is None:
            continue
        counselor_id = _normalize_counselor_id(row, counselors)
        conn.execute(
            """
            INSERT INTO messages (
                message_id, student_id, student_name, class_name, counselor_id,
                counselor_name, sender_role, message_text, sent_at,
                student_seen_at, counselor_seen_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                row.get("message_id"),
                student["student_id"],
                student["student_name"],
                student["class_name"],
                counselor_id,
                counselors.get(counselor_id, row.get("counselor_name") or "Nguyễn Văn Minh"),
                row.get("sender_role"),
                row.get("message_text"),
                row.get("sent_at"),
                row.get("student_seen_at"),
                row.get("counselor_seen_at"),
            ),
        )
    conn.executescript(MESSAGES_INDEX_SQL)
    conn.commit()


def _rebuild_advice_notes_table(conn: sqlite3.Connection) -> None:
    rows = _read_existing_rows(conn, "advice_notes")
    students = _student_lookup(conn)
    counselors = _counselor_lookup(conn)

    conn.execute("DROP TABLE IF EXISTS advice_notes")
    conn.executescript(ADVICE_NOTES_TABLE_SQL)
    for row in rows:
        student = students.get(str(row.get("student_id") or ""))
        if student is None:
            continue
        counselor_id = _normalize_counselor_id(row, counselors)
        conn.execute(
            """
            INSERT INTO advice_notes (
                advice_id, student_id, student_name, class_name, counselor_id,
                counselor_name, title, body, priority, student_seen_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                row.get("advice_id"),
                student["student_id"],
                student["student_name"],
                student["class_name"],
                counselor_id,
                counselors.get(counselor_id, row.get("counselor_name") or "Nguyễn Văn Minh"),
                row.get("title"),
                row.get("body"),
                row.get("priority") or "medium",
                row.get("student_seen_at"),
                row.get("created_at"),
            ),
        )
    conn.executescript(ADVICE_NOTES_INDEX_SQL)
    conn.commit()


def ensure_meetings_table(conn: sqlite3.Connection) -> None:
    if _communication_table_needs_rebuild(conn, "meetings"):
        _rebuild_meetings_table(conn)
        return
    conn.executescript(MEETINGS_INDEX_SQL)


def row_to_meeting(row: sqlite3.Row) -> dict:
    return {
        "id": row["meeting_id"],
        "studentId": row["student_id"],
        "studentName": row["student_name"],
        "className": row["class_name"],
        "counselorId": row["counselor_id"],
        "counselorName": row["counselor_name"],
        "topic": row["topic"],
        "meetingType": row["meeting_type"],
        "meetingUrl": row["meeting_url"],
        "scheduledAt": row["scheduled_at"],
        "status": row["status"],
        "studentSeenAt": row["student_seen_at"],
        "createdAt": row["created_at"],
    }


def ensure_messages_table(conn: sqlite3.Connection) -> None:
    if _communication_table_needs_rebuild(conn, "messages"):
        _rebuild_messages_table(conn)
        return
    conn.executescript(MESSAGES_INDEX_SQL)


def row_to_message(row: sqlite3.Row) -> dict:
    return {
        "id": row["message_id"],
        "studentId": row["student_id"],
        "studentName": row["student_name"],
        "className": row["class_name"],
        "counselorId": row["counselor_id"],
        "counselorName": row["counselor_name"],
        "senderRole": row["sender_role"],
        "text": row["message_text"],
        "sentAt": row["sent_at"],
        "studentSeenAt": row["student_seen_at"],
        "counselorSeenAt": row["counselor_seen_at"],
    }


def ensure_advice_notes_table(conn: sqlite3.Connection) -> None:
    if _communication_table_needs_rebuild(conn, "advice_notes"):
        _rebuild_advice_notes_table(conn)
        return
    conn.executescript(ADVICE_NOTES_INDEX_SQL)


def row_to_advice_note(row: sqlite3.Row) -> dict:
    return {
        "id": row["advice_id"],
        "studentId": row["student_id"],
        "studentName": row["student_name"],
        "className": row["class_name"],
        "counselorId": row["counselor_id"],
        "counselorName": row["counselor_name"],
        "title": row["title"],
        "body": row["body"],
        "priority": row["priority"],
        "studentSeenAt": row["student_seen_at"],
        "createdAt": row["created_at"],
    }


SURVEYS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS surveys (
    survey_id INTEGER PRIMARY KEY AUTOINCREMENT,
    counselor_id TEXT NOT NULL REFERENCES counselors(counselor_id) ON DELETE CASCADE,
    counselor_name TEXT NOT NULL DEFAULT 'Nguyễn Văn Minh',
    title TEXT NOT NULL,
    description TEXT,
    questions_json TEXT NOT NULL DEFAULT '[]',
    answer_options_json TEXT NOT NULL DEFAULT '[]',
    open_at TEXT NOT NULL,
    close_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK(status IN ('draft', 'scheduled', 'active', 'closed')),
    assigned_student_ids_json TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
"""


SURVEY_RESULTS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS survey_results (
    result_id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL REFERENCES surveys(survey_id) ON DELETE CASCADE,
    student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    class_name TEXT,
    answers_json TEXT NOT NULL DEFAULT '[]',
    result_json TEXT NOT NULL DEFAULT '{}',
    submitted_at TEXT NOT NULL,
    UNIQUE(survey_id, student_id)
);
"""


SURVEYS_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_surveys_counselor_time
    ON surveys(counselor_id, open_at, close_at);
CREATE INDEX IF NOT EXISTS idx_surveys_status
    ON surveys(status);
CREATE INDEX IF NOT EXISTS idx_survey_results_survey
    ON survey_results(survey_id, submitted_at);
CREATE INDEX IF NOT EXISTS idx_survey_results_student
    ON survey_results(student_id, submitted_at);
"""


DEFAULT_SURVEY_ANSWER_OPTIONS = [
    {"value": 1, "label": "Rất không thích"},
    {"value": 2, "label": "Không thích"},
    {"value": 3, "label": "Phân vân"},
    {"value": 4, "label": "Thích"},
    {"value": 5, "label": "Rất thích"},
]


SURVEY_QUESTION_TYPES = {"scale", "single_choice", "multiple_choice", "text"}


def ensure_surveys_tables(conn: sqlite3.Connection) -> None:
    conn.executescript(SURVEYS_TABLE_SQL)
    conn.executescript(SURVEY_RESULTS_TABLE_SQL)
    conn.executescript(SURVEYS_INDEX_SQL)


REFERENCE_ACTIONS_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS career_actions (
    action_id TEXT PRIMARY KEY,
    career_id TEXT NOT NULL,
    career_name TEXT NOT NULL,
    field TEXT,
    label TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
);
"""


STUDENT_REFERENCES_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS student_action_references (
    student_id TEXT PRIMARY KEY REFERENCES students(student_id) ON DELETE CASCADE,
    reactions_json TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL
);
"""


REFERENCE_INDEX_SQL = """
CREATE INDEX IF NOT EXISTS idx_career_actions_career_order
    ON career_actions(career_id, sort_order);
"""


REFERENCE_EMOTIONS = {"hate", "dislike", "neutral", "like", "passion"}


def ensure_reference_tables(conn: sqlite3.Connection) -> None:
    conn.executescript(REFERENCE_ACTIONS_TABLE_SQL)
    conn.executescript(STUDENT_REFERENCES_TABLE_SQL)
    conn.executescript(REFERENCE_INDEX_SQL)


def _normalize_reference_action(raw_action: dict, index: int = 0) -> dict:
    action_id = str(raw_action.get("actionId") or raw_action.get("action_id") or raw_action.get("id") or "").strip()
    career_id = str(raw_action.get("careerId") or raw_action.get("career_id") or "").strip()
    career_name = str(raw_action.get("careerName") or raw_action.get("career_name") or "").strip()
    label = str(raw_action.get("label") or raw_action.get("text") or "").strip()
    if not action_id:
        raise ValueError("actionId is required")
    if not career_id:
        raise ValueError("careerId is required")
    if not career_name:
        raise ValueError("careerName is required")
    if not label:
        raise ValueError("label is required")
    try:
        sort_order = int(raw_action.get("sortOrder") or raw_action.get("sort_order") or index)
    except (TypeError, ValueError):
        sort_order = index
    return {
        "actionId": action_id,
        "careerId": career_id,
        "careerName": career_name,
        "field": str(raw_action.get("field") or "").strip(),
        "label": label,
        "sortOrder": sort_order,
    }


def _upsert_reference_action(conn: sqlite3.Connection, action: dict, now: str) -> dict:
    normalized = _normalize_reference_action(action)
    conn.execute(
        """
        INSERT INTO career_actions (
            action_id, career_id, career_name, field, label, sort_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(action_id) DO UPDATE SET
            career_id = excluded.career_id,
            career_name = excluded.career_name,
            field = excluded.field,
            label = excluded.label,
            sort_order = excluded.sort_order,
            updated_at = excluded.updated_at
        """,
        (
            normalized["actionId"],
            normalized["careerId"],
            normalized["careerName"],
            normalized["field"],
            normalized["label"],
            normalized["sortOrder"],
            now,
        ),
    )
    return normalized


def row_to_reference_action(row: sqlite3.Row | dict) -> dict:
    return {
        "actionId": row["action_id"],
        "careerId": row["career_id"],
        "careerName": row["career_name"],
        "field": row["field"],
        "label": row["label"],
        "sortOrder": row["sort_order"],
    }


def list_reference_actions(db_path: Path = DEFAULT_DB) -> list[dict]:
    conn = connect(db_path)
    try:
        rows = conn.execute(
            """
            SELECT *
            FROM career_actions
            ORDER BY career_name ASC, sort_order ASC, action_id ASC
            """
        ).fetchall()
        return [row_to_reference_action(row) for row in rows]
    finally:
        conn.close()


def sync_reference_actions(actions: object, db_path: Path = DEFAULT_DB) -> list[dict]:
    if not isinstance(actions, list):
        raise ValueError("actions must be a list")
    now = datetime.now(timezone.utc).isoformat()
    conn = connect(db_path)
    try:
        normalized = [
            _upsert_reference_action(conn, action, now)
            for action in actions
            if isinstance(action, dict)
        ]
        conn.commit()
        return normalized
    finally:
        conn.close()


def _student_reference_reactions(conn: sqlite3.Connection, student_id: str) -> list[dict]:
    row = conn.execute(
        "SELECT reactions_json FROM student_action_references WHERE student_id = ?",
        (student_id,),
    ).fetchone()
    if row is None:
        return []
    value = _json_value(row["reactions_json"], [])
    return value if isinstance(value, list) else []


def get_student_references(student_id: str, db_path: Path = DEFAULT_DB) -> dict:
    conn = connect(db_path)
    try:
        student = conn.execute(
            "SELECT student_id, student_name, class_name FROM students WHERE student_id = ?",
            (student_id,),
        ).fetchone()
        if student is None:
            raise LookupError(f"Student not found: {student_id}")

        actions = [
            row_to_reference_action(row)
            for row in conn.execute(
                """
                SELECT *
                FROM career_actions
                ORDER BY career_name ASC, sort_order ASC, action_id ASC
                """
            ).fetchall()
        ]
        reactions = _student_reference_reactions(conn, student_id)
        reaction_by_action = {
            str(item.get("actionId") or item.get("action_id")): item
            for item in reactions
            if isinstance(item, dict)
        }
        references = [
            {
                **action,
                "emotion": reaction_by_action.get(action["actionId"], {}).get("emotion"),
                "updatedAt": reaction_by_action.get(action["actionId"], {}).get("updatedAt"),
            }
            for action in actions
        ]
        return {
            "student": {
                "id": student["student_id"],
                "name": student["student_name"],
                "className": student["class_name"],
            },
            "actions": actions,
            "references": references,
        }
    finally:
        conn.close()


def save_student_reference(payload: dict, db_path: Path = DEFAULT_DB) -> dict:
    student_id = str(payload.get("studentId") or payload.get("student_id") or "").strip()
    action_payload = payload.get("action")
    action_id = str(payload.get("actionId") or payload.get("action_id") or "").strip()
    emotion = str(payload.get("emotion") or "").strip()
    if not student_id:
        raise ValueError("studentId is required")
    if not action_id and isinstance(action_payload, dict):
        action_id = str(action_payload.get("actionId") or action_payload.get("action_id") or "").strip()
    if not action_id:
        raise ValueError("actionId is required")
    if emotion not in REFERENCE_EMOTIONS:
        raise ValueError("emotion must be one of hate, dislike, neutral, like, passion")

    now = datetime.now(timezone.utc).isoformat()
    conn = connect(db_path)
    try:
        student = conn.execute(
            "SELECT student_id FROM students WHERE student_id = ?",
            (student_id,),
        ).fetchone()
        if student is None:
            raise LookupError(f"Student not found: {student_id}")

        action = None
        if isinstance(action_payload, dict):
            action = _upsert_reference_action(conn, action_payload, now)
        else:
            row = conn.execute(
                "SELECT * FROM career_actions WHERE action_id = ?",
                (action_id,),
            ).fetchone()
            if row is None:
                raise LookupError(f"Reference action not found: {action_id}")
            action = row_to_reference_action(row)

        reactions = _student_reference_reactions(conn, student_id)
        next_reaction = {
            "actionId": action_id,
            "emotion": emotion,
            "updatedAt": now,
        }
        found = False
        normalized_reactions = []
        for item in reactions:
            if not isinstance(item, dict):
                continue
            if str(item.get("actionId") or item.get("action_id")) == action_id:
                normalized_reactions.append(next_reaction)
                found = True
            else:
                normalized_reactions.append(
                    {
                        "actionId": str(item.get("actionId") or item.get("action_id") or ""),
                        "emotion": item.get("emotion"),
                        "updatedAt": item.get("updatedAt"),
                    }
                )
        if not found:
            normalized_reactions.append(next_reaction)

        conn.execute(
            """
            INSERT INTO student_action_references (student_id, reactions_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(student_id) DO UPDATE SET
                reactions_json = excluded.reactions_json,
                updated_at = excluded.updated_at
            """,
            (
                student_id,
                json.dumps(normalized_reactions, ensure_ascii=False),
                now,
            ),
        )
        conn.commit()
        return {
            "studentId": student_id,
            "action": action,
            "reference": next_reaction,
        }
    finally:
        conn.close()


def _json_value(value: str | None, default):
    if not value:
        return default
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return default


def _parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _survey_effective_status(row: sqlite3.Row | dict) -> str:
    stored_status = row["status"]
    if stored_status in {"draft", "closed"}:
        return stored_status

    now = datetime.now(timezone.utc)
    open_at = _parse_datetime(row["open_at"])
    close_at = _parse_datetime(row["close_at"])
    if open_at and now < open_at:
        return "scheduled"
    if close_at and now > close_at:
        return "closed"
    return "active"


def _normalize_question(raw_question: dict, index: int) -> dict:
    question_id = str(raw_question.get("id") or raw_question.get("questionId") or index + 1)
    text = str(raw_question.get("text") or raw_question.get("question") or "").strip()
    if not text:
        raise ValueError(f"Question {index + 1} is missing text")

    raw_options = raw_question.get("options")
    options = []
    if isinstance(raw_options, list):
        for option in raw_options:
            if isinstance(option, dict):
                label = str(option.get("label") or option.get("text") or option.get("name") or "").strip()
                value = option.get("value", label)
                if label:
                    options.append({"value": value, "label": label})
            else:
                label = str(option).strip()
                if label:
                    options.append({"value": label, "label": label})

    question_type = str(raw_question.get("type") or ("single_choice" if options else "scale")).strip()
    if question_type not in SURVEY_QUESTION_TYPES:
        question_type = "scale"

    return {
        "id": question_id,
        "text": text,
        "type": question_type,
        "area": raw_question.get("area") or raw_question.get("dimension") or "",
        "options": options,
    }


def _normalize_questions(questions: object) -> list[dict]:
    if not isinstance(questions, list) or not questions:
        raise ValueError("questions must be a non-empty list")
    return [
        _normalize_question(question, index)
        for index, question in enumerate(questions)
        if isinstance(question, dict)
    ]


def _resolve_assigned_student_ids(conn: sqlite3.Connection, payload: dict) -> list[str]:
    requested_ids = {
        str(student_id).strip()
        for student_id in payload.get("studentIds", []) or payload.get("student_ids", []) or []
        if str(student_id).strip()
    }
    class_names = {
        str(class_name).strip()
        for class_name in payload.get("classNames", []) or payload.get("class_names", []) or []
        if str(class_name).strip()
    }
    grades = {
        int(grade)
        for grade in payload.get("grades", []) or []
        if str(grade).strip().isdigit()
    }

    clauses: list[str] = []
    params: list[object] = []
    if requested_ids:
        placeholders = ",".join("?" for _ in requested_ids)
        clauses.append(f"student_id IN ({placeholders})")
        params.extend(sorted(requested_ids))
    if class_names:
        placeholders = ",".join("?" for _ in class_names)
        clauses.append(f"class_name IN ({placeholders})")
        params.extend(sorted(class_names))
    if grades:
        placeholders = ",".join("?" for _ in grades)
        clauses.append(f"grade IN ({placeholders})")
        params.extend(sorted(grades))

    if not clauses:
        raise ValueError("At least one student, class, or grade must be selected")

    rows = conn.execute(
        f"""
        SELECT student_id
        FROM students
        WHERE {" OR ".join(clauses)}
        ORDER BY grade DESC, class_name ASC, student_id ASC
        """,
        params,
    ).fetchall()
    student_ids = [row["student_id"] for row in rows]
    if not student_ids:
        raise ValueError("No students matched the selected survey access")
    return student_ids


def _survey_progress(conn: sqlite3.Connection, survey_id: int) -> int:
    return conn.execute(
        "SELECT COUNT(*) AS total FROM survey_results WHERE survey_id = ?",
        (survey_id,),
    ).fetchone()["total"]


def row_to_survey(row: sqlite3.Row | dict, *, submitted_count: int | None = None) -> dict:
    assigned_student_ids = _json_value(row["assigned_student_ids_json"], [])
    submitted = submitted_count
    if submitted is None:
        submitted = int(row["submitted_count"]) if "submitted_count" in row.keys() else 0
    total = len(assigned_student_ids)

    return {
        "id": row["survey_id"],
        "counselorId": row["counselor_id"],
        "counselorName": row["counselor_name"],
        "title": row["title"],
        "description": row["description"],
        "questions": _json_value(row["questions_json"], []),
        "answerOptions": _json_value(row["answer_options_json"], DEFAULT_SURVEY_ANSWER_OPTIONS),
        "openAt": row["open_at"],
        "closeAt": row["close_at"],
        "status": _survey_effective_status(row),
        "storedStatus": row["status"],
        "assignedStudentIds": assigned_student_ids,
        "assignedCount": total,
        "submittedCount": submitted,
        "progressPercent": round((submitted / total) * 100) if total else 0,
        "createdAt": row["created_at"],
        "updatedAt": row["updated_at"],
    }


def row_to_survey_result(row: sqlite3.Row | dict) -> dict:
    return {
        "id": row["result_id"],
        "surveyId": row["survey_id"],
        "studentId": row["student_id"],
        "studentName": row["student_name"],
        "className": row["class_name"],
        "answers": _json_value(row["answers_json"], []),
        "result": _json_value(row["result_json"], {}),
        "submittedAt": row["submitted_at"],
    }


RIASEC_AREA_MAP = {
    "R": "Realistic",
    "I": "Investigative",
    "A": "Artistic",
    "S": "Social",
    "E": "Enterprising",
    "C": "Conventional",
    "REALISTIC": "Realistic",
    "INVESTIGATIVE": "Investigative",
    "ARTISTIC": "Artistic",
    "SOCIAL": "Social",
    "ENTERPRISING": "Enterprising",
    "CONVENTIONAL": "Conventional",
}


def _answer_value(answer: dict) -> object:
    for key in ("value", "answer", "score", "option"):
        if key in answer:
            return answer[key]
    return None


def compute_survey_result(questions: list[dict], answers: list[dict]) -> dict:
    question_by_id = {str(question["id"]): question for question in questions}
    numeric_values: list[float] = []
    dimension_values: dict[str, list[float]] = defaultdict(list)

    for answer in answers:
        if not isinstance(answer, dict):
            continue
        question_id = str(answer.get("questionId") or answer.get("id") or "")
        value = _answer_value(answer)
        question = question_by_id.get(question_id)
        question_type = str(question.get("type") if question else "").strip()
        if question_type in {"text", "multiple_choice"} or isinstance(value, list):
            continue
        try:
            numeric_value = float(value)
        except (TypeError, ValueError):
            continue

        numeric_values.append(numeric_value)
        if not question:
            continue
        area = str(question.get("area") or "").strip().upper()
        area_key = RIASEC_AREA_MAP.get(area[:1]) or RIASEC_AREA_MAP.get(area)
        if area_key:
            dimension_values[area_key].append(numeric_value)

    dimension_scores = {
        dimension: round(sum(values) / len(values), 2)
        for dimension, values in dimension_values.items()
        if values
    }
    top_dimensions = [
        dimension
        for dimension, _score in sorted(
            dimension_scores.items(),
            key=lambda item: item[1],
            reverse=True,
        )[:3]
    ]

    return {
        "answeredCount": len(answers),
        "totalQuestions": len(questions),
        "averageScore": round(sum(numeric_values) / len(numeric_values), 2) if numeric_values else None,
        "dimensionScores": dimension_scores,
        "topDimensions": top_dimensions,
        "summary": " - ".join(top_dimensions) if top_dimensions else "Đã ghi nhận câu trả lời",
    }


def list_surveys(
    db_path: Path = DEFAULT_DB,
    *,
    role: str | None = None,
    counselor_id: str | None = None,
    student_id: str | None = None,
) -> list[dict]:
    clauses: list[str] = []
    params: list[object] = []
    if counselor_id:
        clauses.append("surveys.counselor_id = ?")
        params.append(counselor_id)

    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    conn = connect(db_path)
    try:
        rows = conn.execute(
            f"""
            SELECT surveys.*,
                   COUNT(survey_results.result_id) AS submitted_count
            FROM surveys
            LEFT JOIN survey_results ON survey_results.survey_id = surveys.survey_id
            {where}
            GROUP BY surveys.survey_id
            ORDER BY surveys.created_at DESC, surveys.survey_id DESC
            """,
            params,
        ).fetchall()
        surveys = [row_to_survey(row) for row in rows]
        if role == "student" or student_id:
            surveys = [
                survey
                for survey in surveys
                if student_id and student_id in survey["assignedStudentIds"]
            ]
            result_rows = conn.execute(
                """
                SELECT *
                FROM survey_results
                WHERE student_id = ?
                """,
                (student_id,),
            ).fetchall() if student_id else []
            results_by_survey = {
                row["survey_id"]: row_to_survey_result(row)
                for row in result_rows
            }
            for survey in surveys:
                survey["studentResult"] = results_by_survey.get(survey["id"])
                survey["studentCompleted"] = survey["id"] in results_by_survey
        return surveys
    finally:
        conn.close()


def get_survey(survey_id: int, db_path: Path = DEFAULT_DB) -> dict:
    conn = connect(db_path)
    try:
        row = conn.execute(
            """
            SELECT surveys.*,
                   COUNT(survey_results.result_id) AS submitted_count
            FROM surveys
            LEFT JOIN survey_results ON survey_results.survey_id = surveys.survey_id
            WHERE surveys.survey_id = ?
            GROUP BY surveys.survey_id
            """,
            (survey_id,),
        ).fetchone()
        if row is None:
            raise LookupError(f"Survey not found: {survey_id}")

        survey = row_to_survey(row)
        assigned_ids = survey["assignedStudentIds"]
        results = {
            row["student_id"]: row_to_survey_result(row)
            for row in conn.execute(
                "SELECT * FROM survey_results WHERE survey_id = ?",
                (survey_id,),
            ).fetchall()
        }
        assignees: list[dict] = []
        if assigned_ids:
            placeholders = ",".join("?" for _ in assigned_ids)
            rows = conn.execute(
                f"""
                SELECT student_id, student_name, class_name, grade
                FROM students
                WHERE student_id IN ({placeholders})
                ORDER BY grade DESC, class_name ASC, student_id ASC
                """,
                assigned_ids,
            ).fetchall()
            for student in rows:
                result = results.get(student["student_id"])
                assignees.append(
                    {
                        "studentId": student["student_id"],
                        "studentName": student["student_name"],
                        "className": student["class_name"],
                        "grade": student["grade"],
                        "status": "completed" if result else "pending",
                        "submittedAt": result["submittedAt"] if result else None,
                        "result": result["result"] if result else None,
                    }
                )

        survey["assignees"] = assignees
        survey["results"] = list(results.values())
        return {"survey": survey}
    finally:
        conn.close()


def create_survey(payload: dict, db_path: Path = DEFAULT_DB) -> dict:
    counselor_id = str(payload.get("counselorId") or payload.get("counselor_id") or "COUNSELOR001").strip()
    title = str(payload.get("title") or "").strip()
    description = str(payload.get("description") or "").strip()
    open_at = str(payload.get("openAt") or payload.get("open_at") or "").strip()
    close_at = str(payload.get("closeAt") or payload.get("close_at") or "").strip()
    status = str(payload.get("status") or "scheduled").strip().lower()
    if status not in {"draft", "scheduled", "active", "closed"}:
        status = "scheduled"
    if not title:
        raise ValueError("title is required")
    if not open_at:
        raise ValueError("openAt is required")
    if not close_at:
        raise ValueError("closeAt is required")
    parsed_open = _parse_datetime(open_at)
    parsed_close = _parse_datetime(close_at)
    if parsed_open is None or parsed_close is None:
        raise ValueError("openAt and closeAt must be valid ISO datetime values")
    if parsed_close <= parsed_open:
        raise ValueError("closeAt must be after openAt")

    questions = _normalize_questions(payload.get("questions"))
    answer_options = payload.get("answerOptions") or payload.get("answer_options") or DEFAULT_SURVEY_ANSWER_OPTIONS
    if not isinstance(answer_options, list):
        answer_options = DEFAULT_SURVEY_ANSWER_OPTIONS

    conn = connect(db_path)
    try:
        counselor = _get_counselor(conn, counselor_id or "COUNSELOR001")
        assigned_student_ids = _resolve_assigned_student_ids(conn, payload)
        now = datetime.now(timezone.utc).isoformat()
        cursor = conn.execute(
            """
            INSERT INTO surveys (
                counselor_id, counselor_name, title, description, questions_json,
                answer_options_json, open_at, close_at, status,
                assigned_student_ids_json, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                counselor["counselor_id"],
                counselor["full_name"],
                title,
                description or None,
                json.dumps(questions, ensure_ascii=False),
                json.dumps(answer_options, ensure_ascii=False),
                open_at,
                close_at,
                status,
                json.dumps(assigned_student_ids, ensure_ascii=False),
                now,
                now,
            ),
        )
        conn.commit()
        return get_survey(cursor.lastrowid, db_path)["survey"]
    finally:
        conn.close()


def submit_survey_result(
    survey_id: int,
    payload: dict,
    db_path: Path = DEFAULT_DB,
) -> dict:
    student_id = str(payload.get("studentId") or payload.get("student_id") or "").strip()
    answers = payload.get("answers")
    if not student_id:
        raise ValueError("studentId is required")
    if not isinstance(answers, list):
        raise ValueError("answers must be a list")

    conn = connect(db_path)
    try:
        survey_row = conn.execute(
            "SELECT * FROM surveys WHERE survey_id = ?",
            (survey_id,),
        ).fetchone()
        if survey_row is None:
            raise LookupError(f"Survey not found: {survey_id}")
        survey = row_to_survey(survey_row, submitted_count=_survey_progress(conn, survey_id))
        if student_id not in survey["assignedStudentIds"]:
            raise ValueError("student is not assigned to this survey")
        if survey["status"] not in {"active"}:
            raise ValueError("survey is not open")

        student = conn.execute(
            """
            SELECT student_id, student_name, class_name
            FROM students
            WHERE student_id = ?
            """,
            (student_id,),
        ).fetchone()
        if student is None:
            raise LookupError(f"Student not found: {student_id}")

        result = compute_survey_result(survey["questions"], answers)
        submitted_at = datetime.now(timezone.utc).isoformat()
        cursor = conn.execute(
            """
            INSERT INTO survey_results (
                survey_id, student_id, student_name, class_name, answers_json,
                result_json, submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(survey_id, student_id) DO UPDATE SET
                student_name = excluded.student_name,
                class_name = excluded.class_name,
                answers_json = excluded.answers_json,
                result_json = excluded.result_json,
                submitted_at = excluded.submitted_at
            """,
            (
                survey_id,
                student["student_id"],
                student["student_name"],
                student["class_name"],
                json.dumps(answers, ensure_ascii=False),
                json.dumps(result, ensure_ascii=False),
                submitted_at,
            ),
        )
        conn.commit()
        result_row = conn.execute(
            """
            SELECT *
            FROM survey_results
            WHERE survey_id = ? AND student_id = ?
            """,
            (survey_id, student_id),
        ).fetchone()
        return {"result": row_to_survey_result(result_row)}
    finally:
        conn.close()


def ensure_identity_tables(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'teacher', 'counselor', 'student', 'parent')),
            email TEXT UNIQUE,
            phone TEXT,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS accounts (
            account_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            last_login_at TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS teachers (
            teacher_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
            employee_code TEXT UNIQUE,
            department TEXT,
            title TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS counselors (
            counselor_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
            employee_code TEXT UNIQUE,
            specialization TEXT,
            title TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS parents (
            parent_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
            occupation TEXT,
            education TEXT,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS student_users (
            user_id TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
            student_id TEXT NOT NULL UNIQUE REFERENCES students(student_id) ON DELETE CASCADE,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS teacher_classes (
            teacher_id TEXT NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
            class_name TEXT NOT NULL,
            grade INTEGER,
            school_year TEXT NOT NULL DEFAULT '2024-2025',
            created_at TEXT NOT NULL,
            PRIMARY KEY (teacher_id, class_name, school_year)
        );

        CREATE TABLE IF NOT EXISTS counselor_students (
            counselor_id TEXT NOT NULL REFERENCES counselors(counselor_id) ON DELETE CASCADE,
            student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
            relationship_type TEXT NOT NULL DEFAULT 'primary',
            assigned_at TEXT NOT NULL,
            PRIMARY KEY (counselor_id, student_id)
        );

        CREATE TABLE IF NOT EXISTS parent_students (
            parent_id TEXT NOT NULL REFERENCES parents(parent_id) ON DELETE CASCADE,
            student_id TEXT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
            relationship TEXT NOT NULL CHECK(relationship IN ('father', 'mother', 'guardian')),
            is_primary INTEGER NOT NULL DEFAULT 0 CHECK(is_primary IN (0, 1)),
            created_at TEXT NOT NULL,
            PRIMARY KEY (parent_id, student_id)
        );

        CREATE INDEX IF NOT EXISTS idx_accounts_user ON accounts(user_id);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        CREATE INDEX IF NOT EXISTS idx_student_users_student ON student_users(student_id);
        CREATE INDEX IF NOT EXISTS idx_teacher_classes_class ON teacher_classes(class_name);
        CREATE INDEX IF NOT EXISTS idx_counselor_students_student ON counselor_students(student_id);
        CREATE INDEX IF NOT EXISTS idx_parent_students_student ON parent_students(student_id);
        """
    )


def _upsert_user(
    conn: sqlite3.Connection,
    *,
    user_id: str,
    full_name: str,
    role: str,
    email: str,
    created_at: str,
    phone: str | None = None,
) -> None:
    conn.execute(
        """
        INSERT INTO users (user_id, full_name, role, email, phone, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'active', ?)
        ON CONFLICT(user_id) DO UPDATE SET
            full_name = excluded.full_name,
            role = excluded.role,
            email = excluded.email,
            phone = excluded.phone,
            status = 'active'
        """,
        (user_id, full_name, role, email, phone, created_at),
    )


def _upsert_account(
    conn: sqlite3.Connection,
    *,
    account_id: str,
    user_id: str,
    email: str,
    password_hash: str,
    created_at: str,
) -> None:
    conn.execute(
        """
        INSERT INTO accounts (account_id, user_id, email, password_hash, status, created_at)
        VALUES (?, ?, ?, ?, 'active', ?)
        ON CONFLICT(account_id) DO UPDATE SET
            user_id = excluded.user_id,
            email = excluded.email,
            password_hash = excluded.password_hash,
            status = 'active'
        """,
        (account_id, user_id, email, password_hash, created_at),
    )


def seed_identity_data(conn: sqlite3.Connection) -> None:
    created_at = datetime.now(timezone.utc).isoformat()

    demo_users = [
        ("USR_ADMIN001", "Quản trị viên", "admin", "admin@demo.local", "ACC_ADMIN001", "demo:admin"),
        ("USR_TEACHER001", "Trần Thị Lan", "teacher", "teacher.tran.thi.lan@demo.local", "ACC_TEACHER001", "demo:teacher"),
        ("USR_COUNSELOR001", "Nguyễn Văn Minh", "counselor", "counselor.nguyen.van.minh@demo.local", "ACC_COUNSELOR001", "demo:counselor"),
    ]
    for user_id, name, role, email, account_id, password_hash in demo_users:
        _upsert_user(
            conn,
            user_id=user_id,
            full_name=name,
            role=role,
            email=email,
            created_at=created_at,
        )
        _upsert_account(
            conn,
            account_id=account_id,
            user_id=user_id,
            email=email,
            password_hash=password_hash,
            created_at=created_at,
        )

    conn.execute(
        """
        INSERT INTO teachers (teacher_id, user_id, employee_code, department, title, created_at)
        VALUES ('TEACHER001', 'USR_TEACHER001', 'GV001', 'Chủ nhiệm', 'Giáo viên chủ nhiệm', ?)
        ON CONFLICT(teacher_id) DO UPDATE SET
            user_id = excluded.user_id,
            employee_code = excluded.employee_code,
            department = excluded.department,
            title = excluded.title
        """,
        (created_at,),
    )
    conn.execute(
        """
        INSERT INTO counselors (counselor_id, user_id, employee_code, specialization, title, created_at)
        VALUES ('COUNSELOR001', 'USR_COUNSELOR001', 'CV001', 'Hướng nghiệp', 'Cố vấn hướng nghiệp', ?)
        ON CONFLICT(counselor_id) DO UPDATE SET
            user_id = excluded.user_id,
            employee_code = excluded.employee_code,
            specialization = excluded.specialization,
            title = excluded.title
        """,
        (created_at,),
    )

    conn.execute(
        """
        INSERT OR IGNORE INTO teacher_classes (teacher_id, class_name, grade, school_year, created_at)
        SELECT 'TEACHER001', class_name, grade, '2024-2025', ?
        FROM students
        WHERE class_name = '9A'
        GROUP BY class_name, grade
        """,
        (created_at,),
    )
    conn.execute(
        """
        INSERT OR IGNORE INTO counselor_students (counselor_id, student_id, relationship_type, assigned_at)
        SELECT 'COUNSELOR001', student_id, 'primary', ?
        FROM students
        """,
        (created_at,),
    )

    students = conn.execute(
        """
        SELECT student_id, student_name, class_name,
               father_name, mother_name, father_occupation, mother_occupation,
               father_education, mother_education
        FROM students
        ORDER BY student_id
        """
    ).fetchall()
    for row in students:
        student_id = row["student_id"]
        student_user_id = f"USR_{student_id}"
        student_email = f"{student_id.lower()}@student.demo.local"
        _upsert_user(
            conn,
            user_id=student_user_id,
            full_name=row["student_name"],
            role="student",
            email=student_email,
            created_at=created_at,
        )
        _upsert_account(
            conn,
            account_id=f"ACC_{student_id}",
            user_id=student_user_id,
            email=student_email,
            password_hash=f"demo:{student_id.lower()}",
            created_at=created_at,
        )
        conn.execute(
            """
            INSERT INTO student_users (user_id, student_id, created_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET student_id = excluded.student_id
            """,
            (student_user_id, student_id, created_at),
        )

        parent_specs = [
            ("F", "father", row["father_name"], row["father_occupation"], row["father_education"], 1),
            ("M", "mother", row["mother_name"], row["mother_occupation"], row["mother_education"], 0),
        ]
        for suffix, relationship, parent_name, occupation, education, is_primary in parent_specs:
            if not parent_name:
                continue
            parent_user_id = f"USR_PARENT_{student_id}_{suffix}"
            parent_id = f"PARENT_{student_id}_{suffix}"
            parent_email = f"{student_id.lower()}.{relationship}@parent.demo.local"
            _upsert_user(
                conn,
                user_id=parent_user_id,
                full_name=parent_name,
                role="parent",
                email=parent_email,
                created_at=created_at,
            )
            _upsert_account(
                conn,
                account_id=f"ACC_PARENT_{student_id}_{suffix}",
                user_id=parent_user_id,
                email=parent_email,
                password_hash=f"demo:{student_id.lower()}:{relationship}",
                created_at=created_at,
            )
            conn.execute(
                """
                INSERT INTO parents (parent_id, user_id, occupation, education, created_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(parent_id) DO UPDATE SET
                    user_id = excluded.user_id,
                    occupation = excluded.occupation,
                    education = excluded.education
                """,
                (parent_id, parent_user_id, occupation, education, created_at),
            )
            conn.execute(
                """
                INSERT INTO parent_students (parent_id, student_id, relationship, is_primary, created_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(parent_id, student_id) DO UPDATE SET
                    relationship = excluded.relationship,
                    is_primary = excluded.is_primary
                """,
                (parent_id, student_id, relationship, is_primary, created_at),
            )

    conn.commit()


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
        "currentExploredCareer": row["current_explored_career"],
        "latestRecommendCareer": row["latest_recommend_career"],
        "recommendHistory": json.loads(row["recommend_history_json"] or "[]"),
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


def save_student_recommendation(
    student_id: str,
    recommendation: dict,
    db_path: Path = DEFAULT_DB,
) -> dict:
    top_result = (recommendation.get("results") or [{}])[0]
    latest_career = top_result.get("title") or ""
    history_entry = {
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "latestCareer": latest_career,
        "studentVector": recommendation.get("student_vector", {}),
        "results": recommendation.get("results", []),
    }

    with connect(db_path) as conn:
        row = conn.execute(
            "SELECT recommend_history_json FROM students WHERE student_id = ?",
            (student_id,),
        ).fetchone()
        if row is None:
            raise LookupError(f"Student not found: {student_id}")

        history = json.loads(row["recommend_history_json"] or "[]")
        history.insert(0, history_entry)
        history = history[:20]

        conn.execute(
            """
            UPDATE students
            SET latest_recommend_career = ?,
                recommend_history_json = ?
            WHERE student_id = ?
            """,
            (latest_career, json.dumps(history, ensure_ascii=False), student_id),
        )
        conn.commit()

    recommendation["saved"] = True
    recommendation["latestRecommendCareer"] = latest_career
    recommendation["recommendHistory"] = history
    return recommendation


def create_meeting(payload: dict, db_path: Path = DEFAULT_DB) -> dict:
    student_id = str(payload.get("studentId") or payload.get("student_id") or "").strip()
    counselor_id = str(payload.get("counselorId") or payload.get("counselor_id") or "COUNSELOR001").strip()
    topic = str(payload.get("topic") or "").strip()
    meeting_type = str(payload.get("meetingType") or payload.get("meeting_type") or "offline").strip().lower()
    meeting_url = str(payload.get("meetingUrl") or payload.get("meeting_url") or "").strip()
    scheduled_at = str(payload.get("scheduledAt") or payload.get("scheduled_at") or "").strip()

    if not student_id:
        raise ValueError("studentId is required")
    if not topic:
        raise ValueError("topic is required")
    if meeting_type not in {"offline", "online"}:
        raise ValueError("meetingType must be offline or online")
    if meeting_type == "online" and not meeting_url:
        raise ValueError("meetingUrl is required for online meetings")
    if not scheduled_at:
        raise ValueError("scheduledAt is required")

    conn = connect(db_path)
    try:
        student = conn.execute(
            """
            SELECT student_id, student_name, class_name
            FROM students
            WHERE student_id = ?
            """,
            (student_id,),
        ).fetchone()
        if student is None:
            raise LookupError(f"Student not found: {student_id}")
        counselor = _get_counselor(conn, counselor_id or "COUNSELOR001")

        created_at = datetime.now(timezone.utc).isoformat()
        cursor = conn.execute(
            """
            INSERT INTO meetings (
                student_id, student_name, class_name, counselor_id, counselor_name,
                topic, meeting_type, meeting_url, scheduled_at, status,
                student_seen_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NULL, ?)
            """,
            (
                student["student_id"],
                student["student_name"],
                student["class_name"],
                counselor["counselor_id"],
                counselor["full_name"],
                topic,
                meeting_type,
                meeting_url if meeting_type == "online" else None,
                scheduled_at,
                created_at,
            ),
        )
        conn.commit()

        row = conn.execute(
            "SELECT * FROM meetings WHERE meeting_id = ?",
            (cursor.lastrowid,),
        ).fetchone()
        return row_to_meeting(row)
    finally:
        conn.close()


def list_meetings(
    db_path: Path = DEFAULT_DB,
    *,
    role: str | None = None,
    student_id: str | None = None,
    counselor_id: str | None = None,
) -> list[dict]:
    clauses: list[str] = []
    params: list[object] = []

    if student_id:
        clauses.append("student_id = ?")
        params.append(student_id)
    if counselor_id:
        clauses.append("counselor_id = ?")
        params.append(counselor_id)

    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    conn = connect(db_path)
    try:
        rows = conn.execute(
            f"""
            SELECT *
            FROM meetings
            {where}
            ORDER BY scheduled_at ASC, meeting_id ASC
            """,
            params,
        ).fetchall()

        return [row_to_meeting(row) for row in rows]
    finally:
        conn.close()


def create_message(payload: dict, db_path: Path = DEFAULT_DB) -> dict:
    student_id = str(payload.get("studentId") or payload.get("student_id") or "").strip()
    counselor_id = str(payload.get("counselorId") or payload.get("counselor_id") or "COUNSELOR001").strip()
    sender_role = str(payload.get("senderRole") or payload.get("sender_role") or "").strip().lower()
    text = str(payload.get("text") or payload.get("message_text") or "").strip()

    if not student_id:
        raise ValueError("studentId is required")
    if sender_role not in {"student", "counselor"}:
        raise ValueError("senderRole must be student or counselor")
    if not text:
        raise ValueError("text is required")

    sent_at = datetime.now(timezone.utc).isoformat()
    student_seen_at = sent_at if sender_role == "student" else None
    counselor_seen_at = sent_at if sender_role == "counselor" else None

    conn = connect(db_path)
    try:
        student = conn.execute(
            """
            SELECT student_id, student_name, class_name
            FROM students
            WHERE student_id = ?
            """,
            (student_id,),
        ).fetchone()
        if student is None:
            raise LookupError(f"Student not found: {student_id}")
        counselor = _get_counselor(conn, counselor_id or "COUNSELOR001")

        cursor = conn.execute(
            """
            INSERT INTO messages (
                student_id, student_name, class_name, counselor_id, counselor_name,
                sender_role, message_text, sent_at, student_seen_at, counselor_seen_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                student["student_id"],
                student["student_name"],
                student["class_name"],
                counselor["counselor_id"],
                counselor["full_name"],
                sender_role,
                text,
                sent_at,
                student_seen_at,
                counselor_seen_at,
            ),
        )
        conn.commit()

        row = conn.execute(
            "SELECT * FROM messages WHERE message_id = ?",
            (cursor.lastrowid,),
        ).fetchone()
        return row_to_message(row)
    finally:
        conn.close()


def list_messages(
    db_path: Path = DEFAULT_DB,
    *,
    role: str | None = None,
    student_id: str | None = None,
    counselor_id: str | None = None,
) -> list[dict]:
    clauses: list[str] = []
    params: list[object] = []

    if student_id:
        clauses.append("student_id = ?")
        params.append(student_id)
    if counselor_id:
        clauses.append("counselor_id = ?")
        params.append(counselor_id)

    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""

    conn = connect(db_path)
    try:
        rows = conn.execute(
            f"""
            SELECT *
            FROM messages
            {where}
            ORDER BY sent_at ASC, message_id ASC
            """,
            params,
        ).fetchall()
        return [row_to_message(row) for row in rows]
    finally:
        conn.close()


def mark_messages_seen(payload: dict, db_path: Path = DEFAULT_DB) -> list[dict]:
    role = str(payload.get("role") or "").strip().lower()
    student_id = str(payload.get("studentId") or payload.get("student_id") or "").strip()
    counselor_id = str(payload.get("counselorId") or payload.get("counselor_id") or "COUNSELOR001").strip()

    if role not in {"student", "counselor"}:
        raise ValueError("role must be student or counselor")
    if not student_id:
        raise ValueError("studentId is required")

    seen_at = datetime.now(timezone.utc).isoformat()
    seen_column = "student_seen_at" if role == "student" else "counselor_seen_at"

    conn = connect(db_path)
    try:
        conn.execute(
            f"""
            UPDATE messages
            SET {seen_column} = COALESCE({seen_column}, ?)
            WHERE student_id = ? AND counselor_id = ?
            """,
            (seen_at, student_id, counselor_id or "COUNSELOR001"),
        )
        conn.commit()

        rows = conn.execute(
            """
            SELECT *
            FROM messages
            WHERE student_id = ? AND counselor_id = ?
            ORDER BY sent_at ASC, message_id ASC
            """,
            (student_id, counselor_id or "COUNSELOR001"),
        ).fetchall()
        return [row_to_message(row) for row in rows]
    finally:
        conn.close()


ADVICE_SORTS = {
    "newest": "created_at DESC, advice_id DESC",
    "oldest": "created_at ASC, advice_id ASC",
    "priority": """
        CASE priority
            WHEN 'high' THEN 0
            WHEN 'medium' THEN 1
            ELSE 2
        END ASC,
        created_at DESC,
        advice_id DESC
    """,
    "student": "student_name COLLATE NOCASE ASC, created_at DESC, advice_id DESC",
}


def create_advice_note(payload: dict, db_path: Path = DEFAULT_DB) -> dict:
    student_id = str(payload.get("studentId") or payload.get("student_id") or "").strip()
    counselor_id = str(payload.get("counselorId") or payload.get("counselor_id") or "COUNSELOR001").strip()
    title = str(payload.get("title") or payload.get("subject") or "").strip()
    body = str(payload.get("body") or "").strip()
    priority = str(payload.get("priority") or "medium").strip().lower()

    if not student_id:
        raise ValueError("studentId is required")
    if not title:
        raise ValueError("title is required")
    if not body:
        raise ValueError("body is required")
    if priority not in {"high", "medium", "low"}:
        raise ValueError("priority must be high, medium, or low")

    conn = connect(db_path)
    try:
        student = conn.execute(
            """
            SELECT student_id, student_name, class_name
            FROM students
            WHERE student_id = ?
            """,
            (student_id,),
        ).fetchone()
        if student is None:
            raise LookupError(f"Student not found: {student_id}")
        counselor = _get_counselor(conn, counselor_id or "COUNSELOR001")

        created_at = datetime.now(timezone.utc).isoformat()
        cursor = conn.execute(
            """
            INSERT INTO advice_notes (
                student_id, student_name, class_name, counselor_id,
                counselor_name, title, body, priority, student_seen_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
            """,
            (
                student["student_id"],
                student["student_name"],
                student["class_name"],
                counselor["counselor_id"],
                counselor["full_name"],
                title,
                body,
                priority,
                created_at,
            ),
        )
        conn.commit()

        row = conn.execute(
            "SELECT * FROM advice_notes WHERE advice_id = ?",
            (cursor.lastrowid,),
        ).fetchone()
        return row_to_advice_note(row)
    finally:
        conn.close()


def list_advice_notes(
    db_path: Path = DEFAULT_DB,
    *,
    student_id: str | None = None,
    counselor_id: str | None = None,
    sort: str = "newest",
    page: int = 1,
    page_size: int = 25,
) -> dict:
    clauses: list[str] = []
    params: list[object] = []

    if student_id:
        clauses.append("student_id = ?")
        params.append(student_id)
    if counselor_id:
        clauses.append("counselor_id = ?")
        params.append(counselor_id)

    normalized_page = max(1, int(page or 1))
    normalized_size = max(1, min(50, int(page_size or 25)))
    offset = (normalized_page - 1) * normalized_size
    where = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    order_by = ADVICE_SORTS.get(sort, ADVICE_SORTS["newest"])

    conn = connect(db_path)
    try:
        total = conn.execute(
            f"SELECT COUNT(*) AS total FROM advice_notes {where}",
            params,
        ).fetchone()["total"]
        rows = conn.execute(
            f"""
            SELECT *
            FROM advice_notes
            {where}
            ORDER BY {order_by}
            LIMIT ? OFFSET ?
            """,
            [*params, normalized_size, offset],
        ).fetchall()
        return {
            "notes": [row_to_advice_note(row) for row in rows],
            "page": normalized_page,
            "pageSize": normalized_size,
            "total": total,
            "hasMore": offset + len(rows) < total,
        }
    finally:
        conn.close()


def delete_advice_note(
    advice_id: int,
    db_path: Path = DEFAULT_DB,
    *,
    counselor_id: str | None = None,
) -> None:
    clauses = ["advice_id = ?"]
    params: list[object] = [advice_id]
    if counselor_id:
        clauses.append("counselor_id = ?")
        params.append(counselor_id)

    conn = connect(db_path)
    try:
        cursor = conn.execute(
            f"DELETE FROM advice_notes WHERE {' AND '.join(clauses)}",
            params,
        )
        conn.commit()
        if cursor.rowcount == 0:
            raise LookupError(f"Advice note not found: {advice_id}")
    finally:
        conn.close()


IDENTITY_TABLES = [
    "users",
    "accounts",
    "teachers",
    "counselors",
    "parents",
    "student_users",
    "teacher_classes",
    "counselor_students",
    "parent_students",
]


def identity_data(db_path: Path = DEFAULT_DB) -> dict:
    with connect(db_path) as conn:
        counts = {
            table: conn.execute(f"SELECT COUNT(*) AS total FROM {table}").fetchone()["total"]
            for table in IDENTITY_TABLES
        }
        demo_accounts = conn.execute(
            """
            SELECT
                users.user_id,
                users.full_name,
                users.role,
                users.email,
                accounts.account_id,
                accounts.status
            FROM users
            JOIN accounts ON accounts.user_id = users.user_id
            WHERE users.role IN ('admin', 'teacher', 'counselor')
            ORDER BY users.role, users.user_id
            """
        ).fetchall()
        sample_student = conn.execute(
            """
            SELECT student_id, student_name, class_name
            FROM students
            ORDER BY CASE WHEN student_id = 'STU006' THEN 0 ELSE 1 END, student_id
            LIMIT 1
            """
        ).fetchone()

        relationships: dict[str, object] = {}
        if sample_student is not None:
            student_id = sample_student["student_id"]
            relationships = {
                "student": dict(sample_student),
                "studentUser": None,
                "parents": [
                    dict(row)
                    for row in conn.execute(
                        """
                        SELECT
                            parents.parent_id,
                            users.full_name,
                            users.email,
                            parent_students.relationship,
                            parent_students.is_primary
                        FROM parent_students
                        JOIN parents ON parents.parent_id = parent_students.parent_id
                        JOIN users ON users.user_id = parents.user_id
                        WHERE parent_students.student_id = ?
                        ORDER BY parent_students.is_primary DESC, parent_students.relationship
                        """,
                        (student_id,),
                    ).fetchall()
                ],
                "counselors": [
                    dict(row)
                    for row in conn.execute(
                        """
                        SELECT counselors.counselor_id, users.full_name, counselor_students.relationship_type
                        FROM counselor_students
                        JOIN counselors ON counselors.counselor_id = counselor_students.counselor_id
                        JOIN users ON users.user_id = counselors.user_id
                        WHERE counselor_students.student_id = ?
                        ORDER BY counselors.counselor_id
                        """,
                        (student_id,),
                    ).fetchall()
                ],
                "teachers": [
                    dict(row)
                    for row in conn.execute(
                        """
                        SELECT teachers.teacher_id, users.full_name, teacher_classes.class_name, teacher_classes.school_year
                        FROM teacher_classes
                        JOIN teachers ON teachers.teacher_id = teacher_classes.teacher_id
                        JOIN users ON users.user_id = teachers.user_id
                        WHERE teacher_classes.class_name = ?
                        ORDER BY teachers.teacher_id
                        """,
                        (sample_student["class_name"],),
                    ).fetchall()
                ],
            }
            student_user = conn.execute(
                """
                SELECT users.user_id, users.full_name, users.role, users.email
                FROM student_users
                JOIN users ON users.user_id = student_users.user_id
                WHERE student_users.student_id = ?
                """,
                (student_id,),
            ).fetchone()
            relationships["studentUser"] = dict(student_user) if student_user else None

    return {
        "counts": counts,
        "demoAccounts": [dict(row) for row in demo_accounts],
        "sampleRelationships": relationships,
    }


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
