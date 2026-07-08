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
    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/api/questions":
            self.send_json_or_api_error(api.questions_payload)
            return
        if path == "/api/dashboard":
            self.send_json_or_api_error(api.dashboard_payload)
            return
        if path == "/api/app-data":
            self.send_json_or_api_error(api.app_data_payload)
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
            self.send_json(api.recommend_payload(payload))
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
    print(f"Demo server running at http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
