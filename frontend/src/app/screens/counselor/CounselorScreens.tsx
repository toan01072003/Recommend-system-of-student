import React, { useState } from "react";
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
import { StudentRecommendationPanel } from "../../components/counselor/StudentRecommendationPanel";
import { useAppData } from "../../context/AppDataContext";
import {
  buildStudentCareerMatches,
  buildStudentSkillRadar,
  scoreTone,
} from "../../logic/recommendation";

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
  student: (typeof studentsInClass)[0];
  onBack: () => void;
}) => {
  const [tab, setTab] = useState("academic");

  const [wellbeingUnlocked, setWellbeingUnlocked] = useState(false);

  const tabs = [
    { id: "academic", label: "Academic Profile" },

    { id: "personal", label: "Personal Statement" },

    { id: "career", label: "Career Profile" },

    { id: "recommendation", label: "Gợi ý & Đánh giá" },

    { id: "wellbeing", label: "Wellbeing", locked: true },

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
                onClick={() => !t.locked && setTab(t.id)}

                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {t.label}
                {t.locked && <Lock size={11} className="opacity-60" />}
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
              label: "Mục tiêu nghề nghiệp",
              value: `Em quan tâm tới hướng ${student.favoriteCareer} và nhóm ${student.careerFit}.`,
            },

            {
              label: "Môn yêu thích",
              value: `${student.favoriteSubject}; môn ít thích hơn: ${student.leastFavoriteSubject}.`,
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
            <h3 className="font-bold text-gray-800 mb-2">Kết quả bài test</h3>

            {[
              ["MBTI", student.mbti],

              ["DISC", student.disc],

              ["Holland Code", student.riasecTop3],

              ["Career Match Top 1", student.favoriteCareer],

              ["Nhóm ngành", student.careerFit],

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
              <strong>Lộ trình gợi ý:</strong> Ưu tiên {student.favoriteSubject}{" "}
              · khám phá {student.exploredCareers.join(", ")} · mục tiêu lương{" "}
              {student.expectedSalary} triệu/tháng
            </div>
          </div>
        </div>
      )}

      {tab === "recommendation" && (
        <StudentRecommendationPanel student={student} />
      )}

      {tab === "wellbeing" && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-gray-400" />
          </div>

          <h3 className="font-bold text-gray-700 mb-2">
            Dữ liệu Wellbeing — Bảo mật
          </h3>

          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
            Thông tin sức khỏe tinh thần chỉ hiển thị với cố vấn được cấp quyền
            đặc biệt.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-5">
            <AlertTriangle size={14} /> Học sinh này cần hỗ trợ thêm
          </div>

          <div>
            {wellbeingUnlocked ? (
              <div className="space-y-3 text-left max-w-md mx-auto">
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
            ) : (
              <button
                onClick={() => setWellbeingUnlocked(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"
              >
                Xem với quyền Cố vấn
              </button>
            )}
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
          <h3 className="font-bold text-gray-800 mb-4">
            Alumni phù hợp để tham khảo
          </h3>

          <p className="text-xs text-gray-500 mb-4">
            Cựu học sinh có hành trình học tập tương tự — có thể dùng để gợi ý
            pathway
          </p>

          <div className="space-y-3">
            {[
              {
                name: "Lê Minh Đức",
                year: "K2018",
                school: "ĐH Bách Khoa HCM",
                major: "Kỹ thuật Máy tính",
                job: "Software Engineer tại VNG",
                match: 91,
              },

              {
                name: "Phạm Thị Hương",
                year: "K2019",
                school: "ĐH FPT",
                major: "Kỹ thuật Phần mềm",
                job: "Frontend Dev tại Shopee",
                match: 85,
              },

              {
                name: "Nguyễn Văn Khoa",
                year: "K2017",
                school: "UIT",
                major: "KTPM",
                job: "Data Engineer tại MoMo",
                match: 78,
              },
            ].map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors"
              >
                <Avatar name={a.name} size="sm" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-gray-800">
                      {a.name}
                    </span>

                    <span className="text-xs text-gray-400 font-mono">
                      {a.year}
                    </span>
                  </div>

                  <p className="text-xs text-blue-600 font-semibold">
                    {a.school} · {a.major}
                  </p>

                  <p className="text-xs text-gray-500">{a.job}</p>
                </div>

                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {a.match}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Students List ── */

export const CounselorStudentList = () => {
  const { studentsInClass } = useAppData();

  const [selected, setSelected] = useState<(typeof studentsInClass)[0] | null>(
    null,
  );

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  if (selected)
    return (
      <CounselorStudentDetail
        student={selected}
        onBack={() => setSelected(null)}
      />
    );

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
                    onClick={() => setSelected(s)}
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

export const CounselorStudentGroups = () => {
  const groups = [
    {
      field: "Khoa học & Công nghệ",
      color: "from-blue-500 to-indigo-500",
      emoji: "💻",
      count: 42,
      students: ["Nguyễn Minh Anh", "Bùi Minh Tuấn", "Võ Thanh Nam"],
    },

    {
      field: "Y tế & Sức khỏe",
      color: "from-red-400 to-rose-500",
      emoji: "🩺",
      count: 18,
      students: ["Hoàng Thị Mai", "Lê Thu Hương"],
    },

    {
      field: "Kinh tế & Tài chính",
      color: "from-emerald-500 to-teal-500",
      emoji: "💰",
      count: 25,
      students: ["Trần Đức Huy"],
    },

    {
      field: "Nghệ thuật & Thiết kế",
      color: "from-purple-500 to-pink-500",
      emoji: "🎨",
      count: 12,
      students: ["Đặng Lan Anh"],
    },

    {
      field: "Kỹ thuật & Cơ khí",
      color: "from-orange-500 to-amber-500",
      emoji: "⚙️",
      count: 15,
      students: [],
    },

    {
      field: "Chưa xác định",
      color: "from-gray-400 to-gray-500",
      emoji: "❓",
      count: 16,
      students: ["Phạm Văn Long"],
    },
  ];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">
        Nhóm Học sinh theo Ngành nghề 🗂️
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((g) => (
          <div
            key={g.field}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`h-2 bg-gradient-to-r ${g.color}`} />

            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl text-white flex-shrink-0`}
                >
                  {g.emoji}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{g.field}</h3>

                  <p className="text-2xl font-black text-gray-900">
                    {g.count}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      học sinh
                    </span>
                  </p>
                </div>
              </div>

              {g.students.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {g.students.slice(0, 3).map((n) => (
                    <span
                      key={n}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {n.split(" ").pop()}
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
          </div>
        ))}
      </div>
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
