from __future__ import annotations

import sqlite3
from pathlib import Path

try:
    from ..core.config import STUDENT_DB
    from .. import student_database
except ImportError:
    from core.config import STUDENT_DB
    import student_database


DEFAULT_DB = STUDENT_DB


def connect(db_path: Path = DEFAULT_DB) -> sqlite3.Connection:
    """Open an app database connection and run lightweight schema guards."""
    return student_database.connect(db_path)
