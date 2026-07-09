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
} from "../../data";
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
} from "../../shared";
import { useAppData } from "../../context/AppDataContext";
import {
  RIASEC_META,
  buildStudentCareerMatches,
  buildStudentSkillRadar,
  scoreTone,
} from "../../logic/recommendation";
import {
  fetchAppData,
  fetchStudent,
  fetchStudentRecommendation,
  type RecommendationResponse,
} from "../../api/client";
import {
  hasStudentProfileDetail,
  resolveStudentProfile,
  type StudentProfileRecord,
} from "../../logic/studentProfile";

// ── Counselor Views ───────────────────────────────────────────────────────────

/* ── Dashboard ── */

export const CounselorDashboard = () => {
  const { studentsInClass, gradeData } = useAppData();

  const managedStudents = studentsInClass.length;

  const managedClasses = new Set(
    studentsInClass.map((student) => student.className),
  ).size;

  const completedSurveys = studentsInClass.filter(
    (student) => student.testStatus === "Hoàn thành",
  ).length;

  const supportNeeded = studentsInClass.filter(
    (student) => student.risk === "medium" || student.risk === "high",
  ).length;

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
        <h1 className="text-xl font-bold text-gray-900">Dashboard Cố vấn 📋</h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Tổng quan hoạt động học sinh · Năm học 2024–2025
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Học sinh quản lý"
          value={`${managedStudents}`}
          sub={`${managedClasses} lớp, ${gradeData.length} khối`}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Bài học đã giao"
          value="24"
          sub="18 đã hoàn thành"
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
          <h3 className="font-bold text-gray-800 mb-4">Hoạt động trong tuần</h3>

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
                name="Bài học"
              />

              <Bar
                key="surveys"
                dataKey="surveys"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                name="Khảo sát"
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-blue-500" />
              Bài học
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-amber-400" />
              Khảo sát
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Tiến độ theo khối</h3>

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
          <h3 className="font-bold text-gray-800 mb-3">
            🔴 Học sinh cần hỗ trợ ngay
          </h3>

          <div className="space-y-2.5">
            {studentsInClass
              .filter((s) => s.risk === "high" || s.risk === "medium")
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50"
                >
                  <Avatar name={s.name} size="sm" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {s.name}
                    </p>

                    <p className="text-xs text-gray-500 font-mono">
                      {s.id} · Hồ sơ {s.progress}%
                    </p>
                  </div>

                  <RiskBadge level={s.risk} />
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">
            📅 Lịch tư vấn sắp tới
          </h3>

          <div className="space-y-2.5">
            {[
              {
                name: "Nguyễn Minh Anh",
                date: "Hôm nay 14:00",
                type: "Định hướng học kỳ",
                cls: "bg-orange-100 text-orange-700",
              },

              {
                name: "Hoàng Thị Mai",
                date: "Ngày mai 09:30",
                type: "Review career test",
                cls: "bg-blue-100 text-blue-700",
              },

              {
                name: "Trần Đức Huy",
                date: "28/06 15:00",
                type: "Tư vấn chọn ngành",
                cls: "bg-emerald-100 text-emerald-700",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {a.name}
                  </p>

                  <p className="text-xs text-gray-500">{a.date}</p>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.cls}`}
                >
                  {a.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Student Detail (7 tabs) ── */

export const CounselorStudentDetail = ({
  student,
  onBack,
}: {
  student: StudentProfileRecord;
  onBack: () => void;
}) => {
  const [tab, setTab] = useState("academic");
  const [alumniRecommendation, setAlumniRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [alumniStatus, setAlumniStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [alumniError, setAlumniError] = useState("");
  const [alumniConfirming, setAlumniConfirming] = useState(false);
  const [supportAction, setSupportAction] = useState<
    "schedule" | "message" | "advice"
  >("schedule");
  const [supportSchedule, setSupportSchedule] = useState("");
  const [supportTopic, setSupportTopic] = useState("Định hướng nghề nghiệp");
  const [messageDraft, setMessageDraft] = useState("");
  const [advisorMessages, setAdvisorMessages] = useState<
    { from: "counselor" | "student"; body: string; time: string }[]
  >([
    {
      from: "student",
      body: "Em muốn trao đổi thêm về ngành phù hợp với điểm mạnh của mình.",
      time: "09:10",
    },
  ]);
  const [adviceSubject, setAdviceSubject] = useState("Gợi ý bước tiếp theo");
  const [adviceNote, setAdviceNote] = useState("");
  const [actionNotice, setActionNotice] = useState("");

  useEffect(() => {
    setAlumniRecommendation(null);
    setAlumniStatus("idle");
    setAlumniError("");
    setAlumniConfirming(false);
    setSupportAction("schedule");
    setSupportSchedule("");
    setSupportTopic("Định hướng nghề nghiệp");
    setMessageDraft("");
    setAdvisorMessages([
      {
        from: "student",
        body: "Em muốn trao đổi thêm về ngành phù hợp với điểm mạnh của mình.",
        time: "09:10",
      },
    ]);
    setAdviceSubject("Gợi ý bước tiếp theo");
    setAdviceNote("");
    setActionNotice("");
  }, [student.id]);

  const cachedRecommendation = alumniRecommendation ?? (
    student.recommendHistory?.[0]
      ? {
          student_vector: student.recommendHistory[0].studentVector,
          results: student.recommendHistory[0].results,
          recommendHistory: student.recommendHistory,
          latestRecommendCareer: student.latestRecommendCareer,
        }
      : null
  );

  const handleReloadRecommendation = () => {
    const controller = new AbortController();

    setAlumniStatus("loading");
    setAlumniError("");
    setAlumniConfirming(false);
    fetchStudentRecommendation(student, controller.signal, { persist: true })
      .then((payload) => {
        setAlumniRecommendation(payload);
        setAlumniStatus("success");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setAlumniError(
          error.message || "Không lấy được kết quả recommendation.",
        );
        setAlumniStatus("error");
      });
  };

  const showActionNotice = (message: string) => {
    setActionNotice(message);
    window.setTimeout(() => setActionNotice(""), 2400);
  };

  const handleSaveSupportSchedule = () => {
    showActionNotice(
      supportSchedule
        ? `Đã lên lịch hỗ trợ cho ${student.name}.`
        : "Vui lòng chọn thời gian hỗ trợ.",
    );
  };

  const handleSendMessage = () => {
    const body = messageDraft.trim();
    if (!body) return;
    setAdvisorMessages((items) => [
      ...items,
      {
        from: "counselor",
        body,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessageDraft("");
    showActionNotice(`Đã gửi tin nhắn cho ${student.name}.`);
  };

  const handleSendAdviceNote = () => {
    if (!adviceNote.trim()) {
      showActionNotice("Vui lòng nhập nội dung note advice.");
      return;
    }
    setAdviceNote("");
    showActionNotice(`Đã gửi note advice cho ${student.name}.`);
  };

  const tabs = [
    { id: "academic", label: "Academic Profile" },

    { id: "personal", label: "Personal Statement" },

    { id: "career", label: "Career Profile" },

    { id: "recommendation", label: "Gợi ý & Đánh giá" },

    { id: "wellbeing", label: "Wellbeing" },

    { id: "parent", label: "Kỳ vọng PH" },

    { id: "alumni", label: "Alumni" },
  ];

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        <ArrowRight size={13} className="rotate-180" /> Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-5 flex items-start gap-4 flex-wrap">
          <Avatar name={student.name} size="lg" />

          <div className="flex-1 min-w-48">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {student.name}
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Mã HS: <span className="font-mono">{student.id}</span> · Lớp{" "}
                  {student.className} · {student.typeClass} · {student.province}
                </p>
              </div>

              <RiskBadge level={student.risk} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              {[
                {
                  label: "Học lực",
                  value:
                    student.avg >= 8
                      ? "Giỏi"
                      : student.avg >= 6.5
                        ? "Khá"
                        : "Trung bình",
                  cls: student.avg >= 8 ? "text-green-600" : "text-blue-600",
                },

                {
                  label: "Career Fit",
                  value: student.careerFit,
                  cls: "text-indigo-600",
                },

                {
                  label: "Hồ sơ",
                  value: `${student.progress}%`,
                  cls: "text-orange-600",
                },

                {
                  label: "RIASEC",
                  value: student.riasecTop3,
                  cls: "text-emerald-600",
                },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>

                  <p className={`text-sm font-bold mt-0.5 ${item.cls}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 border-t border-gray-100">
          <div className="flex gap-0 overflow-x-auto -mb-px">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}

                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "academic" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Xu hướng học tập</h3>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={student.academicTrend}>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />

                <XAxis
                  key="x"
                  dataKey="term"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  key="y"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[6, 10]}
                />

                <Tooltip key="tip" />

                <Line
                  key="l"
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="ĐTB"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Điểm số theo môn</h3>

            <div className="space-y-2.5">
              {student.scores.map((score) => {
                const tone = scoreTone(score.score);

                return (
                  <div key={score.subject} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20 flex-shrink-0">
                      {score.subject}
                    </span>

                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${tone === "strong" ? "bg-emerald-500" : tone === "weak" ? "bg-red-400" : "bg-blue-400"}`}
                        style={{ width: `${(score.score / 10) * 100}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-mono font-bold w-8 text-right ${tone === "strong" ? "text-emerald-600" : tone === "weak" ? "text-red-500" : "text-blue-600"}`}
                    >
                      {score.score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <strong>Thành tích:</strong> {student.achievements} ·{" "}
              {student.awards} · {student.certificates}
            </div>
          </div>
        </div>
      )}

      {tab === "personal" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Personal Statement</h3>

          {[
            {
              label: "Nghề quan tâm",
              value: student.favoriteCareer,
            },

            {
              label: "Nhóm ngành phù hợp",
              value: student.careerFit,
            },

            {
              label: "Phong cách nghề nghiệp mong muốn",
              value: student.desiredCareerStyle,
            },

            {
              label: "Môn yêu thích",
              value: student.favoriteSubject,
            },

            {
              label: "Môn ít thích hơn",
              value: student.leastFavoriteSubject,
            },

            { label: "Hoạt động ưa thích", value: student.preferredActivities },

            { label: "Chủ đề tò mò", value: student.curiosityTopics },

            {
              label: "Tính cách học tập",
              value: `${student.introExtro} · ${student.workStyle} · MBTI ${student.mbti} · DISC ${student.disc}`,
            },

            { label: "Nghề không thích", value: student.dislikedCareer },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                {f.label}
              </p>

              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Bản đồ kỹ năng</h3>

            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={buildStudentSkillRadar(student)}>
                <PolarGrid key="pg" stroke="#e5e7eb" />

                <PolarAngleAxis
                  key="pa"
                  dataKey="skill"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />

                <PolarRadiusAxis
                  key="pr"
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />

                <Radar
                  key="r"
                  name="Điểm"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 mb-2">
              Career Profile từ database
            </h3>

            {[
              ["MBTI", student.mbti],

              ["DISC", student.disc],

              ["Holland Code", student.riasecTop3],

              ["Career Match Top 1", student.favoriteCareer],

              ["Nhóm ngành", student.careerFit],

              ["Kiểu nghề mong muốn", student.desiredCareerStyle],

              ["Lương kỳ vọng", `${student.expectedSalary} triệu/tháng`],

              ["IQ / EQ", `${student.iq} / ${student.eq}`],
            ].map(([k, v]) => (
              <div
                key={k as string}
                className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl"
              >
                <span className="text-xs text-gray-500 font-medium">
                  {k as string}
                </span>

                <span className="text-xs font-bold text-blue-700">
                  {v as string}
                </span>
              </div>
            ))}

            <div className="space-y-2 pt-1">
              {buildStudentCareerMatches(student).map((item, idx) => (
                <div key={item.career} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400 w-4">
                    {idx + 1}
                  </span>

                  <span className="text-xs text-gray-700 flex-1">
                    {item.career}
                  </span>

                  <div className="w-20 h-1.5 rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-[#0F766E]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-indigo-700 w-8 text-right">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 mt-2">
              <strong>Nghề đã khám phá:</strong>{" "}
              {student.exploredCareers.join(", ")}
            </div>
          </div>
        </div>
      )}

      {tab === "recommendation" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "schedule",
                label: "Lên lịch hỗ trợ",
                sub: student.className,
                icon: Clock,
                cls: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                id: "message",
                label: "Bắt đầu nhắn tin",
                sub: "Mở cửa sổ tin nhắn",
                icon: MessageSquare,
                cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                id: "advice",
                label: "Gửi note advice",
                sub: "Advice Notes",
                icon: BookMarked,
                cls: "bg-amber-50 text-amber-700 border-amber-100",
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = supportAction === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setSupportAction(
                      item.id as "schedule" | "message" | "advice",
                    )
                  }
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    active
                      ? `${item.cls} shadow-sm ring-2 ring-offset-1 ring-blue-100`
                      : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        active ? "bg-white/70" : "bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs opacity-75 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {actionNotice && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
              {actionNotice}
            </div>
          )}

          {supportAction === "schedule" && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-800">Lên lịch hỗ trợ</h3>
                <span className="text-xs font-mono text-gray-400">
                  {student.id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500">
                    Thời gian
                  </span>
                  <input
                    type="datetime-local"
                    value={supportSchedule}
                    onChange={(event) =>
                      setSupportSchedule(event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500">
                    Chủ đề
                  </span>
                  <select
                    value={supportTopic}
                    onChange={(event) => setSupportTopic(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  >
                    <option>Định hướng nghề nghiệp</option>
                    <option>Review wellbeing</option>
                    <option>Trao đổi với phụ huynh</option>
                    <option>Điều chỉnh kế hoạch học tập</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {supportTopic} · {student.className}
                  </p>
                </div>
                <button
                  onClick={handleSaveSupportSchedule}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
                >
                  <Save size={13} /> Lưu lịch
                </button>
              </div>
            </div>
          )}

          {supportAction === "message" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="sm" />
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Tin nhắn với {student.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {student.className} · {student.id}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Đang mở
                </span>
              </div>

              <div className="p-5 space-y-3 bg-gray-50 min-h-56">
                {advisorMessages.map((message, index) => {
                  const isCounselor = message.from === "counselor";

                  return (
                    <div
                      key={`${message.time}-${index}`}
                      className={`flex ${isCounselor ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2 shadow-sm ${
                          isCounselor
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                        <p
                          className={`text-[11px] mt-1 ${
                            isCounselor ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <MessageSquare size={13} /> Gửi
                </button>
              </div>
            </div>
          )}

          {supportAction === "advice" && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-800">Gửi note advice</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                  {student.name}
                </span>
              </div>

              <div className="space-y-3">
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-gray-500">
                    Tiêu đề
                  </span>
                  <input
                    value={adviceSubject}
                    onChange={(event) => setAdviceSubject(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-gray-500">
                    Nội dung
                  </span>
                  <textarea
                    value={adviceNote}
                    onChange={(event) => setAdviceNote(event.target.value)}
                    rows={6}
                    placeholder="Nhập lời khuyên gửi cho học sinh..."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400"
                  />
                </label>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      {adviceSubject || "Note advice"}
                    </p>
                    <p className="text-xs text-amber-700">
                      Gửi tới {student.name} · {student.className}
                    </p>
                  </div>
                  <button
                    onClick={handleSendAdviceNote}
                    className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 flex items-center gap-1.5"
                  >
                    <BookMarked size={13} /> Gửi note
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "wellbeing" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Wellbeing</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Dữ liệu sức khỏe/tâm lý từ hồ sơ database
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs border border-blue-100 font-bold">
              <Shield size={13} /> Cố vấn được phép xem
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ["Mức stress/burnout", student.stressLevel],
              ["Áp lực học tập", student.academicPressureLevel],
              ["Mức tự tin", student.confidenceLevel],
              ["Ghi chú sức khỏe", student.medicalHistory],
            ].map(([k, v]) => (
              <div
                key={k as string}
                className="p-3 bg-red-50 rounded-xl border border-red-100"
              >
                <p className="text-xs font-bold text-red-700 mb-0.5">
                  {k as string}
                </p>

                <p className="text-sm text-gray-700">{v as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "parent" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">
            Kỳ vọng & Tài chính Phụ huynh
          </h3>

          {[
            [
              "Phụ huynh",
              `${student.fatherName} (${student.fatherOccupation}) · ${student.motherName} (${student.motherOccupation})`,
            ],

            [
              "Trình độ phụ huynh",
              `Bố: ${student.fatherEducation} · Mẹ: ${student.motherEducation}`,
            ],

            ["Định hướng kỳ vọng", student.parentExpectation],

            ["Mức tài chính", student.parentFinanceLevel],

            ["Tỉnh/thành", student.province],

            ["Nhóm nghề học sinh thích", student.favoriteCareer],
          ].map(([k, v]) => (
            <div
              key={k as string}
              className="flex gap-4 p-3 bg-gray-50 rounded-xl"
            >
              <span className="text-xs font-bold text-gray-500 w-32 flex-shrink-0">
                {k as string}
              </span>

              <span className="text-sm text-gray-700">{v as string}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "alumni" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-gray-800">
                Recommendation từ mô hình
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Hiển thị kết quả recommend gần nhất đã lưu trong database.
              </p>
            </div>

            <button
              onClick={() => setAlumniConfirming(true)}
              disabled={alumniStatus === "loading"}
              className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw size={13} /> Reload recommend
            </button>
          </div>

          {alumniConfirming && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 mb-4">
              <p className="text-sm font-bold text-amber-900">
                Chạy lại recommendation engine cho {student.name}?
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Kết quả mới sẽ được lưu vào database và thêm vào lịch sử.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleReloadRecommendation}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setAlumniConfirming(false)}
                  className="px-3 py-2 rounded-lg bg-white border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {alumniStatus === "loading" && (
            <div className="p-8 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">
                Đang gửi hồ sơ học sinh vào recommendation engine...
              </p>
            </div>
          )}

          {alumniStatus === "error" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="text-red-600 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-gray-800">
                    Không lấy được kết quả model
                  </p>
                  <p className="text-sm text-red-600 mt-1">{alumniError}</p>
                </div>
              </div>
            </div>
          )}

          {!cachedRecommendation && alumniStatus !== "loading" && (
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500">
              Chưa có kết quả recommend đã lưu. Bấm Reload recommend để chạy
              engine và lưu kết quả vào database.
            </div>
          )}

          {cachedRecommendation && alumniStatus !== "loading" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                {cachedRecommendation.results.slice(0, 6).map((career) => (
                  <div
                    key={career.soc_code}
                    className="p-3.5 rounded-xl border border-gray-100 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black flex-shrink-0">
                        {career.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-800 leading-snug">
                              {career.title}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              {career.soc_code}
                            </p>
                          </div>
                          <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                            {Math.round(career.score * 100)}%
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-6 gap-1.5">
                          {Object.entries(career.vector).map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-white border border-gray-100 rounded-lg px-2 py-1.5 text-center"
                            >
                              <p
                                className="text-xs font-bold"
                                style={{ color: RIASEC_META[key]?.color }}
                              >
                                {key}
                              </p>
                              <p className="text-xs font-mono text-gray-600">
                                {Number(value).toFixed(1)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3">
                    Profile gửi vào model
                  </h4>
                  {[
                    ["Học sinh", `${student.name} · ${student.id}`],
                    ["Nhóm ngành", student.careerFit],
                    ["Nghề quan tâm", student.favoriteCareer],
                    ["RIASEC", student.riasecTop3],
                    ["MBTI / DISC", `${student.mbti} / ${student.disc}`],
                  ].map(([label, value]) => (
                    <div
                      key={label as string}
                      className="flex justify-between gap-3 py-1.5 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-xs text-gray-500 font-medium">
                        {label as string}
                      </span>
                      <span className="text-xs text-gray-800 font-bold text-right">
                        {value as string}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3">
                    Vector học sinh
                  </h4>
                  <div className="space-y-2.5">
                    {Object.entries(cachedRecommendation.student_vector).map(
                      ([key, value]) => {
                        const maxValue = Math.max(
                          ...Object.values(
                            cachedRecommendation.student_vector,
                          ),
                        );

                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-blue-900">
                                {key} · {RIASEC_META[key]?.label}
                              </span>
                              <span className="text-xs font-mono font-bold text-blue-900">
                                {value}
                              </span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${Math.max(8, (value / maxValue) * 100)}%`,
                                  backgroundColor: RIASEC_META[key]?.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Students List ── */

export const CounselorStudentList = ({
  studentId,
  navigate,
}: {
  studentId?: string;
  navigate: (v: string, params?: { studentId?: string }) => void;
}) => {
  const { studentsInClass } = useAppData();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const summaryProfile = resolveStudentProfile(studentsInClass, studentId);
  const [detailProfile, setDetailProfile] =
    useState<StudentProfileRecord | null>(null);
  const [detailStatus, setDetailStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const selected = detailProfile ?? summaryProfile;

  useEffect(() => {
    setDetailProfile(null);
    setDetailStatus("idle");

    if (!studentId) return;
    if (
      summaryProfile?.id === studentId &&
      hasStudentProfileDetail(summaryProfile)
    ) {
      return;
    }

    const controller = new AbortController();

    setDetailStatus("loading");
    fetchStudent<{ student: StudentProfileRecord }>(
      studentId,
      controller.signal,
    )
      .then((payload) => {
        setDetailProfile(payload.student);
        setDetailStatus("idle");
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.warn(error.message);
          setDetailStatus("error");
        }
      });

    return () => controller.abort();
  }, [studentId, summaryProfile]);

  if (studentId && selected && hasStudentProfileDetail(selected))
    return (
      <CounselorStudentDetail
        student={selected}
        onBack={() => navigate("co-students-list")}
      />
    );

  if (studentId) {
    return (
      <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
        <h1 className="text-lg font-bold text-gray-800">
          Đang tải hồ sơ học sinh
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {detailStatus === "error"
            ? "Không tải được hồ sơ chi tiết từ API. Vui lòng thử lại sau."
            : `Đang lấy dữ liệu chi tiết cho ${selected?.name ?? studentId}.`}
        </p>
        <button
          onClick={() => navigate("co-students-list")}
          className="mt-5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const filtered = studentsInClass.filter((s) => {
    if (filter === "risk" && s.risk === "none") return false;

    if (filter === "incomplete" && s.testStatus === "Hoàn thành") return false;

    if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    return true;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Danh sách Học sinh 👥</h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm học sinh..."

            className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {[
          { id: "all", label: "Tất cả" },
          { id: "risk", label: "Cần hỗ trợ" },
          { id: "incomplete", label: "Chưa test" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}

            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.id ? "bg-blue-100 text-blue-700" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Học sinh",
                "Điểm TB",
                "Career Fit",
                "Test",
                "Hồ sơ",
                "Tình trạng",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="sm" />

                    <div>
                      <p className="font-semibold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400 font-mono">{s.id}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`font-mono font-bold ${s.avg >= 8 ? "text-green-600" : s.avg >= 6.5 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {s.avg.toFixed(1)}
                  </span>
                </td>

                <td className="py-3 px-4 text-xs text-gray-600">
                  {s.careerFit}
                </td>

                <td className="py-3 px-4">
                  <TestBadge status={s.testStatus} />
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 w-24">
                    <ProgressBar value={s.progress} />
                    <span className="text-xs font-mono text-gray-500">
                      {s.progress}%
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4">
                  <RiskBadge level={s.risk} />
                </td>

                <td className="py-3 px-4">
                  <button
                    onClick={() =>
                      navigate("co-students-list", { studentId: s.id })
                    }
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    Chi tiết <ArrowRight size={11} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ── Student Groups ── */

type StudentGroupRow = {
  student: StudentProfileRecord;
  exploredCareer: string;
  recommendedCareer: string;
  exploredGroup?: RiasecGroupId;
  recommendedGroup?: RiasecGroupId;
  groupId?: RiasecGroupId;
  status: "ok" | "conflict" | "missing-explore" | "missing-recommend" | "missing-both";
  error?: string;
};

type RiasecGroupId = "R" | "I" | "A" | "S" | "E" | "C";

const RIASEC_GROUPS: Array<{
  id: RiasecGroupId;
  name: string;
  label: string;
  color: string;
}> = [
  {
    id: "R",
    name: "Realistic",
    label: "Thực tế / kỹ thuật",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "I",
    name: "Investigative",
    label: "Nghiên cứu / phân tích",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "A",
    name: "Artistic",
    label: "Sáng tạo / thiết kế",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "S",
    name: "Social",
    label: "Xã hội / hỗ trợ",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "E",
    name: "Enterprising",
    label: "Kinh doanh / lãnh đạo",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "C",
    name: "Conventional",
    label: "Quy trình / dữ liệu",
    color: "from-slate-500 to-gray-600",
  },
];

const CAREER_RIASEC_MAP: Record<string, RiasecGroupId> = {
  "accountant": "C",
  "agritech specialist": "R",
  "animator": "A",
  "architect": "A",
  "bank officer": "C",
  "business analyst": "E",
  "civil servant": "C",
  "content creator": "A",
  "cybersecurity analyst": "I",
  "data analyst": "I",
  "designer": "A",
  "doctor": "S",
  "economist": "I",
  "entrepreneur": "E",
  "environmental officer": "R",
  "factory operator": "R",
  "hr specialist": "S",
  "lawyer": "E",
  "logistics operator": "R",
  "market researcher": "I",
  "mechanical engineer": "R",
  "medical technologist": "I",
  "nurse": "S",
  "operations coordinator": "C",
  "pharmacist": "I",
  "police officer": "R",
  "product manager": "E",
  "programmer": "I",
  "psychologist": "S",
  "robotics engineer": "R",
  "sales manager": "E",
  "salesperson": "E",
  "scientist": "I",
  "social worker": "S",
  "software engineer": "I",
  "sports coach": "S",
  "surgeon": "S",
  "teacher": "S",
  "ux designer": "A",
};

const normalizeCareer = (career: string) => career.trim().toLowerCase();

const firstExploredCareer = (student: StudentProfileRecord) =>
  student.exploredCareers?.find(Boolean)?.trim() ||
  student.favoriteCareer?.trim() ||
  "";

const careerToRiasecGroup = (career: string): RiasecGroupId | undefined =>
  CAREER_RIASEC_MAP[normalizeCareer(career)];

const strongestRiasecDimension = (
  vector?: Record<string, number>,
): RiasecGroupId | undefined => {
  if (!vector) return undefined;

  const strongest = Object.entries(vector)
    .filter(([key]) => RIASEC_GROUPS.some((group) => group.id === key))
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  return strongest as RiasecGroupId | undefined;
};

const studentGroupStatus = (
  exploredCareer: string,
  recommendedCareer: string,
  exploredGroup?: RiasecGroupId,
  recommendedGroup?: RiasecGroupId,
): StudentGroupRow["status"] => {
  if (!exploredCareer && !recommendedCareer) return "missing-both";
  if (!exploredCareer) return "missing-explore";
  if (!recommendedCareer) return "missing-recommend";
  return exploredGroup && recommendedGroup && exploredGroup === recommendedGroup
    ? "ok"
    : "conflict";
};

export const CounselorStudentGroups = ({
  navigate,
}: {
  navigate: (v: string, params?: { studentId?: string }) => void;
}) => {
  const { studentsInClass } = useAppData();
  const [groupStudents, setGroupStudents] =
    useState<StudentProfileRecord[]>(studentsInClass);
  const [selectedGroup, setSelectedGroup] = useState<RiasecGroupId | null>(
    null,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError("");

    fetchAppData<{ studentsInClass?: StudentProfileRecord[] }>(
      controller.signal,
    )
      .then((payload) => {
        setGroupStudents(payload.studentsInClass ?? studentsInClass);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được student groups.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [studentsInClass]);

  const rows = groupStudents.map((student) => {
    const exploredCareer =
      student.currentExploredCareer?.trim() || firstExploredCareer(student);
    const recommendedCareer = student.latestRecommendCareer?.trim() || "";
    const exploredGroup = careerToRiasecGroup(exploredCareer);
    const recommendedGroup =
      careerToRiasecGroup(recommendedCareer) ||
      strongestRiasecDimension(student.recommendHistory?.[0]?.results?.[0]?.vector) ||
      strongestRiasecDimension(student.recommendHistory?.[0]?.studentVector);

    return {
      student,
      exploredCareer,
      recommendedCareer,
      exploredGroup,
      recommendedGroup,
      groupId: exploredGroup || recommendedGroup,
      status: studentGroupStatus(
        exploredCareer,
        recommendedCareer,
        exploredGroup,
        recommendedGroup,
      ),
    } satisfies StudentGroupRow;
  });

  const groups = RIASEC_GROUPS.map((group) => {
    const items = rows.filter((row) => row.groupId === group.id);

    return {
      ...group,
      items,
      count: items.length,
      conflicts: items.filter((item) => item.status === "conflict").length,
      warnings: items.filter((item) => item.status !== "ok").length,
    };
  });
  const selectedGroupMeta = groups.find((group) => group.id === selectedGroup);
  const selectedRows = selectedGroupMeta?.items ?? [];
  const ungroupedRows = rows.filter((row) => !row.groupId);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {selectedGroupMeta
              ? `Danh sách học sinh nhóm ${selectedGroupMeta.name}`
              : "Nhóm Học sinh theo RIASEC"}
          </h1>
        </div>

        {selectedGroupMeta ? (
          <button
            onClick={() => setSelectedGroup(null)}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5"
          >
            <ArrowRight size={12} className="rotate-180" /> Quay lại 6 nhóm
          </button>
        ) : null}
      </div>

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "loading" && rows.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            Đang tải dữ liệu nhóm học sinh từ database...
          </p>
        </div>
      )}

      {!selectedGroupMeta && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className="bg-white rounded-2xl border border-gray-100 text-left shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`h-2 bg-gradient-to-r ${g.color}`} />

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white flex-shrink-0`}
                  >
                    <Briefcase size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate">
                      {g.id} - {g.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{g.label}</p>

                    <p className="text-2xl font-black text-gray-900">
                      {g.count}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        học sinh
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {g.conflicts > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      {g.conflicts} conflict
                    </span>
                  )}
                  {g.warnings > g.conflicts && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                      {g.warnings - g.conflicts} thiếu dữ liệu
                    </span>
                  )}
                </div>

                {g.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                    {g.items.slice(0, 3).map((row) => (
                      <span
                        key={row.student.id}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {row.student.name.split(" ").pop()}
                      </span>
                    ))}

                    {g.count > 3 && (
                      <span className="text-xs text-gray-400 px-1">
                        +{g.count - 3} khác
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedGroupMeta && (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">
            Danh sách học sinh nhóm {selectedGroupMeta?.name}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Học sinh",
                  "Nghề đang explore",
                  "Nghề kq recommend",
                  "Nhóm",
                  "",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {selectedRows.map((row) => {
                return (
                  <tr key={row.student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={row.student.name} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {row.student.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {row.student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {row.exploredCareer || (
                        <span className="text-gray-400">Chưa có</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <span
                        className={
                          row.status === "conflict"
                            ? "text-red-600 font-bold"
                            : ""
                        }
                      >
                        {row.recommendedCareer || (
                          <span className="text-gray-400">
                            {row.error ? "Lỗi recommend" : "Chưa có"}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">
                        {row.groupId
                          ? `${row.groupId} - ${
                              RIASEC_GROUPS.find(
                                (group) => group.id === row.groupId,
                              )?.name
                            }`
                          : "Chưa xác định"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          navigate("co-students-list", {
                            studentId: row.student.id,
                          })
                        }
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title="Xem chi tiết học sinh"
                      >
                        <UserCheck size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {selectedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-4 text-center text-sm text-gray-400"
                  >
                    Chưa có học sinh trong nhóm này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {!selectedGroupMeta && ungroupedRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-100 bg-amber-50">
            <h3 className="font-bold text-amber-800">
              Học sinh chưa phân được vào 6 nhóm
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Các học sinh này thiếu cả nghề explore và nhóm recommend hợp lệ.
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {ungroupedRows.map((row) => (
              <div
                key={row.student.id}
                className="p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={row.student.name} size="sm" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {row.student.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {row.student.id}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-100 text-amber-700">
                  Thiếu dữ liệu phân nhóm
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Families ── */

export const CounselorFamilies = () => {
  const families = [
    {
      student: "Nguyễn Minh Anh",
      parent: "Nguyễn Văn Bình",
      phone: "0901 234 567",
      email: "binh@gmail.com",
      engagement: "Cao",
      lastContact: "20/06/2025",
      notes: "Rất tích cực, quan tâm sát sao",
    },

    {
      student: "Trần Đức Huy",
      parent: "Trần Văn Minh",
      phone: "0912 345 678",
      email: "minh@gmail.com",
      engagement: "Trung bình",
      lastContact: "10/06/2025",
      notes: "Bận rộn, thường liên hệ qua email",
    },

    {
      student: "Hoàng Thị Mai",
      parent: "Hoàng Văn Sơn",
      phone: "0923 456 789",
      email: "",
      engagement: "Thấp",
      lastContact: "01/05/2025",
      notes: "Khó liên hệ, cần nhắc nhở",
    },

    {
      student: "Phạm Văn Long",
      parent: "Phạm Thị Hoa",
      phone: "0934 567 890",
      email: "hoa@gmail.com",
      engagement: "Trung bình",
      lastContact: "15/06/2025",
      notes: "Lo lắng về tình hình học tập của con",
    },
  ];

  const engCls: Record<string, string> = {
    Cao: "bg-emerald-100 text-emerald-700",
    "Trung bình": "bg-amber-100 text-amber-700",
    Thấp: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Gia đình Học sinh 👨‍👩‍👧</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {families.map((f) => (
          <div
            key={f.student}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-bold text-gray-900">{f.parent}</p>

                <p className="text-xs text-blue-600 font-semibold">
                  PH của: {f.student}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${engCls[f.engagement]}`}
              >
                {f.engagement}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-24">Điện thoại</span>
                <span className="font-mono font-medium">{f.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-24">Email</span>
                <span>{f.email || "Chưa có"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-24">Liên hệ lần cuối</span>
                <span>{f.lastContact}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 p-2.5 bg-gray-50 rounded-xl italic">
              "{f.notes}"
            </p>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors">
                📱 Nhắn tin
              </button>

              <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">
                📝 Ghi chú
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Simple feature stubs ── */

export const CounselorFeatureStub = ({
  title,
  icon,
  color,
  items,
}: {
  title: string;
  icon: string;
  color: string;
  items: { label: string; value: string; sub?: string }[];
}) => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">
      {icon} {title}
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-2xl p-5 text-white shadow-sm bg-gradient-to-br ${color}`}
        >
          <p className="text-white/70 text-xs font-semibold mb-1">
            {item.label}
          </p>

          <p className="text-2xl font-black">{item.value}</p>

          {item.sub && (
            <p className="text-white/70 text-xs mt-0.5">{item.sub}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const CounselorLessons = () => {
  const lessons = [
    {
      title: "Giới thiệu hướng nghiệp lớp 9",
      class: "9A, 9B",
      assigned: 72,
      done: 58,
      status: "active",
    },

    {
      title: "Khám phá bản thân",
      class: "Tất cả",
      assigned: 128,
      done: 91,
      status: "active",
    },

    {
      title: "Ngành nghề tương lai",
      class: "9C, 9D",
      assigned: 74,
      done: 30,
      status: "draft",
    },

    {
      title: "Kỹ năng phỏng vấn cơ bản",
      class: "Lớp 10",
      assigned: 45,
      done: 45,
      status: "done",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">📖 Bài học</h1>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
          <Plus size={14} />
          Tạo bài học
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lessons.map((l, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800">{l.title}</h3>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${l.status === "active" ? "bg-blue-100 text-blue-700" : l.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              >
                {l.status === "active"
                  ? "Đang mở"
                  : l.status === "done"
                    ? "Hoàn thành"
                    : "Nháp"}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-3">📚 Lớp: {l.class}</p>

            <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
              <span>Tiến độ hoàn thành</span>

              <span className="font-bold">
                {l.done}/{l.assigned} HS
              </span>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: `${Math.round((l.done / l.assigned) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CounselorSurveys = () => {
  const surveys = [
    {
      title: "Holland Code — Sở thích nghề nghiệp",
      respondents: 102,
      total: 128,
      avg: "I–C–R",
      status: "active",
    },

    {
      title: "MBTI — Tính cách",
      respondents: 78,
      total: 128,
      avg: "INTJ/ENFP mix",
      status: "active",
    },

    {
      title: "Kỹ năng mềm",
      respondents: 55,
      total: 128,
      avg: "73/100",
      status: "active",
    },

    {
      title: "Kỳ vọng phụ huynh",
      respondents: 90,
      total: 128,
      avg: "–",
      status: "done",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">📝 Khảo sát</h1>

        <button className="px-4 py-2 bg-pink-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-pink-700">
          <Plus size={14} />
          Tạo khảo sát
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {surveys.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>

              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.status === "active" ? "bg-pink-100 text-pink-700" : "bg-emerald-100 text-emerald-700"}`}
              >
                {s.status === "active" ? "Đang mở" : "Kết thúc"}
              </span>
            </div>

            <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
              <span>Phản hồi</span>
              <span className="font-bold">
                {s.respondents}/{s.total}
              </span>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-2 rounded-full bg-pink-400"
                style={{
                  width: `${Math.round((s.respondents / s.total) * 100)}%`,
                }}
              />
            </div>

            {s.avg !== "–" && (
              <p className="text-xs text-gray-500">
                Kết quả phổ biến:{" "}
                <span className="font-bold text-gray-700">{s.avg}</span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CounselorReportBase = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>

    {children}
  </div>
);

export const CounselorReportStudentWork = () => (
  <CounselorReportBase title="📋 Student Work">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        ["Bài nộp", "312", "Tổng cộng"],
        ["Đúng hạn", "89%", "278 bài"],
        ["Trễ hạn", "34", "11%"],
        ["Chưa nộp", "12", "Cần nhắc"],
      ].map(([l, v, s], i) => (
        <div
          key={i}
          className={`rounded-2xl p-5 text-white bg-gradient-to-br ${["from-blue-500 to-indigo-500", "from-emerald-500 to-teal-400", "from-amber-400 to-orange-500", "from-red-400 to-rose-500"][i]}`}
        >
          <p className="text-white/70 text-xs">{l}</p>
          <p className="text-3xl font-black">{v}</p>
          <p className="text-white/70 text-xs">{s}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">
        Tiến độ nộp bài theo tuần
      </h3>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={[
            { w: "T1", done: 45, late: 5 },
            { w: "T2", done: 52, late: 8 },
            { w: "T3", done: 38, late: 12 },
            { w: "T4", done: 61, late: 4 },
            { w: "T5", done: 48, late: 7 },
          ]}
          barSize={20}
        >
          <CartesianGrid
            key="g"
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />

          <XAxis
            key="x"
            dataKey="w"
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

          <Tooltip key="t" />

          <Bar
            key="done"
            dataKey="done"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Đúng hạn"
          />

          <Bar
            key="late"
            dataKey="late"
            fill="#F59E0B"
            radius={[4, 4, 0, 0]}
            name="Trễ hạn"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CounselorReportBase>
);

export const CounselorReportEngagement = () => {
  const { studentsInClass } = useAppData();

  return (
    <CounselorReportBase title="📊 Engagement">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["Đăng nhập/tuần", "4.2 lần", "Trung bình"],
          ["Thời gian/buổi", "22 phút", "Trung bình"],
          ["Tương tác bài học", "76%", "Hoàn thành video"],
          ["Điểm tham gia", "82/100", "Chỉ số Engagement"],
        ].map(([l, v, s], i) => (
          <div
            key={i}
            className={`rounded-2xl p-5 text-white bg-gradient-to-br ${["from-violet-500 to-purple-500", "from-blue-500 to-sky-400", "from-emerald-500 to-teal-400", "from-orange-500 to-amber-400"][i]}`}
          >
            <p className="text-white/70 text-xs">{l}</p>
            <p className="text-2xl font-black">{v}</p>
            <p className="text-white/70 text-xs">{s}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">
          Học sinh ít tương tác nhất
        </h3>

        <div className="space-y-2.5">
          {studentsInClass
            .filter((s) => s.progress < 90 || s.risk === "high")
            .slice(0, 8)
            .map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50 border border-red-100"
              >
                <Avatar name={s.name} size="sm" />

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Hồ sơ {s.progress}% · {s.testStatus}
                  </p>
                </div>

                <RiskBadge level={s.risk} />
              </div>
            ))}
        </div>
      </div>
    </CounselorReportBase>
  );
};

export const CounselorReportCollegePlanning = () => (
  <CounselorReportBase title="🎓 College Planning">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">
          Xu hướng trường mục tiêu
        </h3>

        <div className="space-y-2.5">
          {[
            ["ĐH Bách Khoa HCM", 28],
            ["ĐH FPT", 22],
            ["UIT", 18],
            ["RMIT Vietnam", 12],
            ["Fulbright", 8],
          ].map(([s, n]) => (
            <div key={s as string} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-36 flex-shrink-0 truncate">
                {s as string}
              </span>

              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: `${((n as number) / 28) * 100}%` }}
                />
              </div>

              <span className="text-xs font-mono font-bold text-gray-700 w-5">
                {n as number}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Phân bố ngành mục tiêu</h3>

        <div className="space-y-2.5">
          {[
            ["Công nghệ & CNTT", "42%", "#3B82F6"],
            ["Y tế", "18%", "#EF4444"],
            ["Kinh tế", "20%", "#10B981"],
            ["Thiết kế", "10%", "#8B5CF6"],
            ["Khác", "10%", "#9CA3AF"],
          ].map(([f, p, c]) => (
            <div key={f as string} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: c as string }}
              />

              <span className="text-xs text-gray-600 flex-1">
                {f as string}
              </span>

              <span className="text-xs font-bold text-gray-700">
                {p as string}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Trạng thái hồ sơ ĐH</h3>

        <div className="space-y-3">
          {[
            ["Chưa bắt đầu", 45, "bg-gray-300"],
            ["Đang chuẩn bị", 62, "bg-amber-400"],
            ["Hoàn thiện", 21, "bg-emerald-500"],
          ].map(([l, n, c]) => (
            <div key={l as string}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{l as string}</span>
                <span className="font-bold">{n as number} HS</span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full ${c as string}`}
                  style={{ width: `${((n as number) / 128) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </CounselorReportBase>
);
