import { useEffect, useState } from "react";
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
  MeetingCenter,
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
  StudentReferences,
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
  CounselorReportEngagement,
  CounselorReportLessonProgress,
  CounselorReportStudentWork,
  CounselorStudentGroups,
  CounselorStudentList,
  CounselorSurveys,
} from "./screens/counselor/CounselorScreens";
import {
  appRouteToPath,
  parseAppRoute,
  roleFromPath,
  type AppRole,
  type AppRoute,
} from "./routes";

const defaultViewByRole: Record<AppRole, string> = {
  admin: "school-overview",
  teacher: "class-dashboard",
  counselor: "co-dashboard",
  student: "st-dashboard",
  parent: "parent-portal",
};

export default function AppShell() {
  const [role, setRole] = useState<AppRole | null>(() =>
    roleFromPath(window.location.pathname),
  );
  const [route, setRoute] = useState<AppRoute>(() =>
    parseAppRoute(window.location.pathname),
  );
  const [uniToOpen, setUniToOpen] = useState<string | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const view = route.view;

  useEffect(() => {
    const handlePopState = () => {
      const nextRole = roleFromPath(window.location.pathname);

      if (nextRole) setRole(nextRole);
      setRoute(parseAppRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setAppRoute = (nextRoute: AppRoute, mode: "push" | "replace" = "push") => {
    const nextPath = appRouteToPath(nextRoute);

    setRoute(nextRoute);
    if (window.location.pathname === nextPath) return;

    if (mode === "replace") {
      window.history.replaceState(null, "", nextPath);
      return;
    }

    window.history.pushState(null, "", nextPath);
  };

  const handleLogin = (selectedRole: string) => {
    const nextRole = selectedRole as AppRole;
    const nextRoute = { view: defaultViewByRole[nextRole] ?? "school-overview" };

    setUniToOpen(null);
    setSessionKey((key) => key + 1);
    setRole(nextRole);
    setAppRoute(nextRoute, "replace");
  };

  if (!role) return <LoginScreen onLogin={handleLogin} />;

  const navigate = (target: string, params?: Omit<AppRoute, "view">) =>
    setAppRoute({ view: target, ...params });

  const handleLogout = () => {
    setUniToOpen(null);
    setRole(null);
    setRoute({ view: "school-overview" });
    window.history.replaceState(null, "", "/");
  };

  const renderView = () => {
    switch (view) {
      // READ: dashboard/list/detail views
      case "school-overview":
        return <SchoolOverview navigate={navigate} />;
      case "grade-dashboard":
        return <GradeDashboard navigate={navigate} />;
      case "class-dashboard":
        return (
          <ClassDashboard
            navigate={navigate}
            className={route.className ?? "9A"}
          />
        );
      case "student-profile":
        return <StudentProfile studentId={route.studentId} />;
      case "parent-portal":
        return <ParentPortal navigate={navigate} />;
      case "data-quality":
        return <DataQuality />;

      // CREATE/UPDATE: teacher data entry and counseling workspace
      case "teacher-entry":
        return <TeacherEntry />;
      case "counseling":
        return <CounselingWorkspace />;

      // STUDENT READ/UPDATE: learning, surveys, plans, profile, universities
      case "st-dashboard":
        return <StudentDashboard setView={navigate} />;
      case "st-lessons":
        return <StudentLessons />;
      case "st-references":
        return <StudentReferences />;
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
              navigate("st-universities");
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
      case "st-meeting":
        return <MeetingCenter role="student" />;

      // COUNSELOR READ/CREATE/UPDATE: dashboards, student detail, lessons, surveys, reports
      case "co-dashboard":
        return <CounselorDashboard navigate={navigate} />;
      case "co-students-list":
        return (
          <CounselorStudentList
            studentId={route.studentId}
            navigate={navigate}
          />
        );
      case "co-student-groups":
        return <CounselorStudentGroups navigate={navigate} />;
      case "co-families":
        return <CounselorFamilies navigate={navigate} />;
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
      case "co-report-work":
        return <CounselorReportStudentWork />;
      case "co-report-lessons":
        return <CounselorReportLessonProgress />;
      case "co-report-engagement":
        return <CounselorReportEngagement />;
      case "co-messenger":
        return (
          <MessengerView
            role="counselor"
            initialStudentId={route.studentId}
            initialParentId={route.parentId}
          />
        );
      case "parent-messenger":
        return <MessengerView role="parent" />;
      case "co-advice":
        return <AdvisementNotesCounselor />;
      case "co-meeting":
        return <MeetingCenter role="counselor" />;
      default:
        return <SchoolOverview navigate={navigate} />;
    }
  };

  return (
    <AppDataProvider key={`${role}-${sessionKey}`}>
      <>
        <div
          className="flex h-screen overflow-hidden"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {role === "student" ? (
            <StudentSidebar
              view={view}
              setView={navigate}
              onLogout={handleLogout}
            />
          ) : role === "counselor" ? (
            <CounselorSidebar
              view={view}
              setView={navigate}
              onLogout={handleLogout}
            />
          ) : (
            <Sidebar
              role={role}
              view={view}
              setView={navigate}
              onLogout={handleLogout}
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
