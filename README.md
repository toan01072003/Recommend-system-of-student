# RIASEC Career Recommendation MVP

Engine này nhận câu trả lời assessment của học sinh, chấm thành vector Holland/RIASEC, rồi so cosine similarity với vector nghề để trả về top career.

## Pipeline

1. Học sinh trả lời 60 câu, mỗi câu điểm `1..5`.
2. `question_map_template.csv` map mỗi câu vào một chiều `R/I/A/S/E/C`.
3. Engine cộng điểm theo nhóm để ra `student_vector = [R, I, A, S, E, C]`.
4. Career vector lấy từ O*NET `Career Interest Types.txt` trong bản 30.3, chỉ dùng dòng `Scale ID == OI`.
5. Cosine similarity giữa `student_vector` và từng career vector.
6. Sort giảm dần, trả top 10.

## Chạy demo

```powershell
python backend/recommend_engine.py --answers data/student_answers_example.json --top 10
```

Chạy web demo Python:

```powershell
python backend/app.py
```

Chạy React frontend trong lúc phát triển:

```powershell
cd frontend
npm.cmd run dev
```

Vite sẽ proxy các request `/api/*` sang backend mặc định ở `http://127.0.0.1:8001`.
Khi đã build `frontend/dist`, backend sẽ tự phục vụ bản build React.

## Build career vector thật từ O*NET 30.3

Bạn đã có thư mục `db_30_3_text`, nên chạy thẳng:

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' backend/recommend_engine.py `
  --build-onet `
  --interests "db_30_3_text\Career Interest Types.txt" `
  --occupation-data "db_30_3_text\Occupation Data.txt" `
  --out data/career_vectors_onet.csv
```

Sau đó dùng file thật:

```powershell
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' backend/recommend_engine.py `
  --answers data/student_answers_example.json `
  --question-map data/question_map_template.csv `
  --career-vectors data/career_vectors_onet.csv `
  --top 10
```

## Việc cần làm tiếp

`data/question_map_template.csv` chỉ là template để code chạy end-to-end. Khi dùng assessment thật, lấy 60 câu từ O*NET Web Services endpoint `/mnm/interestprofiler/questions`, lưu text câu hỏi trong DB/app của mình, và giữ `index -> area` làm mapping chuẩn.

Fetch câu hỏi thật một lần:

```powershell
$env:ONET_API_KEY = "<your_key>"
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' backend/fetch_onet_questions.py `
  --out data/onet_interest_profiler_questions.json `
  --question-map-out data/question_map_onet.csv
```

Sau đó thay `--question-map data/question_map_onet.csv` khi rank career.
