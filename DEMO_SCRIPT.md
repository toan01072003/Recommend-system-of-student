# Script demo project Recommendation System

Tài liệu này dùng để demo nhanh project cho PM hoặc stakeholder. Có thể đọc theo thứ tự bên dưới trong khoảng 7-10 phút.

## 1. Mở đầu

Hôm nay em demo hệ thống hỗ trợ hướng nghiệp và counselling cho học sinh.

Project có 3 mục tiêu chính:

1. Gợi ý top nghề nghiệp phù hợp dựa trên bài Interest Profiler/RIASEC.
2. Giúp cố vấn phát hiện học sinh nên được gặp để hỗ trợ học tập, tâm lý hoặc hướng nghiệp.
3. Tạo trải nghiệm giải thích nghề nghiệp dễ hiểu cho học sinh, có thể dùng AI để cá nhân hóa nội dung.

Điểm quan trọng là hệ thống không thay cố vấn ra quyết định. Hệ thống chỉ xếp hạng, đưa lý do, và gợi ý chủ đề để cố vấn xem xét.

## 2. Cách chạy demo

Terminal 1, chạy backend:

```powershell
cd D:\rs\recommend
python backend/app.py
```

Nếu máy đang dùng Python runtime của Codex:

```powershell
cd D:\rs\recommend
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' backend\app.py
```

Terminal 2, chạy frontend:

```powershell
cd D:\rs\recommend\frontend
npm.cmd run dev
```

Mở các màn chính:

```text
http://localhost:5173
http://localhost:5173/counselor/meeting
```

Test API nhanh:

```powershell
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/meeting-candidates?limit=10" | Select-Object -ExpandProperty Content
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/career-counseling-candidates?limit=10" | Select-Object -ExpandProperty Content
```

## 3. Demo luồng học sinh: làm questionnaire và nhận top nghề

Vào phần bài test/hướng nghiệp của học sinh.

Kịch bản nói:

Học sinh trả lời bộ câu hỏi Interest Profiler. Mỗi câu hỏi được map vào một nhóm RIASEC: Realistic, Investigative, Artistic, Social, Enterprising, Conventional. Sau khi học sinh trả lời xong, backend cộng điểm theo từng nhóm để tạo vector sở thích của học sinh.

Ví dụ vector học sinh:

```text
R=22, I=31, A=18, S=25, E=20, C=15
```

Sau đó hệ thống so vector này với vector nghề nghiệp lấy từ O*NET. Mỗi nghề cũng có vector RIASEC riêng. Thuật toán chính là cosine similarity:

```text
similarity(student_vector, career_vector)
```

Điểm càng gần 1 thì nghề càng khớp với sở thích của học sinh. Backend sort giảm dần và trả top nghề phù hợp nhất.

Điểm mạnh của cách này:

- Dễ giải thích với PM và giáo viên.
- Không cần train model phức tạp ở giai đoạn MVP.
- Dựa trên chuẩn O*NET/RIASEC nên có cơ sở nghề nghiệp rõ ràng.

### 3.1. Matching nghề nghiệp chạy cụ thể như thế nào?

Pipeline từ input đến output:

```text
60 câu trả lời của học sinh
-> validate đủ 60 câu, mỗi câu điểm 1..5
-> map từng câu vào R/I/A/S/E/C
-> cộng điểm theo 6 nhóm
-> tạo student_vector
-> load career_vectors_onet.csv
-> tính cosine similarity với từng nghề
-> sort giảm dần
-> trả top 10 nghề
```

Ví dụ dễ nói trong demo:

```text
Câu 1 thuộc R, học sinh chọn 4 điểm -> R +4
Câu 2 thuộc I, học sinh chọn 5 điểm -> I +5
Câu 3 thuộc A, học sinh chọn 2 điểm -> A +2
...
Sau 60 câu:
student_vector = [R=22, I=31, A=18, S=25, E=20, C=15]
```

Mỗi nghề trong O*NET cũng có vector 6 chiều:

```text
Data Scientist = [R=10, I=95, A=35, S=40, E=45, C=55]
Graphic Designer = [R=20, I=30, A=95, S=35, E=35, C=25]
Teacher = [R=15, I=45, A=35, S=95, E=45, C=40]
```

Hệ thống không so từng điểm tuyệt đối một cách thô. Nó so hướng của vector bằng cosine similarity:

```text
cosine = dot(student_vector, career_vector)
         / (norm(student_vector) * norm(career_vector))
```

Ý nghĩa:

```text
cosine gần 1.0  -> pattern sở thích rất giống nghề đó
cosine gần 0.0  -> gần như không giống
```

Ví dụ PM-friendly:

Nếu học sinh có `I` và `S` cao, hệ thống sẽ ưu tiên các nghề có thiên hướng Investigative/Social như phân tích dữ liệu, y tế, nghiên cứu, giáo dục, tư vấn. Nếu `A` cao hơn, các nghề sáng tạo sẽ tăng hạng.

### 3.2. Vì sao dùng cosine similarity?

Cosine similarity phù hợp vì mình muốn so "hình dạng sở thích", không chỉ tổng điểm.

Ví dụ:

```text
Học sinh A: [R=10, I=20, A=5, S=15, E=5, C=5]
Học sinh B: [R=20, I=40, A=10, S=30, E=10, C=10]
```

Hai học sinh có tổng điểm khác nhau, nhưng pattern giống nhau: I cao, S khá, A/E/C thấp. Cosine similarity vẫn nhận ra hai vector này cùng hướng. Như vậy hệ thống không phạt học sinh chỉ vì em ấy chấm điểm "hào phóng" hoặc "khắt khe" hơn.

### 3.3. Data nghề lấy từ đâu?

Data nghề lấy từ O*NET:

```text
Career Interest Types.txt
Occupation Data.txt
```

Backend chỉ lấy các dòng `Scale ID == OI`, tức là điểm Occupational Interests của từng nghề. Sau đó join với `Occupation Data.txt` để lấy tên nghề theo mã O*NET-SOC.

File output dùng cho matching:

```text
data/career_vectors_onet.csv
```

Format:

```text
soc_code,title,R,I,A,S,E,C
15-2051.00,Data Scientists,10,95,35,40,45,55
...
```

### 3.4. API recommend trả gì?

Input API:

```json
{
  "answers": [1, 5, 3, 4, "... đủ 60 câu"]
}
```

Output chính:

```text
studentVector
results[0..9]
  rank
  socCode
  title
  score
  vector
```

Khi demo, có thể nói:

Kết quả không chỉ là tên nghề. Mỗi nghề có `score` và vector nghề, nên mình giải thích được vì sao nghề đó lên top.

API liên quan:

```text
GET  /api/questions
POST /api/recommend
POST /api/student-recommend
```

## 4. Demo luồng cố vấn: học sinh cần gặp

Mở:

```text
http://localhost:5173/counselor/meeting
```

Ở block `Học sinh cần gặp`, demo 2 tab:

```text
Hỗ trợ
Hướng nghiệp
```

Nếu tab hiển thị `Hỗ trợ (8)`, ban đầu UI chỉ show vài học sinh đầu để dashboard gọn. Bấm `Xem toàn bộ 8 học sinh` để mở toàn bộ danh sách. Bấm `Thu gọn danh sách` để đóng lại.

### 4.1. Algorithm hỗ trợ học tập/tâm lý

Endpoint:

```text
GET /api/meeting-candidates
```

Mục tiêu: phát hiện học sinh nên được gặp vì học tập giảm, stress, áp lực hoặc tự tin thấp.

Input chính:

```text
risk_level
average_score
score_trend
stress_level
academic_pressure_level
confidence_level
upcoming scheduled meetings
```

Rule scoring:

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

Sau đó:

```text
priorityScore = ruleScore + aiSignalScore
```

Nếu `priorityScore >= threshold` thì học sinh được đưa vào danh sách. Mặc định hệ thống bỏ qua học sinh đã có lịch hẹn sắp tới để tránh đặt trùng.

Khi PM hỏi "vì sao học sinh này được đề xuất?", chỉ vào các phần:

```text
summary
reasons
Hệ thống
Tín hiệu AI
suggestedTopic
```

### 4.1.1. Ví dụ tính điểm hỗ trợ cụ thể

Ví dụ một học sinh có profile:

```text
risk_level = high
average_score = 6.3
score_trend = -0.6
stress_level = high
academic_pressure_level = moderate
confidence_level = low
```

Hệ thống tính:

```text
risk high             +40
average_score < 6.5   +25
score_trend <= -0.5   +20
stress high           +20
pressure moderate     +8
confidence low        +12
--------------------------------
ruleScore             = 125
```

Nếu Gemini/fallback đọc thêm được tín hiệu `stress_language` hoặc `motivation_drop`, AI có thể cộng thêm, nhưng bị cap:

```text
aiSignalScore <= 30
priorityScore = ruleScore + aiSignalScore
```

Với ví dụ trên:

```text
priorityScore = 125 + 10 = 135
priority = high
suggestedTopic = "Trao đổi hỗ trợ học tập và tâm lý"
```

Card UI sẽ hiện:

```text
Hệ thống 125
Tín hiệu AI 10
Lý do: Hồ sơ đang ở nhóm rủi ro cao; Điểm trung bình thấp; Điểm giảm mạnh
```

### 4.1.2. Vì sao có threshold?

Threshold mặc định là `25`. Nghĩa là một tín hiệu nhẹ đơn lẻ có thể chưa đủ để đưa học sinh vào danh sách. Ví dụ:

```text
risk low +10
stress moderate +10
total = 20
```

Học sinh này chưa vượt ngưỡng, hệ thống chỉ tiếp tục theo dõi. Nhưng nếu có thêm điểm giảm hoặc áp lực cao, tổng điểm vượt 25 và học sinh sẽ vào queue.

### 4.1.3. Vì sao bỏ học sinh đã có lịch sắp tới?

Trong SQL, hệ thống kiểm tra `upcoming_meeting_count`.

Nếu học sinh đã có lịch hẹn trong tương lai:

```text
hasUpcomingMeeting = true
```

Mặc định hệ thống không hiện lại trong queue để tránh cố vấn đặt trùng. Nếu muốn debug hoặc xem đủ danh sách, gọi:

```text
include_scheduled=true
```

### 4.2. Algorithm tư vấn hướng nghiệp

Endpoint:

```text
GET /api/career-counseling-candidates
```

Mục tiêu: phát hiện học sinh cần gặp để làm rõ nghề, ngành, trường hoặc mâu thuẫn định hướng.

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

Rule scoring:

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

Hệ thống còn map nghề học sinh thích, nghề hệ thống gợi ý, và kỳ vọng phụ huynh về nhóm RIASEC gần nhất. Nếu các nhóm này lệch nhau, hệ thống tăng điểm ưu tiên và đưa lý do vào card.

Ví dụ câu demo:

Học sinh này được đề xuất vì đã có nghề quan tâm nhưng chưa có ngành/trường mục tiêu, đồng thời nghề quan tâm đang lệch với nhóm RIASEC hệ thống gợi ý. Vì vậy cố vấn nên gặp để nối từ sở thích sang lựa chọn ngành và kế hoạch nộp hồ sơ.

### 4.2.1. Ví dụ tính điểm hướng nghiệp cụ thể

Ví dụ một học sinh lớp 9:

```text
riasec_top3 = "ISA"
favorite_career = "Marketing Manager"
latest_recommend_career = "Data Scientist"
target_university_name = empty
target_university_program = empty
grade = 9
progress = 55
parent_expectation = "Doctor"
average_score = 6.8
```

Hệ thống tính:

```text
career exists but no university plan    +20
grade >= 9 and plan incomplete          +20
progress < 70                           +10
career/recommend group mismatch         +25
parent/student direction conflict       +15
average_score < 7 with career target    +15
------------------------------------------------
ruleScore                               = 105
```

Nếu AI đọc thêm được tín hiệu `career_confusion`:

```text
aiSignalScore = 10
priorityScore = 115
priority = high
suggestedTopic = "Tư vấn nghề-ngành-trường và kế hoạch nộp hồ sơ"
```

Card UI sẽ hiện:

```text
Nên tư vấn hướng nghiệp vì có nghề quan tâm nhưng chưa có ngành/trường mục tiêu;
lớp cuối cấp cần chốt kế hoạch sớm;
nghề đang quan tâm lệch với nhóm gợi ý
```

### 4.2.2. Matching nhóm nghề trong counselling khác gì matching top nghề?

Phần top nghề dùng vector RIASEC đầy đủ và cosine similarity.

Phần counselling dùng mapping nhẹ hơn để detect xung đột:

```text
favorite_career/current_explored_career/career_fit
-> keyword map về nhóm R/I/A/S/E/C gần nhất

latest_recommend_career hoặc recommend_history_json
-> map về nhóm R/I/A/S/E/C gần nhất

parent_expectation
-> map về nhóm R/I/A/S/E/C gần nhất
```

Ví dụ:

```text
"Marketing Manager" -> E
"Data Scientist"    -> I
"Doctor"            -> I
```

Nếu học sinh thích nhóm `E` nhưng hệ thống recommend nhóm `I`, hệ thống thêm lý do:

```text
career_mismatch +25
```

Nếu phụ huynh kỳ vọng nhóm `I` nhưng học sinh thích nhóm `E`, hệ thống thêm:

```text
parent_conflict +15
```

Mục tiêu của phần này không phải recommend nghề mới, mà là phát hiện tình huống cần cố vấn ngồi xuống trao đổi.

### 4.2.3. Output counselling gồm những gì?

Mỗi candidate có:

```text
studentId
studentName
className
grade
avg
scoreTrend
priorityScore
priority
reasons
aiSignals
scoreSources
suggestedTopic
explanation
hasUpcomingMeeting
nextMeetingAt
```

Trong đó `explanation` là phần dùng để nói với giáo viên/cố vấn:

```text
summary       -> lý do ngắn gọn
breakdown     -> điểm gom theo nhóm academic/wellbeing/career/family
confidence    -> độ tin cậy tương đối dựa trên số lý do độc lập
nextAction    -> cố vấn nên làm gì tiếp
reviewRequired -> luôn true
```

## 5. Hybrid AI signal bằng Gemini

Phần counselling dùng hybrid AI:

```text
rule-based score + capped AI signals
```

Rule-based vẫn là lõi quyết định. Gemini chỉ đọc thêm tín hiệu mềm từ hồ sơ học sinh, ví dụ:

```text
motivation_drop
stress_language
low_confidence
family_pressure
career_confusion
missing_major_bridge
interest_inconsistency
```

Mỗi AI signal có:

```text
code
category
severity
points
evidence
confidence
source
```

Điểm AI bị giới hạn, hiện cap tối đa là 30 điểm, để AI không áp đảo rule chính. Nếu chưa có `GEMINI_API_KEY`, backend dùng fallback local keyword scanner để demo không bị chết.

Cấu hình `.env`:

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
```

Thông điệp cần nhấn mạnh với PM:

AI không chẩn đoán học sinh, không tự động kết luận bắt buộc phải gặp. AI chỉ bổ sung tín hiệu và hệ thống luôn trả `reviewRequired=true` để cố vấn là người quyết định cuối.

## 6. Demo tạo lịch từ gợi ý

Trong block `Học sinh cần gặp`, chọn một card học sinh và bấm:

```text
Tạo lịch từ gợi ý này
```

Hệ thống tự điền:

```text
học sinh
chủ đề cuộc gặp
loại hẹn gặp
thời gian mặc định
```

Cố vấn có thể chỉnh lại thời gian/chủ đề rồi bấm `Lưu`.

Ý nghĩa sản phẩm:

Không chỉ detect học sinh cần hỗ trợ, hệ thống còn giảm thao tác vận hành để cố vấn book lịch nhanh hơn.

## 7. Demo AI giải thích hành động nghề nghiệp

Trong màn khám phá nghề nghiệp của học sinh, mỗi nghề có các hành động/hoạt động tham khảo. Học sinh có thể bấm icon AI cạnh một hành động để mở giải thích cá nhân hóa.

Backend gọi:

```text
POST /api/career-action-ai
```

Agent dùng OpenRouter model:

```text
google/gemini-3.1-flash-lite
```

Input gửi cho agent được tối giản, chỉ gồm ngữ cảnh học tập/hướng nghiệp cần thiết:

```text
grade
careerFit
favoriteCareer
riasecTop3
preferredActivities
curiosityTopics
desiredCareerStyle
workStyle
career
action
```

Agent có thể trả về 1 trong 2 mode:

```text
interactive
video
```

Interactive là mini-game trắc nghiệm hoặc đúng/sai. Video là link YouTube giáo dục phù hợp với học sinh. Backend validate JSON schema và kiểm tra link YouTube để tránh nội dung không đúng format.

Cấu hình `.env`:

```text
OPENROUTER_API_KEY=your_rotated_openrouter_key
OPENROUTER_MODEL=google/gemini-3.1-flash-lite
```

Thông điệp demo:

Phần này biến dữ liệu nghề nghiệp khô thành trải nghiệm dễ hiểu cho học sinh. Thay vì chỉ đọc nghề, học sinh được giải thích bằng hoạt động cụ thể hoặc mini-game ngắn.

## 8. Demo học sở thích hoạt động của học sinh

Trong màn nghề nghiệp, học sinh có thể phản hồi từng hoạt động:

```text
thích
bình thường
không thích
```

Backend lưu phản hồi theo `student_action_references`. Sau đó hệ thống recompute sang `student_common_action_references` để rút ra các nhóm hoạt động chung học sinh có xu hướng thích/không thích.

Ý nghĩa:

Đây là bước đầu để hệ thống không chỉ dựa vào một bài test RIASEC, mà còn học dần từ hành vi và phản hồi thực tế của học sinh.

## 9. Các thuật toán/chức năng chính trong project

### RIASEC vector similarity

Dùng cho top nghề nghiệp.

```text
student answers -> student RIASEC vector -> cosine similarity với O*NET career vectors -> top ranked careers
```

### Rule-based counselling triage

Dùng cho danh sách học sinh cần gặp.

```text
student profile signals -> weighted rules -> priorityScore -> ranked candidate list
```

### Hybrid AI signal extraction

Dùng để bổ sung tín hiệu mềm cho counselling.

```text
student profile text -> Gemini/fallback scanner -> aiSignals -> capped points -> explanation
```

### Career action AI agent

Dùng để giải thích hoạt động nghề nghiệp cho học sinh.

```text
student minimal context + career + action -> OpenRouter/Gemini -> validated JSON -> mini-game hoặc video
```

### Preference aggregation

Dùng để học phản hồi hoạt động của học sinh.

```text
activity reactions -> normalize by common action -> aggregate score -> common preference profile
```

## 10. Kết luận demo

Tóm lại, project hiện đã có đủ pipeline MVP:

1. Học sinh làm questionnaire để nhận top nghề theo RIASEC/O*NET.
2. Cố vấn xem danh sách học sinh cần gặp, có lý do và mức ưu tiên.
3. Cố vấn book lịch trực tiếp từ gợi ý.
4. Học sinh khám phá nghề bằng hoạt động cụ thể, có AI giải thích.
5. Hệ thống bắt đầu học thêm từ phản hồi của học sinh để cá nhân hóa tốt hơn về sau.

Điểm mạnh hiện tại là dễ giải thích, chạy demo được, có fallback khi thiếu API key, và các quyết định nhạy cảm đều giữ con người ở vòng cuối.

## 11. Q&A nhanh cho PM

**Hỏi: Đây có phải AI tự quyết định học sinh nào có vấn đề không?**

Không. Đây là triage hỗ trợ cố vấn. Hệ thống xếp hạng và giải thích, cố vấn quyết định cuối.

**Hỏi: Vì sao không dùng pure AI?**

Vì dữ liệu counselling nhạy cảm. Rule-based giúp minh bạch, dễ audit. AI chỉ bổ sung tín hiệu mềm và bị giới hạn điểm.

**Hỏi: Nếu chưa có Gemini/OpenRouter key thì demo có chạy không?**

Có. Counselling dùng fallback keyword scanner nếu thiếu Gemini key. Riêng career action AI cần OpenRouter key; nếu thiếu key, UI báo lỗi cấu hình thay vì tạo nội dung giả.

**Hỏi: Algorithm nghề nghiệp có cần train model không?**

Không ở MVP. Hệ thống dùng vector similarity giữa RIASEC của học sinh và RIASEC của nghề từ O*NET.

**Hỏi: Có thể mở rộng thành AI recommendation mạnh hơn không?**

Có. Hướng tiếp theo là kết hợp RIASEC, phản hồi hoạt động, điểm học tập, mục tiêu trường/ngành và lịch sử tương tác để tạo hybrid recommender tốt hơn.
