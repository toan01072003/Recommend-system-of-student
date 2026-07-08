# RIASEC Career Recommendation MVP

Hệ thống gợi ý nghề nghiệp dựa trên Holland/RIASEC. Backend nhận câu trả lời assessment của học sinh, chấm thành vector `R/I/A/S/E/C`, rồi so cosine similarity với vector nghề từ O*NET để trả về danh sách nghề phù hợp nhất.

## Cấu trúc dự án

```text
backend/                 Python backend, API, recommendation engine
data/                    Dữ liệu mẫu, câu hỏi O*NET, career vectors
frontend/                React + Vite frontend
web/                     HTML demo cũ do backend Python phục vụ khi chưa build React
ONET_PIPELINE_NOTES.md   Ghi chú chi tiết về pipeline O*NET
```

## Môi trường

- Python `3.12+`
- Node.js `24+`
- npm `11+`

Trên PowerShell Windows, nếu `npm` bị chặn bởi Execution Policy, dùng `npm.cmd`.

## Chạy nhanh backend engine

```powershell
python backend/recommend_engine.py --answers data/student_answers_example.json --top 10
```

Kết quả sẽ in `student_vector` và top nghề phù hợp theo cosine similarity.

## Chạy backend API

```powershell
python backend/app.py
```

Mặc định server chạy tại:

```text
http://127.0.0.1:8001
```

API hiện có:

```text
GET  /api/questions
POST /api/recommend
GET  /api/dashboard
GET  /api/app-data
GET  /api/students
GET  /api/students/<student_id>
```

Payload mẫu cho `/api/recommend`:

```json
{
  "answers": [3, 4, 5, 2, 1]
}
```

Trong thực tế mảng `answers` cần đủ 60 điểm, mỗi điểm từ `1..5`.

## Database học sinh

Dữ liệu học sinh synthetic được import từ Excel vào SQLite:

```text
data/synthetic_student_profiles_50_v2_names_score_history.xlsx
data/recommend_system.db
```

Tạo lại database sau khi file Excel thay đổi:

```powershell
python backend/import_student_profiles.py
```

Script sẽ đọc các sheet `Wide_Profile_50` và `Score_History_Long`, rồi ghi vào:

```text
data/recommend_system.db
```

Các API `GET /api/dashboard`, `GET /api/app-data`, `GET /api/students`, `GET /api/students/<student_id>` đọc dữ liệu từ SQLite này. Frontend sẽ gọi `/api/app-data` khi backend đang chạy; nếu API chưa sẵn sàng thì tạm dùng snapshot local trong `frontend/src/app/data.ts`.

## Chạy React frontend khi phát triển

Cài dependencies nếu chưa có:

```powershell
cd frontend
npm.cmd install
```

Chạy dev server:

```powershell
npm.cmd run dev
```

Vite proxy mọi request `/api/*` sang backend mặc định ở:

```text
http://127.0.0.1:8001
```

Vì vậy khi dev cần mở 2 terminal:

```powershell
python backend/app.py
```

```powershell
cd frontend
npm.cmd run dev
```

## Build và chạy production local

Build frontend:

```powershell
cd frontend
npm.cmd run build
```

Sau khi có `frontend/dist`, backend Python sẽ tự phục vụ bản React build:

```powershell
cd ..
python backend/app.py
```

Mở:

```text
http://127.0.0.1:8001
```

## Pipeline recommendation

1. Học sinh trả lời 60 câu, mỗi câu điểm `1..5`.
2. `data/question_map_onet.csv` hoặc `data/question_map_template.csv` map mỗi câu vào một chiều `R/I/A/S/E/C`.
3. Backend cộng điểm theo nhóm để tạo `student_vector = [R, I, A, S, E, C]`.
4. Career vector lấy từ O*NET `Career Interest Types.txt`, chỉ dùng dòng `Scale ID == OI`.
5. Engine tính cosine similarity giữa `student_vector` và từng career vector.
6. Sort giảm dần và trả top nghề phù hợp.

## Build career vector từ O*NET 30.3

Nếu đã có thư mục raw O*NET `db_30_3_text/`, chạy:

```powershell
python backend/recommend_engine.py `
  --build-onet `
  --interests "db_30_3_text\Career Interest Types.txt" `
  --occupation-data "db_30_3_text\Occupation Data.txt" `
  --out data/career_vectors_onet.csv
```

Sau đó dùng file thật:

```powershell
python backend/recommend_engine.py `
  --answers data/student_answers_example.json `
  --question-map data/question_map_onet.csv `
  --career-vectors data/career_vectors_onet.csv `
  --top 10
```

## Fetch câu hỏi O*NET

Không gọi O*NET API trực tiếp từ frontend. Fetch một lần ở backend/admin tooling rồi cache vào `data/`.

```powershell
$env:ONET_API_KEY = "<your_key>"
python backend/fetch_onet_questions.py `
  --out data/onet_interest_profiler_questions.json `
  --question-map-out data/question_map_onet.csv
```

## Lưu ý Git

Các thư mục sinh ra khi chạy local đã nằm trong `.gitignore`, gồm:

```text
frontend/node_modules/
frontend/dist/
backend/__pycache__/
*.log
db_30_3_text/
```

Khi đổi cấu trúc file hoặc move backend, dùng:

```powershell
git add -A
```

để Git nhận đúng file rename/delete/add.
