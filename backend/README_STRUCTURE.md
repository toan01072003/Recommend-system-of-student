# Backend Structure

## Runtime/API

- `app.py`: HTTP server, route request, trả JSON/static file.
- `api.py`: API payload facade cho `/api/*`, gọi xuống service layer.

## Packages

- `core/`: cấu hình dùng chung như `PROJECT_ROOT`, đường dẫn `data/`, database, file O*NET.
- `db/`: mở kết nối SQLite qua `connect()`, giữ schema guard hiện có.
- `repositories/`: thao tác dữ liệu cấp thấp.
  - `base.py`: `SQLiteCrudRepository` dùng whitelist table/column để CRUD an toàn.
  - `students.py`: CRUD repository cho bảng `students`, chuẩn hóa camelCase payload sang cột SQLite.
- `services/`: nghiệp vụ/payload cấp ứng dụng.
  - `students.py`: list/get/create/update/delete học sinh và trả payload cho API.

## Legacy data adapter

- `student_database.py`: legacy adapter lớn đang giữ schema guard, dashboard/app snapshot, surveys,
  meetings, messages, advice notes, references và recommendation history.
- Các package mới gọi lại `student_database.py` khi cần giữ payload cũ để frontend không bị vỡ.
- Khi tách tiếp, chuyển từng nhóm logic từ `student_database.py` sang `repositories/` + `services/`.

## CRUD học sinh

- `GET /api/students`: list học sinh, hỗ trợ `grade`, `class`.
- `GET /api/students/<student_id>`: đọc chi tiết học sinh.
- `POST /api/students`: tạo học sinh mới.
- `PUT /api/students/<student_id>` hoặc `PATCH /api/students/<student_id>`: cập nhật field được whitelist.
- `DELETE /api/students/<student_id>`: xóa học sinh.

## Import/migration

- `import_student_profiles.py`: import Excel vào SQLite.
- Database đích: `../data/recommend_system.db`.

## Recommendation engine

- `recommend_engine.py`: tính vector RIASEC và xếp hạng nghề.
- `fetch_onet_questions.py`: lấy/cập nhật câu hỏi O*NET.
