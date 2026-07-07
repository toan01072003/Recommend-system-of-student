# O*NET 30.3 Pipeline Notes

## API questionnaire vs local engine

Dung API O*NET Web Services de bootstrap questionnaire:

- `GET https://api-v2.onetcenter.org/mnm/interestprofiler/questions?start=1&end=60`
- Header: `X-API-Key: <your_key>`
- Response co `answer_option` va `question[]`; moi question co `index`, `area`, `text`.
- App ghi answer theo thu tu 60 cau thanh chuoi 60 ky tu, moi ky tu la `1..5`.
- Co the goi `GET /mnm/interestprofiler/results?answers=<60_digit_string>` de lay RIASEC scores.
- Co the goi `GET /mnm/interestprofiler/careers?answers=<60_digit_string>` hoac truyen `realistic=...&investigative=...`.

Khuyen nghi cho product cua minh:

1. Luc build/admin, fetch 60 questions tu API va cache vao DB/app.
2. Runtime web hien questionnaire tu DB/app cua minh, khong goi API moi lan user vao.
3. Khi user submit, backend tu tinh RIASEC vector va rank local bang `career_vectors_onet.csv`.
4. Chi dung O*NET API de verify scoring/luc development, vi API docs ghi career results co the khac My Next Move hien tai va updated API se ra trong nua dau 2026.

## Files in `db_30_3_text`

Core matching:

- `Career Interest Types.txt`: RIASEC/Holland vector nghe. Dung `Scale ID == OI`; bo `IH` vi do la high-point code labels.
- `Occupation Data.txt`: SOC code, title, description.
- `Job Zones.txt`: filter theo muc do chuan bi nghe 1..5.

Career explanation/enrichment:

- `Task Statements.txt`: mo ta viec lam; tot cho UI "nghe nay lam gi".
- `Essential Skills.txt`: basic skills, rating theo `IM` importance va `LV` level.
- `Transferable Skills.txt`: cross-functional skills, cung co `IM` va `LV`.
- `Knowledge.txt`: knowledge areas can cho nghe, tot cho bridge sang nganh hoc.
- `Abilities.txt`: ability profile; dung sau, vi phu hop hon neu co ability assessment.
- `Education.txt` + `Education Categories.txt`: percent frequency theo bang cap yeu cau; dung de noi "nghe nay thuong can bang gi".
- `Training and Experience.txt`: kinh nghiem/training/license; dung cho readiness/career planning.
- `Software Skills.txt`: tool/software gan voi nghe; dung cho learning roadmap.
- `Work Activities.txt`, `Work Context.txt`, `Work Styles.txt`: enrichment/filters nang cao.

## Minimal product order

1. MVP: `Career Interest Types` + `Occupation Data` + local cosine ranking.
2. Add `Job Zones` va `Education` de filter/reasoning cho hoc sinh THPT.
3. Add `Task Statements`, `Knowledge`, `Essential Skills`, `Transferable Skills` de explain ranking va bridge sang nganh hoc VN.
4. Add `Software Skills`, `Work Activities`, `Work Context` cho roadmap va advanced filters.
