import { useState } from "react";
import { AppDataProvider } from "./context/AppDataContext";
import {
  CounselorSidebar,
  Sidebar,
  StudentSidebar,
  SupportChatbot,
  TopNav,
} from "./components/layout/AppLayout";
import { LoginScreen } from "./screens/auth/LoginScreen";
import {
  ClassDashboard,
  DataQuality,
  GradeDashboard,
  SchoolOverview,
  StudentProfile,
} from "./screens/admin/AdminScreens";
import { ParentPortal } from "./screens/parent/ParentScreens";
import {
  AdvisementNotesCounselor,
  AdvisementNotesStudent,
  MessengerView,
  StudentApplicationResults,
  StudentAssignment,
  StudentDashboard,
  StudentExplore,
  StudentGames,
  StudentLessons,
  StudentPersonalInfo,
  StudentPlanGrade,
  StudentPlanPathways,
  StudentPortfolio,
  StudentResume,
  StudentSurveys,
  StudentUniversities,
} from "./screens/student/StudentScreens";
import {
  CounselingWorkspace,
  TeacherEntry,
} from "./screens/teacher/TeacherScreens";
import {
  CounselorDashboard,
  CounselorFamilies,
  CounselorFeatureStub,
  CounselorLessons,
  CounselorReportCollegePlanning,
  CounselorReportEngagement,
  CounselorReportStudentWork,
  CounselorStudentGroups,
  CounselorStudentList,
  CounselorSurveys,
} from "./screens/counselor/CounselorScreens";

type Role = "admin" | "teacher" | "counselor" | "student" | "parent";

const defaultViewByRole: Record<Role, string> = {
  admin: "school-overview",
  teacher: "class-dashboard",
  counselor: "co-dashboard",
  student: "st-dashboard",
  parent: "parent-portal",
};

export default function AppShell() {
  const [role, setRole] = useState<Role | null>(null);
  const [view, setView] = useState<string>("school-overview");
  const [uniToOpen, setUniToOpen] = useState<string | null>(null);

  const handleLogin = (selectedRole: string) => {
    const nextRole = selectedRole as Role;
    setRole(nextRole);
    setView(defaultViewByRole[nextRole] ?? "school-overview");
  };

  if (!role) return <LoginScreen onLogin={handleLogin} />;

  const navigate = (target: string) => setView(target);

  const renderView = () => {
    switch (view) {
      // READ: dashboard/list/detail views
      case "school-overview":
        return <SchoolOverview navigate={navigate} />;
      case "grade-dashboard":
        return <GradeDashboard navigate={navigate} />;
      case "class-dashboard":
        return <ClassDashboard navigate={navigate} />;
      case "student-profile":
        return <StudentProfile />;
      case "parent-portal":
        return <ParentPortal />;
      case "data-quality":
        return <DataQuality />;

      // CREATE/UPDATE: teacher data entry and counseling workspace
      case "teacher-entry":
        return <TeacherEntry />;
      case "counseling":
        return <CounselingWorkspace />;

      // STUDENT READ/UPDATE: learning, surveys, plans, profile, universities
      case "st-dashboard":
        return <StudentDashboard setView={setView} />;
      case "st-lessons":
        return <StudentLessons />;
      case "st-surveys":
        return <StudentSurveys />;
      case "st-assignment":
        return <StudentAssignment />;
      case "st-games":
        return <StudentGames />;
      case "st-explore":
        return (
          <StudentExplore
            onNavigateToUni={(id) => {
              setUniToOpen(id);
              setView("st-universities");
            }}
          />
        );
      case "st-universities":
        return (
          <StudentUniversities
            initialUniId={uniToOpen}
            key={uniToOpen ?? "unis"}
          />
        );
      case "st-personal":
        return <StudentPersonalInfo />;
      case "st-portfolio":
        return <StudentPortfolio />;
      case "st-resume":
        return <StudentResume />;
      case "st-applications":
        return <StudentApplicationResults />;
      case "st-plan-grade":
        return <StudentPlanGrade />;
      case "st-plan-pathways":
        return <StudentPlanPathways />;
      case "st-messenger":
        return <MessengerView role="student" />;
      case "st-advice":
        return <AdvisementNotesStudent />;

      // COUNSELOR READ/CREATE/UPDATE: dashboards, student detail, lessons, surveys, reports
      case "co-dashboard":
        return <CounselorDashboard />;
      case "co-students-list":
        return <CounselorStudentList />;
      case "co-student-groups":
        return <CounselorStudentGroups />;
      case "co-families":
        return <CounselorFamilies />;
      case "co-lessons":
        return <CounselorLessons />;
      case "co-assignments":
        return (
          <CounselorFeatureStub
            title="Assignment"
            icon="✅"
            color="from-emerald-500 to-teal-400"
            items={[
              { label: "Đã giao", value: "16", sub: "Tổng bài tập" },
              { label: "Đúng hạn", value: "89%", sub: "278 nộp" },
              { label: "Trễ hạn", value: "34", sub: "Cần nhắc" },
            ]}
          />
        );
      case "co-surveys":
        return <CounselorSurveys />;
      case "co-courses":
        return (
          <CounselorFeatureStub
            title="Course & Diploma"
            icon="🎓"
            color="from-violet-500 to-indigo-500"
            items={[
              { label: "Khoá học", value: "8", sub: "Đang hoạt động" },
              { label: "Chứng chỉ", value: "156", sub: "Đã cấp" },
              { label: "Tỉ lệ hoàn thành", value: "81%", sub: "" },
            ]}
          />
        );
      case "co-test-scores":
        return (
          <CounselorFeatureStub
            title="Test Scores"
            icon="📊"
            color="from-blue-500 to-cyan-500"
            items={[
              { label: "Bài test", value: "6", sub: "Loại kiểm tra" },
              { label: "Đã làm", value: "94 HS", sub: "73%" },
              { label: "ĐTB", value: "76/100", sub: "Kỹ năng mềm" },
            ]}
          />
        );
      case "co-report-work":
        return <CounselorReportStudentWork />;
      case "co-report-lessons":
        return (
          <CounselorFeatureStub
            title="Lesson Progress"
            icon="📈"
            color="from-orange-500 to-amber-400"
            items={[
              { label: "Bài học", value: "24", sub: "Tổng cộng" },
              { label: "Hoàn thành", value: "75%", sub: "96 HS" },
              { label: "Đang học", value: "18%", sub: "23 HS" },
            ]}
          />
        );
      case "co-report-assignment":
        return (
          <CounselorFeatureStub
            title="Assignment Report"
            icon="📋"
            color="from-teal-500 to-emerald-400"
            items={[
              { label: "Nộp đúng hạn", value: "89%", sub: "278 bài" },
              { label: "Nộp trễ", value: "34", sub: "11%" },
              { label: "Chưa nộp", value: "12", sub: "Cần nhắc" },
            ]}
          />
        );
      case "co-report-engagement":
        return <CounselorReportEngagement />;
      case "co-report-college":
        return <CounselorReportCollegePlanning />;
      case "co-messenger":
        return <MessengerView role="counselor" />;
      case "co-advice":
        return <AdvisementNotesCounselor />;
      default:
        return <SchoolOverview navigate={navigate} />;
    }
  };

  return (
    <AppDataProvider>
      <>
        <div
          className="flex h-screen overflow-hidden"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {role === "student" ? (
            <StudentSidebar
              view={view}
              setView={setView}
              onLogout={() => setRole(null)}
            />
          ) : role === "counselor" ? (
            <CounselorSidebar
              view={view}
              setView={setView}
              onLogout={() => setRole(null)}
            />
          ) : (
            <Sidebar
              role={role}
              view={view}
              setView={setView}
              onLogout={() => setRole(null)}
            />
          )}
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNav role={role} />
            <main
              className={`flex-1 overflow-y-auto p-5 ${role === "student" ? "bg-[#FFF7F0]" : "bg-[#FDF6EE]"}`}
            >
              {renderView()}
            </main>
          </div>
        </div>
        <SupportChatbot role={role} />
      </>
    </AppDataProvider>
  );
}
