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
import { StudentRecommendationPanel } from "../../../components/counselor/StudentRecommendationPanel";
import { useAppData } from "../../../context/AppDataContext";
import {
  buildStudentCareerMatches,
  buildStudentSkillRadar,
  scoreTone,
} from "../../../logic/recommendation";

export const StudentPersonalInfo = () => {
  const [tab, setTab] = useState<"info" | "academic">("info");
  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 1]);
  const [saved, setSaved] = useState(false);
  const yearData = ACADEMIC_HISTORY[selectedYear];

  // GPA trend for chart
  const gpaData = YEARS.map((y) => {
    const d = ACADEMIC_HISTORY[y];
    return {
      year: y.split(" ")[0],
      hk1: parseFloat(avg(d.hk1)),
      hk2: parseFloat(avg(d.hk2)),
    };
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Thông tin cá nhân 👤</h1>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {[
          { id: "info", label: "👤 Hồ sơ cá nhân" },
          { id: "academic", label: "📊 Lịch sử điểm số" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Personal Info Tab ── */}
      {tab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Avatar + bio */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
              <div className="relative">
                <Avatar name="Nguyễn Minh Anh" size="lg" />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors">
                  <Edit2 size={11} />
                </button>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base">
                  Nguyễn Minh Anh
                </h2>
                <p className="text-sm text-gray-500">Lớp 9A · HS001</p>
                <p className="text-xs text-orange-600 font-semibold mt-1">
                  THCS Nguyễn Du
                </p>
              </div>
              <div className="w-full pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Năm học", value: "9" },
                  { label: "ĐTB", value: "8.5" },
                  { label: "Xếp loại", value: "Giỏi" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-sm font-black text-orange-600">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                🏆 Thành tích nổi bật
              </h3>
              <div className="space-y-2">
                {[
                  { icon: "🥈", text: "Giải Nhì Toán cấp Quận 2024" },
                  { icon: "⭐", text: "Học sinh Giỏi 4 năm liên tiếp" },
                  { icon: "🤖", text: "CLB Robotics — Thành viên tích cực" },
                  { icon: "📜", text: "Chứng chỉ Scratch — Code.org" },
                ].map((a) => (
                  <div
                    key={a.text}
                    className="flex items-start gap-2.5 text-xs text-gray-600"
                  >
                    <span className="text-base flex-shrink-0">{a.icon}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-3">
                Thông tin cơ bản
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: "Họ và tên",
                    value: "Nguyễn Minh Anh",
                    type: "text",
                  },
                  { label: "Ngày sinh", value: "15/03/2010", type: "text" },
                  { label: "Giới tính", value: "Nữ", type: "text" },
                  { label: "Lớp hiện tại", value: "9A", type: "text" },
                  {
                    label: "Email học sinh",
                    value: "minhanh@truong.edu.vn",
                    type: "email",
                  },
                  {
                    label: "Số điện thoại",
                    value: "",
                    type: "tel",
                    placeholder: "Chưa cập nhật",
                  },
                  {
                    label: "Địa chỉ",
                    value: "Q.Bình Thạnh, TP.HCM",
                    type: "text",
                  },
                  { label: "Dân tộc", value: "Kinh", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      defaultValue={f.value}
                      placeholder={f.placeholder}
                      onChange={() => setSaved(false)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-3">
                Định hướng & Mục tiêu
              </h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Giới thiệu bản thân
                </label>
                <textarea
                  rows={3}
                  defaultValue="Mình thích lập trình và giải toán. Mơ ước trở thành kỹ sư phần mềm tại Việt Nam."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Nghề nghiệp mơ ước
                </label>
                <input
                  defaultValue="Kỹ sư Phần mềm / Nhà khoa học Dữ liệu"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Trường ĐH mục tiêu
                </label>
                <input
                  defaultValue="ĐH Bách Khoa HCM / ĐH FPT / UIT"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <button
              onClick={() => setSaved(true)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save size={15} /> Lưu thay đổi
              {saved && (
                <span className="text-white/80 text-xs font-normal">
                  (Đã lưu ✓)
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── Academic History Tab ── */}
      {tab === "academic" && (
        <div className="space-y-5">
          {/* GPA trend chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">
              📈 Xu hướng điểm trung bình qua các năm
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gpaData}>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  key="x"
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  key="y"
                  tick={{ fontSize: 11, fontFamily: "DM Mono" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[6, 10]}
                />
                <Tooltip
                  key="tip"
                  formatter={(v: number) => [v.toFixed(2), ""]}
                />
                <Line
                  key="hk1"
                  type="monotone"
                  dataKey="hk1"
                  stroke="#F97316"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#F97316", strokeWidth: 0 }}
                  name="HK1"
                />
                <Line
                  key="hk2"
                  type="monotone"
                  dataKey="hk2"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }}
                  name="HK2"
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-5 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-4 h-0.5 bg-orange-500 rounded" />
                Học kỳ 1
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div
                  className="w-4 h-0.5 bg-violet-500 rounded"
                  style={{ borderTop: "2px dashed #8B5CF6" }}
                />
                Học kỳ 2
              </div>
            </div>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-gray-700">Năm học:</span>
            <div className="flex gap-2 flex-wrap">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedYear === y ? "border-orange-500 bg-orange-500 text-white shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}
                >
                  {y.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Selected year detail */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* HK scores - left */}
            <div className="lg:col-span-3 space-y-4">
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "ĐTB Học kỳ 1",
                    value: avg(yearData.hk1),
                    color: "from-orange-500 to-amber-400",
                  },
                  {
                    label: "ĐTB Học kỳ 2",
                    value: avg(yearData.hk2),
                    color: "from-violet-500 to-indigo-500",
                  },
                  {
                    label: "ĐTB Cả năm",
                    value: (
                      (parseFloat(avg(yearData.hk1)) +
                        parseFloat(avg(yearData.hk2))) /
                      2
                    ).toFixed(2),
                    color: "from-emerald-500 to-teal-400",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl p-4 bg-gradient-to-br ${s.color} text-white text-center shadow-sm`}
                  >
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs text-white/80 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Conduct & Title */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Danh hiệu
                    </p>
                    <p className="text-sm font-black text-orange-600">
                      {yearData.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      Hạnh kiểm
                    </p>
                    <p className="text-sm font-black text-emerald-600">
                      {yearData.conduct}
                    </p>
                  </div>
                </div>
              </div>

              {/* HK1 scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Học kỳ 1</h3>
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                    ĐTB {avg(yearData.hk1)}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub, i) => (
                    <ScoreBar key={sub} score={yearData.hk1[i]} subject={sub} />
                  ))}
                </div>
              </div>

              {/* HK2 scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Học kỳ 2</h3>
                  <span className="text-xs font-black text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
                    ĐTB {avg(yearData.hk2)}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub, i) => (
                    <ScoreBar key={sub} score={yearData.hk2[i]} subject={sub} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: comparison table */}
            <div className="lg:col-span-2 space-y-4">
              {/* Subject comparison */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">
                    So sánh HK1 vs HK2
                  </h3>
                </div>
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">
                        Môn
                      </th>
                      <th className="text-center px-3 py-2.5 text-orange-600 font-semibold">
                        HK1
                      </th>
                      <th className="text-center px-3 py-2.5 text-violet-600 font-semibold">
                        HK2
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-semibold">
                        ±
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SUBJECTS.map((sub, i) => {
                      const diff = yearData.hk2[i] - yearData.hk1[i];
                      return (
                        <tr key={sub} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-700">
                            {sub}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-orange-600">
                            {yearData.hk1[i].toFixed(1)}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-violet-600">
                            {yearData.hk2[i].toFixed(1)}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className={`font-bold font-mono ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}
                            >
                              {diff > 0
                                ? `+${diff.toFixed(1)}`
                                : diff === 0
                                  ? "–"
                                  : diff.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Strong / weak subjects */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm">
                  Phân tích môn học
                </h3>
                <div>
                  <p className="text-xs font-bold text-emerald-600 mb-2">
                    💪 Môn mạnh (≥ 8.5)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter(
                      (_, i) => (yearData.hk1[i] + yearData.hk2[i]) / 2 >= 8.5,
                    ).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 mb-2">
                    📈 Cần cải thiện (&lt; 7.5)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter(
                      (_, i) => (yearData.hk1[i] + yearData.hk2[i]) / 2 < 7.5,
                    ).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const StudentPortfolio = () => {
  const items = [
    {
      emoji: "🏆",
      title: "Giải Nhì Toán cấp Quận 2024",
      type: "Giải thưởng",
      date: "11/2024",
    },
    {
      emoji: "🤖",
      title: "Dự án Robot tránh vật cản — CLB Robotics",
      type: "Dự án",
      date: "03/2025",
    },
    {
      emoji: "💻",
      title: "App quản lý chi tiêu cá nhân (Python)",
      type: "Dự án cá nhân",
      date: "05/2025",
    },
    {
      emoji: "📜",
      title: "Chứng chỉ Scratch cơ bản — Code.org",
      type: "Chứng chỉ",
      date: "01/2025",
    },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Portfolio 🗂️</h1>
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold flex items-center gap-1.5">
          <Plus size={14} /> Thêm mới
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 shadow-sm transition-all"
          >
            <span className="text-3xl block mb-3">{item.emoji}</span>
            <h3 className="font-bold text-gray-800 text-sm mb-1">
              {item.title}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                {item.type}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {item.date}
              </span>
            </div>
          </div>
        ))}
        <button className="bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-orange-500 cursor-pointer">
          <Plus size={24} />
          <span className="text-sm font-semibold">Thêm mục mới</span>
        </button>
      </div>
    </div>
  );
};

export const StudentResume = () => (
  <div className="space-y-5 max-w-2xl mx-auto">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">CV / Resume 📄</h1>
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold">
        Xuất PDF
      </button>
    </div>
    <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-400" />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name="Nguyễn Minh Anh" size="lg" />
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Nguyễn Minh Anh
            </h2>
            <p className="text-sm text-gray-500">
              Học sinh lớp 9A · THCS Nguyễn Du
            </p>
            <p className="text-xs text-orange-600 font-semibold mt-0.5">
              Định hướng: Kỹ thuật phần mềm
            </p>
          </div>
        </div>
        {[
          {
            title: "🎯 Mục tiêu",
            content:
              "Phát triển kỹ năng lập trình và công nghệ để trở thành kỹ sư phần mềm tại công ty công nghệ hàng đầu Việt Nam.",
          },
          {
            title: "📚 Học tập",
            content:
              "Học sinh giỏi 3 năm liên tiếp · Điểm TB: 8.5 · Giỏi Toán, Tin học, Vật lý",
          },
          {
            title: "🏆 Thành tích",
            content:
              "Giải Nhì Toán cấp Quận 2024 · Dự án Robot CLB Robotics · App Python cá nhân",
          },
          {
            title: "⚙️ Kỹ năng",
            content:
              "Lập trình Python cơ bản · Scratch · Tư duy logic · Làm việc nhóm · Tiếng Anh B1",
          },
        ].map((s) => (
          <div key={s.title} className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-1.5">
              {s.title}
            </h3>
            <p className="text-sm text-gray-600">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const StudentApplicationResults = () => {
  const items = [
    {
      school: "THPT Chuyên Lê Hồng Phong",
      program: "Chuyên Toán - Tin",
      status: "pending",
      date: "20/07/2025",
      emoji: "🏫",
    },
    {
      school: "THPT Trần Đại Nghĩa",
      program: "Lớp thường",
      status: "accepted",
      date: "15/07/2025",
      emoji: "✅",
    },
    {
      school: "Học bổng Toán cấp Thành phố",
      program: "Đợt 1/2025",
      status: "reviewing",
      date: "30/06/2025",
      emoji: "🎓",
    },
  ];
  const statusMap: Record<string, { label: string; cls: string }> = {
    pending: { label: "Chờ kết quả", cls: "bg-amber-100 text-amber-700" },
    accepted: { label: "Đã đậu 🎉", cls: "bg-emerald-100 text-emerald-700" },
    reviewing: { label: "Đang xét duyệt", cls: "bg-blue-100 text-blue-700" },
  };
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Kết quả Ứng tuyển 🏅</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.school}
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm flex items-start gap-4"
          >
            <span className="text-3xl flex-shrink-0">{item.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.school}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{item.program}</p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusMap[item.status].cls}`}
                >
                  {statusMap[item.status].label}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentPlanGrade = () => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">Kế hoạch theo Lớp 📅</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        {
          grade: "Lớp 9 (Hiện tại)",
          color: "from-orange-500 to-amber-400",
          items: [
            "Hoàn thiện hồ sơ hướng nghiệp 100%",
            "Làm đủ 4 bài test tính cách & năng lực",
            "Tham gia CLB Robotics & Tin học",
            "Ôn thi lên lớp 10 — Toán, Văn, Anh",
          ],
          active: true,
        },
        {
          grade: "Lớp 10",
          color: "from-emerald-500 to-teal-400",
          items: [
            "Chọn tổ hợp môn phù hợp (A00, A01...)",
            "Học thêm lập trình Python / C++",
            "Tham gia dự án STEM cấp trường",
            "Khám phá thêm 5–10 ngành nghề",
          ],
          active: false,
        },
        {
          grade: "Lớp 11",
          color: "from-violet-500 to-indigo-400",
          items: [
            "Thi thử ĐGNL / ĐGTD",
            "Xây dựng portfolio cá nhân",
            "Học chứng chỉ quốc tế IELTS/SAT",
            "Tham quan các trường ĐH mục tiêu",
          ],
          active: false,
        },
        {
          grade: "Lớp 12",
          color: "from-pink-500 to-rose-400",
          items: [
            "Nộp hồ sơ xét tuyển ĐH",
            "Thi THPT Quốc gia",
            "Phỏng vấn học bổng",
            "Chuẩn bị tài chính cho ĐH",
          ],
          active: false,
        },
      ].map((plan) => (
        <div
          key={plan.grade}
          className={`rounded-2xl overflow-hidden shadow-sm border-2 ${plan.active ? "border-orange-200" : "border-gray-100"}`}
        >
          <div
            className={`p-3 bg-gradient-to-r ${plan.color} text-white flex items-center justify-between`}
          >
            <span className="font-bold text-sm">{plan.grade}</span>
            {plan.active && (
              <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold">
                Đang thực hiện
              </span>
            )}
          </div>
          <div className="bg-white p-4">
            <ul className="space-y-2">
              {plan.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${plan.active ? "bg-orange-400" : "bg-gray-300"}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const StudentPlanPathways = () => {
  const pathways = [
    {
      emoji: "💻",
      title: "Con đường Kỹ thuật phần mềm",
      match: 92,
      steps: [
        "Lớp 9: Học Scratch, Python cơ bản",
        "Lớp 10–11: C++, Web, App",
        "Lớp 12: Portfolio + thi ĐH CNTT",
        "ĐH: Kỹ thuật phần mềm — UIT, BK HCM",
      ],
      grad: "from-violet-500 to-indigo-500",
    },
    {
      emoji: "🔬",
      title: "Con đường Khoa học dữ liệu",
      match: 81,
      steps: [
        "Lớp 9–10: Toán xác suất + Python",
        "Lớp 11: Machine Learning cơ bản",
        "Lớp 12: Dự án data thực tế",
        "ĐH: Toán tin, Khoa học máy tính",
      ],
      grad: "from-blue-500 to-cyan-400",
    },
    {
      emoji: "⚙️",
      title: "Con đường Kỹ thuật điện tử",
      match: 71,
      steps: [
        "Lớp 9–10: Điện tử cơ bản, Arduino",
        "Lớp 11: Robotics, IoT",
        "Lớp 12: Dự án kỹ thuật cấp trường",
        "ĐH: Điện tử viễn thông — BK, ĐH Bách Khoa",
      ],
      grad: "from-teal-500 to-emerald-400",
    },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">
        Lộ trình Ngành nghề 🗺️
      </h1>
      <p className="text-sm text-gray-500">
        3 con đường nghề nghiệp phù hợp nhất với bạn, được cá nhân hoá dựa trên
        hồ sơ của bạn.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {pathways.map((p, i) => (
          <div
            key={p.title}
            className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm"
          >
            <div className={`h-2 bg-gradient-to-r ${p.grad}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        ⭐ Phù hợp nhất
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mt-0.5">{p.title}</h3>
                </div>
                <span className="text-sm font-black font-mono text-gray-800">
                  {p.match}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${p.grad}`}
                  style={{ width: `${p.match}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {p.steps.map((step, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 text-xs text-gray-600"
                  >
                    <span className="text-base flex-shrink-0">
                      {"🌱📈🚀🎓"[j]}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// University card
