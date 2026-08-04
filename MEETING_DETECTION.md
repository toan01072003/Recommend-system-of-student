# Meeting Detection Algorithms

This repo has two separate rule-based queues.
Both queues now support hybrid AI signals from Gemini. Rules still make the final triage score; Gemini only adds capped signals.

## 1. Support risk queue

Endpoint:

```text
GET /api/meeting-candidates
```

Purpose: detect students who need a meeting for academic, stress, pressure, or confidence support.

Signals:

- `risk_level`
- `average_score`
- `score_trend`
- `stress_level`
- `academic_pressure_level`
- `confidence_level`
- upcoming scheduled meetings

Main scoring:

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

## 2. Career counseling queue

Endpoint:

```text
GET /api/career-counseling-candidates
```

Purpose: detect students who need a meeting for career-major-university counseling.

Signals:

- `riasec_top3`
- `favorite_career`
- `current_explored_career`
- `career_fit`
- `latest_recommend_career`
- `recommend_history_json`
- `target_university_name`
- `target_university_program`
- `grade`
- `progress`
- `parent_expectation`
- `average_score`
- upcoming career-related scheduled meetings

Main scoring:

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

## Common query params

```text
grade=9
class=9A
teacher_id=TEACHER001
threshold=25
limit=10
include_scheduled=true
```

## Test commands

Start backend:

```powershell
cd D:\rs\recommend
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' backend\app.py
```

Test support queue:

```powershell
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/meeting-candidates?limit=10" | Select-Object -ExpandProperty Content
```

Test career counseling queue:

```powershell
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/career-counseling-candidates?limit=10" | Select-Object -ExpandProperty Content
```

## Gemini hybrid AI mode

Set a backend-only API key before starting `backend/app.py`:

```powershell
$env:GEMINI_API_KEY = "<your_gemini_key>"
$env:GEMINI_MODEL = "gemini-2.0-flash"
& 'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' backend\app.py
```

If `GEMINI_API_KEY` is missing or Gemini errors, the backend uses a local keyword fallback so the app still works.

Each candidate includes:

```text
aiSignals
scoreSources.rules
scoreSources.ai
scoreSources.aiProvider
scoreSources.aiModel
scoreSources.aiError
```

Expected values:

```text
aiProvider = gemini                    # Gemini worked
aiProvider = fallback                  # no API key
aiProvider = fallback_after_gemini_error # API call failed
```

Đặt lịch từ một học sinh được đề xuất:

```powershell
$body = @{
  studentId = "STU014"
  topic = "Trao đổi hỗ trợ học tập và tâm lý"
  meetingType = "offline"
  scheduledAt = "2026-08-05T03:00:00Z"
} | ConvertTo-Json -Compress

Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8001/api/meetings" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body |
  Select-Object -ExpandProperty Content
```

## Explainability fields

Each candidate includes:

```text
priorityScore
priority
reasons[]
suggestedTopic
explanation.summary
explanation.breakdown
explanation.confidence
explanation.nextAction
explanation.reviewRequired
```

Example meaning:

```text
summary: short human-readable reason
breakdown: points grouped by academic/wellbeing/career/family/transition
confidence: confidence in the explanation, based on number of independent reasons
nextAction: what teacher/counselor should do next
reviewRequired: always true because this is triage, not automatic diagnosis
```
