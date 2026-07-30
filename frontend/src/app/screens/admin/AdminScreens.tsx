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
import {
  hasStudentProfileDetail,
  resolveStudentProfile,
  type StudentProfileRecord,
} from "../../logic/studentProfile";
import { fetchStudent } from "../../api/client";
import { useLanguage } from "../../i18n";

// ── Screen 2: School Overview ────────────────────────────────────────────────
export const SchoolOverview = ({
  navigate,
}: {
  navigate: (v: string) => void;
}) => {
  const { language, t } = useLanguage();
  const { gradeData, heatmapData } = useAppData();
  const totalStudents = gradeData.reduce((sum, item) => sum + item.students, 0);
  const totalTests = gradeData.reduce((sum, item) => sum + item.tests, 0);
  const averageCompletion = gradeData.length
    ? Math.round(
        gradeData.reduce((sum, item) => sum + item.completion, 0) /
          gradeData.length,
      )
    : 0;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t("Tổng quan toàn trường")}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {t("THCS & THPT Nguyễn Du")} · {t("Năm học 2024–2025")}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng học sinh"
          value={`${totalStudents}`}
          sub={
            language === "en"
              ? `${gradeData.length} grade groups`
              : `${gradeData.length} khối lớp`
          }
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Hồ sơ hoàn thành"
          value={`${averageCompletion}%`}
          sub="Từ database SQLite"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Cần tư vấn"
          value={`${heatmapData.flatMap((row) => row.vals).filter((value) => value > 0 && value < 90).length}`}
          sub="Lớp cần theo dõi"
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Bài test hoàn thành"
          value={`${totalTests}`}
          sub={
            language === "en"
              ? `${totalTests} / ${totalStudents} students`
              : `${totalTests} / ${totalStudents} HS`
          }
          icon={FileText}
          color="navy"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            {t("Tỷ lệ hoàn thành hồ sơ theo khối")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeData} barSize={28}>
              <CartesianGrid
                key="grid"
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                key="xaxis"
                dataKey="grade"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                key="yaxis"
                tick={{ fontSize: 11, fontFamily: "DM Mono" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                unit="%"
              />
              <Tooltip
                key="tooltip"
                formatter={(v: number) => [`${v}%`, t("Hoàn thành")]}
                cursor={{ fill: "#f0f4f8" }}
              />
              <Bar
                key="bar-completion"
                dataKey="completion"
                fill="#EA580C"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            {t("Học sinh theo khối")}
          </h3>
          <div className="space-y-3">
            {gradeData.map((g) => (
              <div key={g.grade} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-12 flex-shrink-0">
                  {g.grade}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-[#0F766E]"
                    style={{
                      width: `${(g.students / Math.max(...gradeData.map((item) => item.students), 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-gray-700 w-8 text-right">
                  {g.students}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("Heatmap hoàn thành hồ sơ theo lớp")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium pb-3 pr-4 w-16">
                  {t("Khối")}
                </th>
                {["A", "B", "C", "D", "E", "F", "G", "H"].map((c) => (
                  <th
                    key={c}
                    className="text-center pb-3 w-12 text-gray-400 font-medium"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.grade}>
                  <td className="text-gray-600 font-semibold pr-4 py-1 text-xs">
                    {row.grade}
                  </td>
                  {row.vals.map((v, i) => {
                    const bg =
                      v >= 85
                        ? "bg-emerald-500"
                        : v >= 70
                          ? "bg-amber-400"
                          : v >= 55
                            ? "bg-orange-400"
                            : "bg-red-500";
                    return (
                      <td key={i} className="text-center py-1">
                        <div
                          className={`inline-flex items-center justify-center w-9 h-6 rounded text-white font-mono font-bold cursor-pointer hover:opacity-75 transition-opacity ${bg}`}
                          style={{ fontSize: 9 }}
                        >
                          {v}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            {[
              ["bg-emerald-500", "≥85%"],
              ["bg-amber-400", "70–84%"],
              ["bg-orange-400", "55–69%"],
              ["bg-red-500", "<55%"],
            ].map(([cls, lbl]) => (
              <div key={lbl} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${cls}`} />
                <span>{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("Cảnh báo cần xử lý")}
        </h3>
        <div className="space-y-2.5">
          {[
            {
              level: "high",
              msg: "Lớp 9E có tỷ lệ hoàn thành thấp nhất: 55%",
              action: "Xem lớp",
            },
            {
              level: "high",
              msg: "12 học sinh lớp 6 chưa có dữ liệu học tập năm nay",
              action: "Nhập liệu",
            },
            {
              level: "medium",
              msg: "34 học sinh khối 7–8 chưa làm bài test hướng nghiệp",
              action: "Nhắc nhở",
            },
            {
              level: "low",
              msg: "Lớp 10C cần cập nhật nhận xét học kỳ 1",
              action: "Cập nhật",
            },
          ].map((a, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-xl ${
                a.level === "high"
                  ? "bg-red-50 border border-red-100"
                  : a.level === "medium"
                    ? "bg-amber-50 border border-amber-100"
                    : "bg-blue-50 border border-blue-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle
                  size={14}
                  className={
                    a.level === "high"
                      ? "text-red-500"
                      : a.level === "medium"
                        ? "text-amber-500"
                        : "text-blue-500"
                  }
                />
                <span className="text-sm text-gray-700">{t(a.msg)}</span>
              </div>
              <button className="text-xs font-semibold text-orange-600 hover:text-orange-800 whitespace-nowrap ml-4 flex items-center gap-0.5">
                {t(a.action)} <ArrowRight size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Screen 3: Grade Dashboard ────────────────────────────────────────────────
export const GradeDashboard = ({
  navigate,
}: {
  navigate: (v: string, params?: { className?: string }) => void;
}) => {
  const { language, t } = useLanguage();
  const { gradeData, classesData, studentsInClass, careerInterestDist } =
    useAppData();
  const [selectedGrade, setSelectedGrade] = useState("9");
  const selectedGradeClasses = classesData.filter(
    (cls) => String(cls.grade) === selectedGrade,
  );
  const selectedGradeStudents = studentsInClass.filter(
    (student) => String(student.grade) === selectedGrade,
  );
  const selectedCareerMax = Math.max(
    ...careerInterestDist.map((item) => item.value),
    1,
  );
  const selectedCareerTop = careerInterestDist[0] ?? {
    name: t("Chưa có"),
    value: 0,
  };
  const selectedCompletion = selectedGradeStudents.length
    ? Math.round(
        selectedGradeStudents.reduce(
          (sum, student) => sum + student.progress,
          0,
        ) / selectedGradeStudents.length,
      )
    : 0;
  const selectedAvg = selectedGradeStudents.length
    ? (
        selectedGradeStudents.reduce((sum, student) => sum + student.avg, 0) /
        selectedGradeStudents.length
      ).toFixed(1)
    : "0.0";
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("Dashboard Khối")} {selectedGrade}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("Năm học 2024–2025")}</p>
        </div>
        <div className="flex gap-1.5">
          {gradeData
            .map((item) => item.grade.replace("Lớp ", ""))
            .map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  selectedGrade === g
                    ? "bg-[#EA580C] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {g}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Số lớp"
          value={`${selectedGradeClasses.length}`}
          sub={language === "en" ? `Grade ${selectedGrade}` : `Khối ${selectedGrade}`}
          icon={LayoutDashboard}
          color="blue"
        />
        <StatCard
          title="Tổng học sinh"
          value={`${selectedGradeStudents.length}`}
          sub="Dữ liệu synthetic"
          icon={Users}
          color="navy"
        />
        <StatCard
          title="Hoàn thành hồ sơ"
          value={`${selectedCompletion}%`}
          sub={language === "en" ? `Average ${selectedAvg}` : `Điểm TB ${selectedAvg}`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Nhóm ngành top 1"
          value={selectedCareerTop.name}
          sub={
            language === "en"
              ? `${selectedCareerTop.value} interested students`
              : `${selectedCareerTop.value} HS quan tâm`
          }
          icon={Star}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            {t("Phân bố nhóm ngành quan tâm")}
          </h3>
          <div className="space-y-3.5">
            {careerInterestDist.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 w-32 flex-shrink-0">
                  {item.name}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${(item.value / selectedCareerMax) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
                <span className="text-sm font-mono font-semibold text-gray-700 w-7 text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            {t("Danh sách lớp")} — {t("Khối")} {selectedGrade}
          </h3>
          <div className="space-y-2">
            {selectedGradeClasses.map((cls) => (
              <button
                key={cls.name}
                onClick={() =>
                  navigate("class-dashboard", { className: cls.name })
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {cls.name}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">
                      {t("Lớp")} {cls.name}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {language === "en" ? `${cls.students} students` : `${cls.students} HS`}
                    </span>
                  </div>
                  <ProgressBar value={cls.completion} />
                </div>
                <div className="text-right flex-shrink-0 w-12">
                  <span
                    className={`text-sm font-mono font-bold ${cls.completion >= 80 ? "text-green-600" : cls.completion >= 60 ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {cls.completion}%
                  </span>
                  {cls.risk > 0 && (
                    <div className="text-xs text-red-500">
                      {language === "en" ? `${cls.risk} need support` : `${cls.risk} cần HT`}
                    </div>
                  )}
                </div>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-gray-500 flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 4: Class Dashboard ────────────────────────────────────────────────
export const ClassDashboard = ({
  className = "9A",
  navigate,
}: {
  className?: string;
  navigate: (
    v: string,
    params?: { className?: string; studentId?: string },
  ) => void;
}) => {
  const { language, t } = useLanguage();
  const { studentsInClass } = useAppData();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const activeClassName = className;
  const classStudents = studentsInClass.filter(
    (student) => student.className === activeClassName,
  );
  const classCompletion = classStudents.length
    ? Math.round(
        classStudents.reduce((sum, student) => sum + student.progress, 0) /
          classStudents.length,
      )
    : 0;
  const classAvg = classStudents.length
    ? (
        classStudents.reduce((sum, student) => sum + student.avg, 0) /
        classStudents.length
      ).toFixed(1)
    : "0.0";
  const classRiskCount = classStudents.filter(
    (student) => student.risk === "medium" || student.risk === "high",
  ).length;
  const completedTests = classStudents.filter(
    (student) => student.testStatus === "Hoàn thành",
  ).length;

  const filtered = classStudents.filter((s) => {
    if (filter === "risk" && s.risk === "none") return false;
    if (filter === "incomplete" && s.testStatus === "Hoàn thành") return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("Lớp")} {activeClassName}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("Dữ liệu synthetic từ Excel")} ·{" "}
            {language === "en"
              ? `${classStudents.length} students`
              : `${classStudents.length} học sinh`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("teacher-entry")}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus size={14} /> {t("Nhập dữ liệu")}
          </button>
          <button className="px-4 py-2 bg-[#EA580C] text-white rounded-xl text-sm font-semibold hover:bg-[#C2410C] flex items-center gap-2">
            <MessageSquare size={14} /> {t("Tạo lịch tư vấn")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Hoàn thành hồ sơ"
          value={`${classCompletion}%`}
          sub={
            language === "en"
              ? `${classStudents.length} students`
              : `${classStudents.length} học sinh`
          }
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Test hướng nghiệp"
          value={`${completedTests}`}
          sub={
            language === "en"
              ? `${completedTests} / ${classStudents.length} students`
              : `${completedTests} / ${classStudents.length} HS`
          }
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Điểm TB lớp"
          value={classAvg}
          sub="HK1 · 2025–2026"
          icon={BarChart2}
          color="navy"
        />
        <StatCard
          title="Cần hỗ trợ"
          value={`${classRiskCount} HS`}
          sub="Mức medium/high"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("Tìm kiếm học sinh...")}
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.id
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t("Học sinh")}
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t("Điểm TB")}
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  {t("Nhóm ngành")}
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Test
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                  {t("Hồ sơ")}
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t("Tình trạng")}
                </th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {s.name}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {s.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold text-sm ${s.avg >= 8 ? "text-green-600" : s.avg >= 6.5 ? "text-orange-600" : "text-red-600"}`}
                    >
                      {s.avg.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-600 text-xs">{s.careerFit}</span>
                  </td>
                  <td className="py-3 px-4">
                    <TestBadge status={s.testStatus} />
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 w-28">
                      <ProgressBar value={s.progress} />
                      <span className="text-xs text-gray-500 font-mono w-8">
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
                        navigate("student-profile", {
                          className: activeClassName,
                          studentId: s.id,
                        })
                      }
                      className="text-xs font-semibold text-orange-600 hover:text-orange-800 whitespace-nowrap flex items-center gap-0.5"
                    >
                      {t("Xem hồ sơ")} <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ── Screen 5: Student 360 Profile ────────────────────────────────────────────
export const StudentProfile = ({ studentId }: { studentId?: string }) => {
  const { t } = useLanguage();
  const { studentsInClass } = useAppData();
  const [activeTab, setActiveTab] = useState("academic");
  const [wellbeingRequested, setWellbeingRequested] = useState(false);
  const summaryProfile = resolveStudentProfile(studentsInClass, studentId);
  const profileId = studentId ?? summaryProfile?.id;
  const [detailProfile, setDetailProfile] =
    useState<StudentProfileRecord | null>(null);
  const [detailStatus, setDetailStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const profile = detailProfile ?? summaryProfile;

  useEffect(() => {
    setDetailProfile(null);
    setDetailStatus("idle");

    if (!profileId) return;
    if (
      summaryProfile?.id === profileId &&
      hasStudentProfileDetail(summaryProfile)
    ) {
      return;
    }

    const controller = new AbortController();

    setDetailStatus("loading");
    fetchStudent<{ student: StudentProfileRecord }>(
      profileId,
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
  }, [profileId, summaryProfile]);

  const tabs = [
    { id: "academic", label: "Học tập" },
    { id: "personal", label: "Cá nhân" },
    { id: "career", label: "Hướng nghiệp" },
    { id: "wellbeing", label: "Wellbeing", locked: true },
    { id: "parent-exp", label: "Phụ huynh" },
    { id: "counseling", label: "Tư vấn" },
  ];

  if (!profile) {
    return (
      <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
        <h1 className="text-lg font-bold text-gray-800">
          {t("Không tìm thấy học sinh")}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {t("Vui lòng quay lại danh sách lớp và chọn lại hồ sơ cần xem.")}
        </p>
      </div>
    );
  }

  if (!hasStudentProfileDetail(profile)) {
    return (
      <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
        <h1 className="text-lg font-bold text-gray-800">
          {t("Đang tải hồ sơ chi tiết")}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {detailStatus === "error"
            ? t("Không tải được dữ liệu chi tiết từ API. Vui lòng thử lại sau.")
            : `${t("Đang lấy dữ liệu đầy đủ cho")} ${profile.name}.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <Avatar name={profile.name} size="lg" />
            <div className="flex-1 min-w-48">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {t("Lớp")} {profile.className} · {t("Mã HS")}:{" "}
                    <span className="font-mono">{profile.id}</span> ·{" "}
                    {profile.typeClass}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 whitespace-nowrap">
                  ✓ {t("Hồ sơ")} {profile.progress}%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {[
                  {
                    label: "Học lực",
                    value:
                      profile.avg >= 8
                        ? "Giỏi"
                        : profile.avg >= 6.5
                          ? "Khá"
                          : "Trung bình",
                    cls: "text-green-600",
                  },
                  {
                    label: "Sở thích chính",
                    value: profile.favoriteSubject,
                    cls: "text-orange-600",
                  },
                  {
                    label: "Ngành phù hợp",
                    value: profile.favoriteCareer,
                    cls: "text-indigo-600",
                  },
                  {
                    label: "RIASEC",
                    value: profile.riasecTop3,
                    cls: "text-gray-700",
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{t(item.label)}</p>
                    <p className={`text-sm font-bold mt-0.5 ${item.cls}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 border-t border-gray-100">
          <div className="flex gap-0 overflow-x-auto -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } ${tab.locked ? "cursor-default" : ""}`}
              >
                {t(tab.label)}
                {tab.locked && <Lock size={11} className="opacity-60" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Academic tab */}
      {activeTab === "academic" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Xu hướng học tập")}
            </h3>
            <ResponsiveContainer width="100%" height={195}>
              <LineChart data={profile.academicTrend}>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  key="xaxis"
                  dataKey="term"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  key="yaxis"
                  tick={{ fontSize: 11, fontFamily: "DM Mono" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[6, 10]}
                />
                <Tooltip key="tooltip" />
                <Line
                  key="line-score"
                  type="monotone"
                  dataKey="score"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#EA580C", strokeWidth: 0 }}
                  name={t("Điểm TB")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Điểm số theo môn")}
            </h3>
            <div className="space-y-3">
              {profile.scores.map((s) => (
                <div key={s.subject} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20 flex-shrink-0">
                    {s.subject}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={
                        scoreTone(s.score) === "strong"
                          ? "h-2 rounded-full bg-green-500"
                          : scoreTone(s.score) === "weak"
                            ? "h-2 rounded-full bg-red-400"
                            : "h-2 rounded-full bg-blue-400"
                      }
                      style={{ width: `${(s.score / 10) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-mono font-bold w-8 text-right ${scoreTone(s.score) === "strong" ? "text-green-600" : scoreTone(s.score) === "weak" ? "text-red-500" : "text-orange-600"}`}
                  >
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <strong>{t("Thành tích")}:</strong> {profile.achievements} ·{" "}
              {profile.awards} · {profile.certificates}
            </div>
          </div>
        </div>
      )}

      {/* Career tab */}
      {activeTab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Bản đồ kỹ năng & Sở thích")}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={buildStudentSkillRadar(profile, t)}>
                <PolarGrid key="polar-grid" stroke="#e5e7eb" />
                <PolarAngleAxis
                  key="polar-angle"
                  dataKey="skill"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />
                <PolarRadiusAxis
                  key="polar-radius"
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  key="radar-score"
                  name={t("Điểm")}
                  dataKey="score"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Độ phù hợp nghề nghiệp")}
            </h3>
            <div className="space-y-3.5">
              {buildStudentCareerMatches(profile).map((c, i) => (
                <div key={c.career} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 w-4 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 flex-1">
                    {c.career}
                  </span>
                  <div className="w-24 bg-gray-100 rounded-full h-2 flex-shrink-0">
                    <div
                      className="h-2 rounded-full bg-[#0F766E]"
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold font-mono text-indigo-700 w-10 text-right">
                    {c.score}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700">
              <strong>{t("Lộ trình gợi ý")}:</strong>{" "}
              {t("Tập trung Toán–Lý–Tin · Tham gia CLB Robotics · Học Python cơ bản")}
            </div>
          </div>
        </div>
      )}

      {/* Wellbeing tab */}
      {activeTab === "wellbeing" && (
        <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-700 mb-2">
            {t("Dữ liệu Wellbeing — Bảo mật cao")}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
            {t("Thông tin sức khỏe tinh thần và cảm xúc chỉ hiển thị với người có quyền truy cập đặc biệt được phê duyệt.")}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-5">
            <AlertTriangle size={14} /> {t("Lưu ý: Học sinh này cần được cố vấn hỗ trợ thêm")}
          </div>
          <div>
            {wellbeingRequested ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
                <CheckCircle size={14} /> {t("Yêu cầu đã gửi — chờ phê duyệt")}
              </div>
            ) : (
              <button
                onClick={() => setWellbeingRequested(true)}
                className="px-5 py-2.5 bg-[#EA580C] text-white rounded-xl text-sm font-semibold hover:bg-[#C2410C]"
              >
                {t("Yêu cầu quyền truy cập")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Counseling tab */}
      {activeTab === "counseling" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Timeline tư vấn")}
            </h3>
            <div className="space-y-4">
              {[
                {
                  date: "15/01/2025",
                  title: "Tư vấn định hướng khối 9",
                  done: true,
                  note: "HS quan tâm CNTT, cần test thêm",
                },
                {
                  date: "20/02/2025",
                  title: "Review kết quả career test",
                  done: true,
                  note: "Kết quả: KH & CN phù hợp 92%",
                },
                {
                  date: "15/03/2025",
                  title: "Lập kế hoạch thi ĐH",
                  done: false,
                  note: "",
                },
                {
                  date: "20/04/2025",
                  title: "Gặp phụ huynh — định hướng cuối cấp",
                  done: false,
                  note: "",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? "bg-green-100" : "bg-gray-100"}`}
                  >
                    {item.done ? (
                      <CheckCircle size={14} className="text-green-600" />
                    ) : (
                      <Clock size={14} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-mono">
                      {item.date}
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {t(item.title)}
                    </p>
                    {item.note && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t(item.note)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Việc cần làm tiếp theo")}
            </h3>
            <div className="space-y-2">
              {[
                {
                  task: "Hoàn thành bài test MBTI",
                  priority: "Gấp",
                  done: false,
                },
                {
                  task: "Nộp hồ sơ thi học sinh giỏi Toán",
                  priority: "Trung bình",
                  done: true,
                },
                {
                  task: "Tham gia buổi hướng nghiệp CLB IT",
                  priority: "Trung bình",
                  done: false,
                },
                {
                  task: "Cập nhật mục tiêu nghề nghiệp",
                  priority: "Bình thường",
                  done: false,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${item.done ? "opacity-50" : "hover:bg-gray-50"}`}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.done ? "border-green-500 bg-green-500" : "border-gray-300"}`}
                  >
                    {item.done && (
                      <CheckCircle size={10} className="text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm flex-1 ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}
                  >
                    {t(item.task)}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      item.priority === "Gấp"
                        ? "bg-red-100 text-red-600"
                        : item.priority === "Trung bình"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {t(item.priority)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab === "personal" || activeTab === "parent-exp") && (
        <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-sm">
            {t("Nội dung tab")}{" "}
            <strong className="text-gray-600">
              {t(tabs.find((tab) => tab.id === activeTab)?.label ?? "")}
            </strong>{" "}
            {t("đang được cập nhật bởi học sinh và phụ huynh.")}
          </p>
        </div>
      )}
    </div>
  );
};

// ── Screen 10: Data Quality (Admin) ─────────────────────────────────────────
export const DataQuality = () => {
  const { t } = useLanguage();
  const permTable = [
    {
      type: "Academic Profile",
      sensitive: false,
      admin: true,
      counselor: true,
      teacher: true,
      parent: true,
      student: true,
    },
    {
      type: "Personal Statement",
      sensitive: false,
      admin: true,
      counselor: true,
      teacher: true,
      parent: false,
      student: true,
    },
    {
      type: "Career Profile",
      sensitive: false,
      admin: true,
      counselor: true,
      teacher: true,
      parent: true,
      student: true,
    },
    {
      type: "Wellbeing Profile",
      sensitive: true,
      admin: true,
      counselor: true,
      teacher: false,
      parent: false,
      student: false,
    },
    {
      type: "Parent Expectation",
      sensitive: false,
      admin: true,
      counselor: true,
      teacher: false,
      parent: true,
      student: false,
    },
    {
      type: "Alumni Data",
      sensitive: false,
      admin: true,
      counselor: true,
      teacher: true,
      parent: false,
      student: true,
    },
  ];
  const check = (val: boolean) =>
    val ? (
      <span className="text-green-600 font-bold text-base">✓</span>
    ) : (
      <span className="text-gray-200 text-base">—</span>
    );
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t("Chất lượng & Bảo mật Dữ liệu")}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {t("Dành cho Quản trị viên")} · {t("Cập nhật")}: 25/06/2025 08:32
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dữ liệu thiếu"
          value="234"
          sub="Trường bắt buộc"
          icon={AlertTriangle}
          color="yellow"
        />
        <StatCard
          title="Dữ liệu trùng"
          value="12"
          sub="Cần xem xét"
          icon={Database}
          color="red"
        />
        <StatCard
          title="Log thao tác (7 ngày)"
          value="1,482"
          sub="Hoạt động ghi nhận"
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Dữ liệu nhạy cảm"
          value={t("Bảo mật")}
          sub="Wellbeing — 2 lớp xác thực"
          icon={Lock}
          color="navy"
        />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("Phân quyền truy cập dữ liệu")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 rounded-lg">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide rounded-l-lg">
                  {t("Loại dữ liệu")}
                </th>
                {["Admin", "Cố vấn", "GV", "Phụ huynh", "Học sinh"].map((h) => (
                  <th
                    key={h}
                    className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {t(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {permTable.map((row) => (
                <tr key={row.type} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium text-sm">
                        {row.type}
                      </span>
                      {row.sensitive && (
                        <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-semibold">
                          <Lock size={9} /> {t("Nhạy cảm")}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">{check(row.admin)}</td>
                  <td className="py-3 px-3 text-center">
                    {check(row.counselor)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {check(row.teacher)}
                  </td>
                  <td className="py-3 px-3 text-center">{check(row.parent)}</td>
                  <td className="py-3 px-3 text-center">
                    {check(row.student)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("Nhật ký hoạt động gần đây")}
        </h3>
        <div className="space-y-1.5">
          {[
            {
              time: "08:31",
              user: "GV Trần Thị Lan",
              action: "Cập nhật điểm HK1 lớp 9A",
              type: "edit",
            },
            {
              time: "08:15",
              user: "Admin Hệ thống",
              action: "Import Excel lớp 10 — phát hiện 3 lỗi dữ liệu",
              type: "error",
            },
            {
              time: "07:55",
              user: "CV Nguyễn Văn Minh",
              action: "Xem hồ sơ Wellbeing HS001 (quyền đã cấp)",
              type: "sensitive",
            },
            {
              time: "07:30",
              user: "GV Lê Hoàng Nam",
              action: "Nhập nhận xét 35 học sinh lớp 11C",
              type: "edit",
            },
            {
              time: "Hôm qua",
              user: "PH Nguyễn Văn Bình",
              action: "Cập nhật kỳ vọng gia đình học sinh HS001",
              type: "edit",
            },
          ].map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50"
            >
              <span className="text-xs text-gray-400 font-mono w-16 flex-shrink-0">
                {t(log.time)}
              </span>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${log.type === "error" ? "bg-red-500" : log.type === "sensitive" ? "bg-amber-400" : "bg-green-400"}`}
              />
              <span className="text-blue-700 font-semibold text-sm flex-shrink-0">
                {log.user}
              </span>
              <span className="text-gray-600 text-sm min-w-0 truncate">
                {t(log.action)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
