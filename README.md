# RIASEC Career Recommendation MVP

Hệ thống gợi ý nghề nghiệp dựa trên Holland/RIASEC. Backend nhận câu trả lời assessment của học sinh, chấm thành vector `R/I/A/S/E/C`, rồi so cosine similarity với vector nghề từ O*NET để trả về danh sách nghề phù hợp nhất.

## Cấu trúc dự án

```text
backend/                 Python backend, API, recommendation engine
data/                    Dữ liệu mẫu, câu hỏi O*NET, career vectors
frontend/                React + Vite frontend
web/                     HTML demo cũ do backend Python phục vụ khi chưa build React
ONET_PIPELINE_NOTES.md   Ghi chú chi tiết về pipeline O*NET
MEETING_DETECTION.md     Ghi chú chi tiết về thuật toán phát hiện học sinh cần gặp
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
GET  /api/meeting-candidates
GET  /api/career-counseling-candidates
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

## Counselling: phát hiện học sinh cần gặp

Phần counselling có nhiệm vụ gợi ý cho giáo viên/cố vấn những học sinh nên được đặt lịch gặp. Hệ thống không tự kết luận hay chẩn đoán; nó chỉ xếp hạng mức ưu tiên và giải thích lý do để giáo viên/cố vấn quyết định.

Hiện có 2 hàng đợi gợi ý:

```text
GET /api/meeting-candidates
GET /api/career-counseling-candidates
```

### 1. Hỗ trợ học tập/tâm lý

Endpoint `GET /api/meeting-candidates` dùng để tìm học sinh nên được gặp vì rủi ro học tập, stress, áp lực học tập hoặc tự tin thấp.

Input chính lấy từ bảng `students`:

```text
risk_level
average_score
score_trend
stress_level
academic_pressure_level
confidence_level
upcoming scheduled meetings
```

Logic rule-based:

```text
risk high             +40
risk medium           +25
average_score < 6.5   +25
average_score < 7.0   +15
score_trend <= -0.5   +20
score_trend <= -0.2   +10
stress high           +20
stress moderate       +10
pressure high         +15
pressure moderate     +8
confidence low        +12
```

Sau khi cộng điểm, học sinh chỉ được đưa vào danh sách nếu `priorityScore >= threshold` (mặc định `25`). Nếu học sinh đã có lịch hẹn sắp tới thì mặc định bị loại khỏi danh sách để tránh đặt trùng, trừ khi gọi API với `include_scheduled=true`.

### 2. Tư vấn hướng nghiệp

Endpoint `GET /api/career-counseling-candidates` dùng để tìm học sinh nên được tư vấn về nghề, ngành học, trường mục tiêu hoặc mâu thuẫn định hướng.

Input chính:

```text
riasec_top3
favorite_career
current_explored_career
career_fit
latest_recommend_career
recommend_history_json
target_university_name
target_university_program
grade
progress
parent_expectation
average_score
upcoming career-related meetings
```

Logic rule-based:

```text
missing RIASEC                         +20
missing career orientation             +20
RIASEC exists but no career bridge      +15
missing recommendation result           +15
career exists but no university plan    +20
grade >= 9 and plan incomplete          +20
grade >= 8 and no target plan           +10
progress < 70                           +10
career/recommend group mismatch         +25
career/RIASEC mismatch                  +15
parent/student direction conflict       +15
average_score < 7 with career target    +15
```

Thuật toán còn map nghề đang thích, nghề hệ thống gợi ý và kỳ vọng phụ huynh về nhóm RIASEC gần nhất. Nếu các nhóm này lệch nhau, hệ thống tăng điểm ưu tiên và ghi rõ lý do trong `reasons`.

### Hybrid AI bằng Gemini

Backend có thể dùng Gemini như một lớp đọc tín hiệu mềm từ dữ liệu hồ sơ học sinh. Gemini không quyết định cuối; Gemini chỉ trả về các `aiSignals`, mỗi tín hiệu có `category`, `code`, `confidence`, `points`, `evidence`. Điểm AI bị giới hạn tối đa `30` điểm để rule-based vẫn là lõi quyết định.

Nếu có API key:

```text
.env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Nếu chưa có key hoặc Gemini lỗi, backend tự dùng `fallback` nội bộ dựa trên keyword để demo vẫn chạy được.

### AI giải thích hành động nghề nghiệp

Trong danh sách hoạt động của mỗi ngành nghề, bấm biểu tượng AI cạnh một hành động để mở nội dung cá nhân hóa cho học sinh. Backend gọi OpenRouter bằng `google/gemini-3.1-flash-lite`; agent có thể trả về mini-game dạng trắc nghiệm/đúng-sai hoặc một video YouTube giáo dục.

Đặt key OpenRouter mới trong `.env` ở thư mục gốc. Không đặt key trong frontend và không dùng lại key đã bị lộ:

```text
OPENROUTER_API_KEY=your_rotated_openrouter_key
OPENROUTER_MODEL=google/gemini-3.1-flash-lite
```

Frontend gọi proxy nội bộ `POST /api/career-action-ai`, nên API key không đi ra trình duyệt. Nếu chưa cấu hình key, modal sẽ hiển thị lỗi cấu hình thay vì tạo nội dung giả.

Mỗi học sinh trong danh sách trả về có dạng:

```text
priorityScore
priority
reasons[]
aiSignals[]
scoreSources.rules
scoreSources.ai
scoreSources.total
scoreSources.aiProvider
suggestedTopic
explanation.summary
explanation.breakdown
explanation.confidence
explanation.nextAction
explanation.reviewRequired
```

Trong UI, vào `http://localhost:5173/counselor/meeting`, xem block `Học sinh cần gặp`. Tab `Hỗ trợ` dùng `/api/meeting-candidates`; tab `Hướng nghiệp` dùng `/api/career-counseling-candidates`. Bấm `Tạo lịch từ gợi ý này` để tự điền học sinh và chủ đề cuộc gặp vào form tạo lịch hẹn.

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

Mở UI:

```text
http://localhost:5173
http://localhost:5173/counselor/meeting
```

Test nhanh API counselling:

```powershell
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/meeting-candidates?limit=10" | Select-Object -ExpandProperty Content
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/career-counseling-candidates?limit=10" | Select-Object -ExpandProperty Content
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
