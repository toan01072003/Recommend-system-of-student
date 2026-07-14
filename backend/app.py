from __future__ import annotations

import json
import argparse
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

try:
    from . import api
except ImportError:
    import api


PROJECT_ROOT = api.PROJECT_ROOT
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"
LEGACY_WEB = PROJECT_ROOT / "web"
INDEX_HTML = LEGACY_WEB / "index.html"


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args) -> None:
        print(
            f"{self.client_address[0]} - - [{self.log_date_time_string()}] {format % args}",
            flush=True,
        )

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/questions":
            self.send_json_or_api_error(api.questions_payload)
            return
        if path == "/api/surveys":
            query = parse_qs(parsed.query)
            role = query["role"][0] if query.get("role") else None
            counselor_id = query["counselor_id"][0] if query.get("counselor_id") else None
            student_id = query["student_id"][0] if query.get("student_id") else None
            self.send_json_or_api_error(lambda: api.surveys_payload(role, counselor_id, student_id))
            return
        if path.startswith("/api/surveys/"):
            survey_id = int(unquote(path.removeprefix("/api/surveys/")))
            self.send_json_or_api_error(lambda: api.survey_payload(survey_id))
            return
        if path == "/api/dashboard":
            self.send_json_or_api_error(api.dashboard_payload)
            return
        if path == "/api/app-data":
            self.send_json_or_api_error(api.app_data_payload)
            return
        if path == "/api/identity-data":
            self.send_json_or_api_error(api.identity_payload)
            return
        if path == "/api/reference-actions":
            self.send_json_or_api_error(api.reference_actions_payload)
            return
        if path == "/api/common-reference-actions":
            self.send_json_or_api_error(api.common_reference_actions_payload)
            return
        if path == "/api/student-references":
            query = parse_qs(parsed.query)
            student_id = query["student_id"][0] if query.get("student_id") else ""
            self.send_json_or_api_error(lambda: api.student_references_payload(student_id))
            return
        if path == "/api/student-common-references":
            query = parse_qs(parsed.query)
            student_id = query["student_id"][0] if query.get("student_id") else ""
            self.send_json_or_api_error(lambda: api.student_common_references_payload(student_id))
            return
        if path == "/api/meetings":
            query = parse_qs(parsed.query)
            role = query["role"][0] if query.get("role") else None
            student_id = query["student_id"][0] if query.get("student_id") else None
            counselor_id = query["counselor_id"][0] if query.get("counselor_id") else None
            self.send_json_or_api_error(lambda: api.meetings_payload(role, student_id, counselor_id))
            return
        if path == "/api/messages":
            query = parse_qs(parsed.query)
            role = query["role"][0] if query.get("role") else None
            student_id = query["student_id"][0] if query.get("student_id") else None
            counselor_id = query["counselor_id"][0] if query.get("counselor_id") else None
            self.send_json_or_api_error(lambda: api.messages_payload(role, student_id, counselor_id))
            return
        if path == "/api/advice-notes":
            query = parse_qs(parsed.query)
            student_id = query["student_id"][0] if query.get("student_id") else None
            counselor_id = query["counselor_id"][0] if query.get("counselor_id") else None
            sort = query["sort"][0] if query.get("sort") else "newest"
            page = query["page"][0] if query.get("page") else 1
            page_size = query["page_size"][0] if query.get("page_size") else 25
            self.send_json_or_api_error(
                lambda: api.advice_notes_payload(
                    student_id,
                    counselor_id,
                    sort,
                    page,
                    page_size,
                )
            )
            return
        if path == "/api/students":
            query = parse_qs(parsed.query)
            grade = query["grade"][0] if query.get("grade") else None
            class_name = query["class"][0] if query.get("class") else None
            self.send_json_or_api_error(lambda: api.students_payload(grade, class_name))
            return
        if path.startswith("/api/students/"):
            student_id = unquote(path.removeprefix("/api/students/"))
            self.send_json_or_api_error(lambda: api.student_payload(student_id))
            return
        if path.startswith("/api/"):
            self.send_json({"error": f"API route not found: {path}"}, status=404)
            return
        self.send_static(path)

    def do_OPTIONS(self) -> None:
        path = urlparse(self.path).path
        if path.startswith("/api/"):
            self.send_response(204)
            self.send_cors_headers()
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        self.send_error(404)

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
        if path not in {
            "/api/recommend",
            "/api/student-recommend",
            "/api/meetings",
            "/api/messages",
            "/api/messages/seen",
            "/api/advice-notes",
            "/api/surveys",
            "/api/students",
            "/api/reference-actions/sync",
            "/api/student-references",
        }:
            if not (path.startswith("/api/surveys/") and path.endswith("/results")):
                if path.startswith("/api/"):
                    self.send_json({"error": f"API route not found: {path}"}, status=404)
                else:
                    self.send_error(404)
                return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if path == "/api/students":
                self.send_json(api.create_student_payload(payload), status=201)
                return
            if path == "/api/surveys":
                self.send_json(api.create_survey_payload(payload), status=201)
                return
            if path == "/api/reference-actions/sync":
                self.send_json(api.sync_reference_actions_payload(payload))
                return
            if path == "/api/student-references":
                self.send_json(api.save_student_reference_payload(payload))
                return
            if path.startswith("/api/surveys/") and path.endswith("/results"):
                survey_id = int(unquote(path.removeprefix("/api/surveys/").removesuffix("/results")))
                self.send_json(api.submit_survey_result_payload(survey_id, payload), status=201)
                return
            if path == "/api/advice-notes":
                self.send_json(api.create_advice_note_payload(payload), status=201)
                return
            if path == "/api/messages/seen":
                self.send_json(api.mark_messages_seen_payload(payload))
                return
            if path == "/api/messages":
                self.send_json(api.create_message_payload(payload), status=201)
                return
            if path == "/api/meetings":
                self.send_json(api.create_meeting_payload(payload), status=201)
                return
            if path == "/api/student-recommend":
                self.send_json(api.student_recommend_payload(payload))
                return

            self.send_json(api.recommend_payload(payload))
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=400)

    def do_PUT(self) -> None:
        self.handle_student_update()

    def do_PATCH(self) -> None:
        self.handle_student_update()

    def handle_student_update(self) -> None:
        path = urlparse(self.path).path
        if not path.startswith("/api/students/"):
            if path.startswith("/api/"):
                self.send_json({"error": f"API route not found: {path}"}, status=404)
            else:
                self.send_error(404)
            return

        try:
            student_id = unquote(path.removeprefix("/api/students/"))
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            self.send_json(api.update_student_payload(student_id, payload))
        except ValueError as exc:
            self.send_json({"error": str(exc)}, status=400)
        except LookupError as exc:
            self.send_json({"error": str(exc)}, status=404)
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=500)

    def do_DELETE(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/students/"):
            student_id = unquote(path.removeprefix("/api/students/"))
            self.send_json_or_api_error(
                lambda: api.delete_student_payload(student_id)
            )
            return

        if path.startswith("/api/advice-notes/"):
            query = parse_qs(parsed.query)
            counselor_id = query["counselor_id"][0] if query.get("counselor_id") else None
            advice_id = int(unquote(path.removeprefix("/api/advice-notes/")))
            self.send_json_or_api_error(
                lambda: api.delete_advice_note_payload(advice_id, counselor_id)
            )
            return

        if path.startswith("/api/"):
            self.send_json({"error": f"API route not found: {path}"}, status=404)
        else:
            self.send_error(404)

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
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Vary", "Origin")

    def send_json_or_api_error(self, loader) -> None:
        try:
            self.send_json(loader())
        except ValueError as exc:
            self.send_json({"error": str(exc)}, status=400)
        except FileNotFoundError as exc:
            self.send_json({"error": str(exc)}, status=503)
        except LookupError as exc:
            self.send_json({"error": str(exc)}, status=404)
        except Exception as exc:
            self.send_json({"error": str(exc)}, status=500)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run career recommendation web demo.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8001)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"Demo server running at http://{args.host}:{args.port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
