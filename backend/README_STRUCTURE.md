# Backend Structure

## Runtime/API

- `app.py`: HTTP server, route request, trả JSON/static file.
- `api.py`: API payload layer, gom endpoint `/api/*`.

## CRUD dữ liệu học sinh

- `student_database.py`: đọc dữ liệu SQLite và build payload cho frontend.
  - Read list/detail: `list_students`, `get_student`.
  - Read dashboard/app snapshot: `dashboard`, `app_data`.
  - Khi thêm Create/Update/Delete thật, thêm hàm ở đây trước rồi route qua `api.py`.

## Import/migration

- `import_student_profiles.py`: import Excel vào SQLite.
- Database đích: `../data/recommend_system.db`.

## Recommendation engine

- `recommend_engine.py`: tính vector RIASEC và xếp hạng nghề.
- `fetch_onet_questions.py`: lấy/cập nhật câu hỏi O*NET.
