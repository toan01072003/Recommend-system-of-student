import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Briefcase,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Search,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  FileText,
  Home,
  Compass,
  Plus,
  Edit2,
  Save,
  Shield,
  Database,
  User,
  FolderOpen,
  BarChart2,
  GraduationCap,
  Heart,
  UserCheck,
  Activity,
  Gamepad2,
  ClipboardList,
  MapPin,
  BookMarked,
  Trophy,
  Map,
  Layers,
  Flag,
  PieChart,
  RefreshCw,
  Lightbulb,
  School,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  studentsInClass,
  EXPLORE_CAREERS,
  EXPLORE_FIELDS,
  REACTIONS,
  UNIVERSITIES,
  UNI_TYPES,
  UNI_REACTIONS,
  CONTACTS_FOR_STUDENT,
  CONTACTS_FOR_COUNSELOR,
  INITIAL_MESSAGES,
  SAMPLE_NOTES,
  SURVEY_COMPLETED_RESULTS,
  SUBJECTS,
  ACADEMIC_HISTORY,
  YEARS,
  DEMAND_OPTIONS,
  PERSONALITY_OPTS,
  CLUSTER_OPTS,
  SUBJECT_OPTS,
  EDU_OPTS,
  INTEREST_CHIPS,
  KID_CARDS,
  QUIZ_QUESTIONS,
  avg,
  scoreCareer,
  type CareerActivity,
  type CareerUniversity,
  type ExploreCareer,
  type University,
  type ChatContact,
  type ChatMessage,
  type AdviceNote,
  type TestFilters,
} from "../../../data";
import {
  RiskBadge,
  TestBadge,
  ProgressBar,
  StatCard,
  Avatar,
  ScoreBar,
  MultiCheck,
  LineChart,
  Line,
} from "../../../shared";
import { useAppData } from "../../../context/AppDataContext";
import {
  RIASEC_META,
  buildStudentCareerMatches,
  buildStudentSkillRadar,
  scoreTone,
} from "../../../logic/recommendation";
import {
  createAdviceNote,
  createMeeting,
  fetchAdviceNotes,
  fetchAppData,
  fetchMeetings,
  fetchStudent,
  fetchStudentRecommendation,
  type AdviceNoteRecord,
  type AdvicePriority,
  type MeetingRecord,
  type RecommendationResponse,
} from "../../../api/client";
import {
  hasStudentProfileDetail,
  resolveStudentProfile,
  type StudentProfileRecord,
} from "../../../logic/studentProfile";
import { useLanguage } from "../../../i18n";

/* ── Dashboard ── */

const DASHBOARD_COUNSELOR_ID = "COUNSELOR001";
const DASHBOARD_COUNSELOR_NAME = "Nguyễn Văn Minh";

const toDateTimeLocalValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const meetingDate = (meeting: MeetingRecord) => new Date(meeting.scheduledAt);

const sameCalendarDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const formatDashboardMeetingTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameCalendarDay(date, now)) return `Hôm nay ${time}`;
  if (sameCalendarDay(date, tomorrow)) return `Ngày mai ${time}`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const CounselorDashboard = ({
  navigate,
}: {
  navigate: (v: string, params?: { studentId?: string }) => void;
}) => {
  const { language, t } = useLanguage();
  const { studentsInClass, gradeData } = useAppData();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedSupportStudent, setSelectedSupportStudent] = useState<
    (typeof studentsInClass)[number] | null
  >(null);
  const [supportAction, setSupportAction] = useState<"menu" | "schedule">("menu");
  const [supportSchedule, setSupportSchedule] = useState(
    toDateTimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  );
  const [supportTopic, setSupportTopic] = useState("Định hướng nghề nghiệp");
  const [supportMeetingType, setSupportMeetingType] = useState<"offline" | "online">("offline");
  const [supportMeetingUrl, setSupportMeetingUrl] = useState("");
  const [supportActionStatus, setSupportActionStatus] = useState<
    "idle" | "saving" | "error"
  >("idle");
  const [supportActionNotice, setSupportActionNotice] = useState("");
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [meetingsStatus, setMeetingsStatus] = useState<
    "loading" | "idle" | "error"
  >("loading");

  const managedStudents = studentsInClass.length;

  const managedClasses = new Set(
    studentsInClass.map((student) => student.className),
  ).size;

  const completedSurveys = studentsInClass.filter(
    (student) => student.testStatus === "Hoàn thành",
  ).length;

  const supportStudents = studentsInClass
    .filter((student) => student.risk === "medium" || student.risk === "high")
    .sort((a, b) => (a.risk === "high" ? 0 : 1) - (b.risk === "high" ? 0 : 1));

  const supportPreview = supportStudents.slice(0, 4);

  const supportNeeded = supportStudents.length;
  const upcomingMeetings = [...meetings]
    .filter((meeting) => {
      const date = meetingDate(meeting);
      return !Number.isNaN(date.getTime()) && date >= new Date();
    })
    .sort((a, b) => meetingDate(a).getTime() - meetingDate(b).getTime())
    .slice(0, 5);
  const formatMeetingTime = (value: string) => {
    if (language === "vi") return formatDashboardMeetingTime(value);

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (sameCalendarDay(date, now)) return `Today ${time}`;
    if (sameCalendarDay(date, tomorrow)) return `Tomorrow ${time}`;

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    setMeetingsStatus("loading");
    fetchMeetings(
      { counselorId: DASHBOARD_COUNSELOR_ID },
      controller.signal,
    )
      .then((payload) => {
        setMeetings(payload.meetings);
        setMeetingsStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setMeetingsStatus("error");
      });

    return () => controller.abort();
  }, []);

  const openSupportActions = (student: (typeof studentsInClass)[number]) => {
    setSelectedSupportStudent(student);
    setSupportAction("menu");
    setSupportActionStatus("idle");
    setSupportActionNotice("");
    setShowSupportModal(false);
  };

  const closeSupportActions = () => {
    setSelectedSupportStudent(null);
    setSupportAction("menu");
    setSupportActionStatus("idle");
    setSupportActionNotice("");
  };

  const openSupportDetail = () => {
    if (!selectedSupportStudent) return;
    navigate("co-students-list", { studentId: selectedSupportStudent.id });
  };

  const openSupportMessenger = () => {
    if (!selectedSupportStudent) return;
    navigate("co-messenger", { studentId: selectedSupportStudent.id });
  };

  const saveSupportMeeting = () => {
    if (!selectedSupportStudent) return;
    if (!supportSchedule) {
      setSupportActionStatus("error");
      setSupportActionNotice(t("Vui lòng chọn thời gian hẹn gặp."));
      return;
    }
    const meetingUrl = supportMeetingUrl.trim();
    if (supportMeetingType === "online" && !meetingUrl) {
      setSupportActionStatus("error");
      setSupportActionNotice(t("Vui lòng nhập link meeting online."));
      return;
    }

    setSupportActionStatus("saving");
    setSupportActionNotice("");
    createMeeting({
      studentId: selectedSupportStudent.id,
      counselorId: DASHBOARD_COUNSELOR_ID,
      counselorName: DASHBOARD_COUNSELOR_NAME,
      topic: supportTopic,
      meetingType: supportMeetingType,
      meetingUrl: supportMeetingType === "online" ? meetingUrl : undefined,
      scheduledAt: supportSchedule,
    })
      .then((payload) => {
        setMeetings((current) => [payload.meeting, ...current]);
        setSupportActionStatus("idle");
        setSupportActionNotice(
          language === "en"
            ? `Created a meeting with ${selectedSupportStudent.name}.`
            : `Đã tạo lịch hẹn với ${selectedSupportStudent.name}.`,
        );
        setSupportSchedule(toDateTimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000)));
        setSupportMeetingType("offline");
        setSupportMeetingUrl("");
      })
      .catch((error) => {
        setSupportActionStatus("error");
        setSupportActionNotice(error.message || t("Không tạo được lịch hẹn."));
      });
  };

  const renderSupportStudent = (student: (typeof studentsInClass)[number]) => (
    <button
      key={student.id}
      onClick={() => openSupportActions(student)}
      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-gray-50"
    >
      <Avatar name={student.name} size="sm" />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {student.name}
        </p>

        <p className="text-xs text-gray-500 font-mono">
          {student.id} · {t("Hồ sơ")} {student.progress}%
        </p>
      </div>

      <RiskBadge level={student.risk} />
    </button>
  );

  const gradeCompletionData = [
    ...gradeData.map((item) => ({
      grade: item.grade,
      done: item.tests,
      total: item.students,
    })),
  ];

  const weeklyActivity = [
    { day: "T2", lessons: 12, surveys: 8 },

    { day: "T3", lessons: 18, surveys: 14 },

    { day: "T4", lessons: 9, surveys: 6 },

    { day: "T5", lessons: 22, surveys: 17 },

    { day: "T6", lessons: 15, surveys: 11 },

    { day: "T7", lessons: 5, surveys: 3 },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t("Dashboard Cố vấn")} 📋
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          {t("Tổng quan hoạt động học sinh")} · {t("Năm học 2024–2025")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Học sinh quản lý"
          value={`${managedStudents}`}
          sub={
            language === "en"
              ? `${managedClasses} classes, ${gradeData.length} grades`
              : `${managedClasses} lớp, ${gradeData.length} khối`
          }
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Bài học đã giao"
          value="24"
          sub={language === "en" ? "18 completed" : "18 đã hoàn thành"}
          icon={BookOpen}
          color="green"
        />

        <StatCard
          title="Khảo sát hoàn thành"
          value={`${Math.round((completedSurveys / Math.max(managedStudents, 1)) * 100)}%`}
          sub={`${completedSurveys} / ${managedStudents} HS`}
          icon={ClipboardList}
          color="yellow"
        />

        <StatCard
          title="Cần hỗ trợ"
          value={`${supportNeeded} HS`}
          sub="Medium/high risk"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">
            {t("Hoạt động trong tuần")}
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} barSize={14}>
              <CartesianGrid
                key="grid"
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />

              <XAxis
                key="x"
                dataKey="day"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                key="y"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip key="tip" />

              <Bar
                key="lessons"
                dataKey="lessons"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name={t("Bài học")}
              />

              <Bar
                key="surveys"
                dataKey="surveys"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                name={t("Khảo sát")}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-blue-500" />
              {t("Bài học")}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-amber-400" />
              {t("Khảo sát")}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">
            {t("Tiến độ theo khối")}
          </h3>

          <div className="space-y-3">
            {gradeCompletionData.map((g) => {
              const pct = Math.round((g.done / g.total) * 100);

              return (
                <div key={g.grade}>
                  <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>{g.grade}</span>

                    <span className="font-mono font-bold">
                      {g.done}/{g.total}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-gray-800">
              🔴 {t("Học sinh cần hỗ trợ ngay")}
            </h3>

            {supportStudents.length > supportPreview.length && (
              <button
                onClick={() => setShowSupportModal(true)}
                className="text-xs font-bold text-red-600 hover:text-red-700"
              >
                {t("Xem thêm")}
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {supportPreview.length === 0 ? (
              <p className="text-sm text-gray-500">
                {t("Chưa có học sinh nào cần hỗ trợ ngay.")}
              </p>
            ) : (
              supportPreview.map(renderSupportStudent)
            )}
          </div>

          {supportStudents.length > supportPreview.length && (
            <button
              onClick={() => setShowSupportModal(true)}
              className="mt-3 w-full rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
            >
              {language === "en"
                ? `View all ${supportStudents.length} students`
                : `Xem toàn bộ ${supportStudents.length} học sinh`}
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-gray-800">
              📅 {t("Lịch tư vấn sắp tới")}
            </h3>
            <button
              onClick={() => navigate("co-meeting")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              {t("Xem lịch")}
            </button>
          </div>

          <div className="space-y-2.5">
            {meetingsStatus === "loading" ? (
              <p className="rounded-xl bg-gray-50 px-3 py-4 text-sm text-gray-500">
                {t("Đang tải lịch tư vấn từ database...")}
              </p>
            ) : meetingsStatus === "error" ? (
              <p className="rounded-xl bg-red-50 px-3 py-4 text-sm font-semibold text-red-700">
                {t("Không tải được lịch tư vấn từ database.")}
              </p>
            ) : upcomingMeetings.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-3 py-4 text-sm text-gray-500">
                {t("Chưa có lịch tư vấn sắp tới.")}
              </p>
            ) : (
              upcomingMeetings.map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => navigate("co-students-list", { studentId: meeting.studentId })}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      meeting.meetingType === "online"
                        ? "bg-violet-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <Clock
                      size={14}
                      className={
                        meeting.meetingType === "online"
                          ? "text-violet-600"
                          : "text-blue-600"
                      }
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {meeting.studentName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {formatMeetingTime(meeting.scheduledAt)} ·{" "}
                      {meeting.className}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full max-w-32 truncate ${
                      meeting.meetingType === "online"
                        ? "bg-violet-100 text-violet-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                    title={meeting.topic}
                  >
                    {meeting.topic}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {t("Học sinh cần hỗ trợ ngay")}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {language === "en"
                    ? `${supportStudents.length} medium/high risk students`
                    : `${supportStudents.length} học sinh medium/high risk`}
                </p>
              </div>

              <button
                onClick={() => setShowSupportModal(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                {t("Đóng")}
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-4 space-y-2">
              {supportStudents.map(renderSupportStudent)}
            </div>
          </div>
        </div>
      )}

      {selectedSupportStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-gray-100 shadow-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={selectedSupportStudent.name} size="sm" />
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {selectedSupportStudent.name}
                  </h2>
                  <p className="text-sm text-gray-500 font-mono">
                    {selectedSupportStudent.id} · {selectedSupportStudent.className}
                  </p>
                </div>
              </div>

              <button
                onClick={closeSupportActions}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                {t("Đóng")}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-100 p-3">
              <div>
                <p className="text-sm font-bold text-red-800">
                  {t("Hồ sơ")} {selectedSupportStudent.progress}%
                </p>
                <p className="text-xs text-red-700 mt-0.5">
                  {t("Mức hỗ trợ hiện tại")}
                </p>
              </div>
              <RiskBadge level={selectedSupportStudent.risk} />
            </div>

            {supportAction === "menu" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
                <button
                  onClick={() => {
                    setSupportAction("schedule");
                    setSupportActionNotice("");
                    setSupportActionStatus("idle");
                  }}
                  className="text-left rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-700 hover:bg-blue-100"
                >
                  <Clock size={18} />
                  <p className="font-bold text-sm mt-3">{t("Lên lịch hẹn gặp")}</p>
                  <p className="text-xs mt-1 opacity-80">{t("Tạo lịch hỗ trợ")}</p>
                </button>

                <button
                  onClick={openSupportMessenger}
                  className="text-left rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700 hover:bg-emerald-100"
                >
                  <MessageSquare size={18} />
                  <p className="font-bold text-sm mt-3">{t("Nhắn tin")}</p>
                  <p className="text-xs mt-1 opacity-80">{t("Mở Messenger")}</p>
                </button>

                <button
                  onClick={openSupportDetail}
                  className="text-left rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-700 hover:bg-amber-100"
                >
                  <UserCheck size={18} />
                  <p className="font-bold text-sm mt-3">{t("Chi tiết")}</p>
                  <p className="text-xs mt-1 opacity-80">{t("Xem hồ sơ")}</p>
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <button
                  onClick={() => {
                    setSupportAction("menu");
                    setSupportActionNotice("");
                    setSupportActionStatus("idle");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  {t("Quay lại lựa chọn")}
                </button>

                {supportActionNotice && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      supportActionStatus === "error"
                        ? "bg-red-50 border border-red-100 text-red-700"
                        : "bg-emerald-50 border border-emerald-100 text-emerald-700"
                    }`}
                  >
                    {supportActionNotice}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-500">
                      {t("Thời gian")}
                    </span>
                    <input
                      type="datetime-local"
                      value={supportSchedule}
                      onChange={(event) => setSupportSchedule(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-500">
                      {t("Chủ đề")}
                    </span>
                    <select
                      value={supportTopic}
                      onChange={(event) => setSupportTopic(event.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    >
                      <option value="Định hướng nghề nghiệp">
                        {t("Định hướng nghề nghiệp")}
                      </option>
                      <option value="Review wellbeing">Review wellbeing</option>
                      <option value="Trao đổi với phụ huynh">
                        {t("Trao đổi với phụ huynh")}
                      </option>
                      <option value="Điều chỉnh kế hoạch học tập">
                        {t("Điều chỉnh kế hoạch học tập")}
                      </option>
                    </select>
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-500">
                      {t("Loại hẹn gặp")}
                    </span>
                    <select
                      value={supportMeetingType}
                      onChange={(event) =>
                        setSupportMeetingType(event.target.value as "offline" | "online")
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    >
                      <option value="offline">Offline</option>
                      <option value="online">Online</option>
                    </select>
                  </label>

                  {supportMeetingType === "online" && (
                    <label className="space-y-1.5">
                      <span className="text-xs font-bold text-gray-500">
                        Link meeting online
                      </span>
                      <input
                        type="url"
                        value={supportMeetingUrl}
                        onChange={(event) => setSupportMeetingUrl(event.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                      />
                    </label>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {selectedSupportStudent.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {supportTopic} · {supportMeetingType === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                  <button
                    onClick={saveSupportMeeting}
                    disabled={supportActionStatus === "saving"}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Save size={13} />
                    {supportActionStatus === "saving" ? t("Đang tạo") : t("Tạo lịch")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

