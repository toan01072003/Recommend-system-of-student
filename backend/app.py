from __future__ import annotations

import json
import argparse
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

try:
    from .recommend_engine import (
        RIASEC_ORDER,
        load_career_vectors,
        load_question_map,
        rank_careers,
        score_student_answers,
    )
except ImportError:
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
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"
LEGACY_WEB = PROJECT_ROOT / "web"
INDEX_HTML = LEGACY_WEB / "index.html"

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


def recommend(payload: dict) -> dict:
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


class Handler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/questions":
            self.send_json({"questions": load_questions()})
            return
        if path.startswith("/api/"):
            self.send_error(404)
            return
        self.send_static(path)

    def send_static(self, request_path: str) -> None:
        if (FRONTEND_DIST / "index.html").exists():
            static_root = FRONTEND_DIST
            relative_path = "index.html" if request_path == "/" else request_path.lstrip("/")
            file_path = (static_root / relative_path).resolve()

            try:
                file_path.relative_to(static_root.resolve())
            except ValueError:
                self.send_error(404)
                return

            if not file_path.is_file():
                file_path = static_root / "index.html"

            content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
            if file_path.suffix == ".html":
                content_type = "text/html; charset=utf-8"
            self.send_file(file_path, content_type)
            return

        if request_path == "/":
            self.send_file(INDEX_HTML, "text/html; charset=utf-8")
            return

        self.send_error(404)

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/recommend":
            self.send_error(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            self.send_json(recommend(payload))
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=400)

    def send_file(self, path: Path, content_type: str) -> None:
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, payload: dict, status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run career recommendation web demo.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8001)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Demo server running at http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
