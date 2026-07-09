# Frontend Screen Structure

Mục tiêu: tìm code theo domain nghiệp vụ và thao tác CRUD.

## Entry/router

- `../App.tsx`: entry rất mỏng, export `AppShell`.
- `../AppShell.tsx`: điều hướng view theo role, không chứa UI chi tiết.
- `../components/layout/AppLayout.tsx`: sidebar, top nav, chatbot.

## CRUD theo domain

### Create

- `teacher/TeacherScreens.tsx`
  - `TeacherEntry`: nhập/cập nhật dữ liệu học sinh.
- `counselor/create/CounselorCreateScreens.tsx`
  - `CounselorFeatureStub`
  - `CounselorLessons`: tạo bài học.
  - `CounselorSurveys`: tạo khảo sát.

### Read

- `admin/AdminScreens.tsx`
  - `SchoolOverview`
  - `GradeDashboard`
  - `ClassDashboard`
  - `StudentProfile`
- `student/StudentScreens.tsx`: file index export, không chứa UI trực tiếp.
- `student/read/StudentHomeScreens.tsx`
  - `StudentDashboard`
- `student/read/StudentLearningScreens.tsx`
  - `StudentLessons`
- `student/read/StudentExploreScreens.tsx`: index export cho nhóm khám phá.
- `student/read/CareerExploreScreens.tsx`
  - `StudentExplore`
- `student/read/UniversityExploreScreens.tsx`
  - `StudentUniversities`
- `student/shared/StudentCommunicationScreens.tsx`
  - `MessengerView`
  - `AdvisementNotesStudent`
  - `AdvisementNotesCounselor`
- `counselor/CounselorScreens.tsx`: barrel export, giữ API import cũ cho `AppShell`.
- `counselor/read/CounselorDashboard.tsx`
  - `CounselorDashboard`
- `counselor/read/CounselorStudentList.tsx`
  - `CounselorStudentList`
- `counselor/read/CounselorStudentGroups.tsx`
  - `CounselorStudentGroups`
- `counselor/read/CounselorFamilies.tsx`
  - `CounselorFamilies`
- `counselor/reports/CounselorReports.tsx`
  - counselor report screens

### Update

- `admin/AdminScreens.tsx`
  - `DataQuality`: kiểm tra quyền và chất lượng dữ liệu.
- `parent/ParentScreens.tsx`
  - `ParentPortal`: cập nhật kỳ vọng gia đình.
- `student/StudentScreens.tsx`
- `student/update/StudentSurveyScreens.tsx`
  - `StudentSurveys`
- `student/update/StudentProfilePlanScreens.tsx`
  - `StudentPersonalInfo`
  - `StudentPortfolio`
  - `StudentPlanGrade`
  - `StudentPlanPathways`
- `counselor/update/CounselorStudentDetail.tsx`
  - `CounselorStudentDetail`: cập nhật/tạo support actions như meeting, message, advice note, alumni recommendation.
- `components/counselor/StudentRecommendationPanel.tsx`
  - lấy và hiển thị gợi ý/đánh giá cho từng học sinh.

### Delete

Chưa có UI delete thật. Khi thêm delete, tạo rõ theo domain, ví dụ:

- `student/delete/DeleteStudentDialog.tsx`
- `counselor/delete/DeleteLessonDialog.tsx`

## Data/API/logic

- `../api/client.ts`: gọi backend API.
- `../context/AppDataContext.tsx`: load dữ liệu app từ backend, fallback snapshot.
- `../logic/recommendation.ts`: logic RIASEC, radar, career match.
- `../../data.ts`: dữ liệu demo/fallback, không nhét logic UI mới vào đây.
