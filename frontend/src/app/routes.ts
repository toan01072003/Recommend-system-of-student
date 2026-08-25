export type AppRoute = {
  view: string;
  className?: string;
  studentId?: string;
  parentId?: string;
};

export type AppRole = "admin" | "teacher" | "counselor" | "student" | "parent";

const viewPathMap: Record<string, string> = {
  "school-overview": "/admin/overview",
  "grade-dashboard": "/admin/grades",
  "teacher-entry": "/teacher/entry",
  counseling: "/teacher/counseling",
  "parent-portal": "/parent",
  "parent-messenger": "/parent/messenger",
  "data-quality": "/admin/data-quality",
  "co-dashboard": "/counselor/dashboard",
  "co-students-list": "/counselor/students",
  "co-student-groups": "/counselor/student-groups",
  "co-families": "/counselor/families",
  "co-lessons": "/counselor/lessons",
  "co-assignments": "/counselor/assignments",
  "co-surveys": "/counselor/surveys",
  "co-report-work": "/counselor/reports/student-work",
  "co-report-lessons": "/counselor/reports/lessons",
  "co-report-engagement": "/counselor/reports/engagement",
  "co-messenger": "/counselor/messenger",
  "co-advice": "/counselor/advice",
  "co-meeting": "/counselor/meeting",
  "st-dashboard": "/student/dashboard",
  "st-lessons": "/student/lessons",
  "st-references": "/student/references",
  "st-surveys": "/student/surveys",
  "st-assignment": "/student/assignment",
  "st-games": "/student/games",
  "st-explore": "/student/explore",
  "st-universities": "/student/universities",
  "st-personal": "/student/personal",
  "st-portfolio": "/student/portfolio",
  "st-resume": "/student/resume",
  "st-applications": "/student/applications",
  "st-plan-grade": "/student/plan/grade",
  "st-plan-pathways": "/student/plan/pathways",
  "st-messenger": "/student/messenger",
  "st-advice": "/student/advice",
  "st-meeting": "/student/meeting",
};

const pathViewMap = Object.fromEntries(
  Object.entries(viewPathMap).map(([view, path]) => [path, view]),
);

const removedCounselorPaths = new Set([
  "/counselor/courses",
  "/counselor/test-scores",
  "/counselor/reports/assignment",
  "/counselor/reports/college",
]);

export const parseAppRoute = (pathname: string): AppRoute => {
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  const counselorStudentMatch = normalized.match(/^\/counselor\/students\/([^/]+)$/);
  if (counselorStudentMatch) {
    return {
      view: "co-students-list",
      studentId: decodeURIComponent(counselorStudentMatch[1]),
    };
  }

  const counselorMessengerMatch = normalized.match(/^\/counselor\/messenger\/([^/]+)$/);
  if (counselorMessengerMatch) {
    return {
      view: "co-messenger",
      studentId: decodeURIComponent(counselorMessengerMatch[1]),
    };
  }

  const counselorParentMessengerMatch = normalized.match(
    /^\/counselor\/messenger\/parent\/([^/]+)\/student\/([^/]+)$/,
  );
  if (counselorParentMessengerMatch) {
    return {
      view: "co-messenger",
      parentId: decodeURIComponent(counselorParentMessengerMatch[1]),
      studentId: decodeURIComponent(counselorParentMessengerMatch[2]),
    };
  }

  const teacherClassStudentMatch = normalized.match(
    /^\/teacher\/classes\/([^/]+)\/students\/([^/]+)$/,
  );
  if (teacherClassStudentMatch) {
    return {
      view: "student-profile",
      className: decodeURIComponent(teacherClassStudentMatch[1]),
      studentId: decodeURIComponent(teacherClassStudentMatch[2]),
    };
  }

  const teacherClassMatch = normalized.match(/^\/teacher\/classes\/([^/]+)$/);
  if (teacherClassMatch) {
    return {
      view: "class-dashboard",
      className: decodeURIComponent(teacherClassMatch[1]),
    };
  }

  const teacherStudentMatch = normalized.match(/^\/teacher\/students\/([^/]+)$/);
  if (teacherStudentMatch) {
    return {
      view: "student-profile",
      className: "9A",
      studentId: decodeURIComponent(teacherStudentMatch[1]),
    };
  }

  if (normalized === "/teacher/students") {
    return { view: "student-profile" };
  }

  if (removedCounselorPaths.has(normalized)) {
    return { view: "co-dashboard" };
  }

  if (pathViewMap[normalized]) {
    return { view: pathViewMap[normalized] };
  }

  const appViewMatch = normalized.match(/^\/app\/([^/]+)$/);
  if (appViewMatch) {
    return { view: decodeURIComponent(appViewMatch[1]) };
  }

  return { view: "school-overview" };
};

export const appRouteToPath = (route: AppRoute): string => {
  if (route.view === "co-students-list") {
    return route.studentId
      ? `/counselor/students/${encodeURIComponent(route.studentId)}`
      : "/counselor/students";
  }

  if (route.view === "co-messenger") {
    if (route.parentId && route.studentId) {
      return `/counselor/messenger/parent/${encodeURIComponent(route.parentId)}/student/${encodeURIComponent(route.studentId)}`;
    }

    return route.studentId
      ? `/counselor/messenger/${encodeURIComponent(route.studentId)}`
      : "/counselor/messenger";
  }

  if (route.view === "class-dashboard") {
    return `/teacher/classes/${encodeURIComponent(route.className ?? "9A")}`;
  }

  if (route.view === "student-profile") {
    const className = encodeURIComponent(route.className ?? "9A");

    return route.studentId
      ? `/teacher/classes/${className}/students/${encodeURIComponent(route.studentId)}`
      : `/teacher/classes/${className}/students`;
  }

  return viewPathMap[route.view] ?? `/app/${encodeURIComponent(route.view)}`;
};

export const isRootPath = (pathname: string) => pathname === "/" || pathname === "";

export const roleFromPath = (pathname: string): AppRole | null => {
  const firstSegment = pathname.split("/").filter(Boolean)[0];

  if (
    firstSegment === "admin" ||
    firstSegment === "teacher" ||
    firstSegment === "counselor" ||
    firstSegment === "student" ||
    firstSegment === "parent"
  ) {
    return firstSegment;
  }

  return null;
};
