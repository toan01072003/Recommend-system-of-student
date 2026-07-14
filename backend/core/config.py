from __future__ import annotations

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = PROJECT_ROOT / "data"
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"
LEGACY_WEB = PROJECT_ROOT / "web"

QUESTION_JSON = DATA_DIR / "onet_interest_profiler_questions.json"
QUESTION_MAP_ONET = DATA_DIR / "question_map_onet.csv"
QUESTION_MAP_TEMPLATE = DATA_DIR / "question_map_template.csv"
CAREER_VECTORS = DATA_DIR / "career_vectors_onet.csv"
STUDENT_DB = DATA_DIR / "recommend_system.db"
