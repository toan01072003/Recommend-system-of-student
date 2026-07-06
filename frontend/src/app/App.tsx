import { useState } from "react";
import {
  LayoutDashboard, Users, BookOpen, Briefcase, MessageSquare,
  LogOut, ChevronRight, ChevronDown, Bell, Search,
  Lock, AlertTriangle, CheckCircle, Clock, Star, ArrowRight,
  TrendingUp, Award, Target, FileText, Home, Compass,
  Plus, Edit2, Save, Shield, Database, User, FolderOpen,
  BarChart2, GraduationCap, Heart, UserCheck, Activity,
  Gamepad2, ClipboardList, MapPin, BookMarked, Trophy, Map,
  Layers, Flag, PieChart, Lightbulb, School,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import {
  gradeData, classesData, studentsInClass, studentSkills, academicTrend,
  careerMatches, careerInterestDist, heatmapData,
  EXPLORE_CAREERS, EXPLORE_FIELDS, REACTIONS,
  UNIVERSITIES, UNI_TYPES, UNI_REACTIONS,
  CONTACTS_FOR_STUDENT, CONTACTS_FOR_COUNSELOR, INITIAL_MESSAGES,
  SAMPLE_NOTES, SURVEY_COMPLETED_RESULTS,
  SUBJECTS, ACADEMIC_HISTORY, YEARS,
  DEMAND_OPTIONS, PERSONALITY_OPTS, CLUSTER_OPTS, SUBJECT_OPTS, EDU_OPTS,
  INTEREST_CHIPS, KID_CARDS, QUIZ_QUESTIONS,
  avg, scoreCareer,
  type CareerActivity, type CareerUniversity, type ExploreCareer,
  type University, type ChatContact, type ChatMessage, type AdviceNote, type TestFilters,
} from "./data";
import { RiskBadge, TestBadge, ProgressBar, StatCard, Avatar, ScoreBar, MultiCheck, LineChart, Line } from "./shared";


// ── Screen 1: Login ──────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: (role: string) => void }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const roles = [
    { id: "admin", label: "Quản trị viên", icon: Shield, desc: "Quản lý toàn hệ thống", cls: "bg-indigo-600" },
    { id: "teacher", label: "Giáo viên", icon: BookOpen, desc: "Nhập liệu & theo dõi lớp", cls: "bg-blue-600" },
    { id: "counselor", label: "Cố vấn hướng nghiệp", icon: Briefcase, desc: "Tư vấn & lập kế hoạch", cls: "bg-teal-600" },
    { id: "student", label: "Học sinh", icon: GraduationCap, desc: "Khám phá nghề nghiệp", cls: "bg-violet-600" },
    { id: "parent", label: "Phụ huynh", icon: Heart, desc: "Theo dõi tiến độ của con", cls: "bg-rose-600" },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2B4A] via-[#7C3AED] to-[#EA580C] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <GraduationCap className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EduPath</h1>
          <p className="text-blue-300 text-sm mt-1.5">Hệ thống hướng nghiệp học sinh lớp 6–12</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue="admin@truongnguyendu.edu.vn"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">Đăng nhập với vai trò</p>
          <div className="space-y-1.5 mb-5">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                  selected === r.id ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${r.cls} flex items-center justify-center flex-shrink-0`}>
                  <r.icon size={15} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>
                {selected === r.id && <CheckCircle size={16} className="text-blue-500 flex-shrink-0" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => selected && onLogin(selected)}
            disabled={!selected}
            className="w-full py-3 bg-[#EA580C] text-white rounded-xl font-semibold text-sm hover:bg-[#C2410C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Đăng nhập
          </button>
        </div>
        <p className="text-center text-blue-400 text-xs mt-5">THCS & THPT Nguyễn Du · Năm học 2024–2025</p>
      </div>
    </div>
  );
};

// ── Screen 2: School Overview ────────────────────────────────────────────────
const SchoolOverview = ({ navigate }: { navigate: (v: string) => void }) => (
  <div className="space-y-5">
    <div>
      <h1 className="text-xl font-bold text-gray-900">Tổng quan toàn trường</h1>
      <p className="text-sm text-gray-500 mt-0.5">THCS & THPT Nguyễn Du · Năm học 2024–2025</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Tổng học sinh" value="1,820" sub="7 khối lớp" icon={Users} color="blue" trend="+12 so với năm ngoái" />
      <StatCard title="Hồ sơ hoàn thành" value="73%" sub="1,329 / 1,820 HS" icon={CheckCircle} color="green" trend="+8% so với tháng trước" />
      <StatCard title="Cần tư vấn" value="142" sub="7.8% tổng học sinh" icon={AlertTriangle} color="yellow" />
      <StatCard title="Bài test hoàn thành" value="1,241" sub="68% tổng học sinh" icon={FileText} color="navy" trend="+15% tháng này" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Tỷ lệ hoàn thành hồ sơ theo khối</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={gradeData} barSize={28}>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis key="xaxis" dataKey="grade" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis key="yaxis" tick={{ fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip key="tooltip" formatter={(v: number) => [`${v}%`, "Hoàn thành"]} cursor={{ fill: "#f0f4f8" }} />
            <Bar key="bar-completion" dataKey="completion" fill="#EA580C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Học sinh theo khối</h3>
        <div className="space-y-3">
          {gradeData.map((g) => (
            <div key={g.grade} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 w-12 flex-shrink-0">{g.grade}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-[#0F766E]" style={{ width: `${(g.students / 312) * 100}%` }} />
              </div>
              <span className="text-xs font-mono font-semibold text-gray-700 w-8 text-right">{g.students}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Heatmap */}
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Heatmap hoàn thành hồ sơ theo lớp</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left text-gray-400 font-medium pb-3 pr-4 w-16">Khối</th>
              {["A", "B", "C", "D", "E", "F", "G", "H"].map((c) => (
                <th key={c} className="text-center pb-3 w-12 text-gray-400 font-medium">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row) => (
              <tr key={row.grade}>
                <td className="text-gray-600 font-semibold pr-4 py-1 text-xs">{row.grade}</td>
                {row.vals.map((v, i) => {
                  const bg = v >= 85 ? "bg-emerald-500" : v >= 70 ? "bg-amber-400" : v >= 55 ? "bg-orange-400" : "bg-red-500";
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
          {[["bg-emerald-500", "≥85%"], ["bg-amber-400", "70–84%"], ["bg-orange-400", "55–69%"], ["bg-red-500", "<55%"]].map(([cls, lbl]) => (
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
      <h3 className="font-semibold text-gray-800 mb-4">Cảnh báo cần xử lý</h3>
      <div className="space-y-2.5">
        {[
          { level: "high", msg: "Lớp 9E có tỷ lệ hoàn thành thấp nhất: 55%", action: "Xem lớp" },
          { level: "high", msg: "12 học sinh lớp 6 chưa có dữ liệu học tập năm nay", action: "Nhập liệu" },
          { level: "medium", msg: "34 học sinh khối 7–8 chưa làm bài test hướng nghiệp", action: "Nhắc nhở" },
          { level: "low", msg: "Lớp 10C cần cập nhật nhận xét học kỳ 1", action: "Cập nhật" },
        ].map((a, i) => (
          <div
            key={i}
            className={`flex items-center justify-between p-3 rounded-xl ${
              a.level === "high" ? "bg-red-50 border border-red-100" :
              a.level === "medium" ? "bg-amber-50 border border-amber-100" :
              "bg-blue-50 border border-blue-100"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle
                size={14}
                className={a.level === "high" ? "text-red-500" : a.level === "medium" ? "text-amber-500" : "text-blue-500"}
              />
              <span className="text-sm text-gray-700">{a.msg}</span>
            </div>
            <button className="text-xs font-semibold text-orange-600 hover:text-orange-800 whitespace-nowrap ml-4 flex items-center gap-0.5">
              {a.action} <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Screen 3: Grade Dashboard ────────────────────────────────────────────────
const GradeDashboard = ({ navigate }: { navigate: (v: string) => void }) => {
  const [selectedGrade, setSelectedGrade] = useState("9");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard Khối {selectedGrade}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Năm học 2024–2025</p>
        </div>
        <div className="flex gap-1.5">
          {["6", "7", "8", "9", "10", "11", "12"].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                selectedGrade === g ? "bg-[#EA580C] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Số lớp" value="6" sub="9A đến 9F" icon={LayoutDashboard} color="blue" />
        <StatCard title="Tổng học sinh" value="219" sub="Khối 9" icon={Users} color="navy" />
        <StatCard title="Hoàn thành career test" value="74%" sub="162 / 219 HS" icon={CheckCircle} color="green" />
        <StatCard title="Nhóm ngành top 1" value="KH & CN" sub="89 HS quan tâm" icon={Star} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Phân bố nhóm ngành quan tâm</h3>
          <div className="space-y-3.5">
            {careerInterestDist.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600 w-32 flex-shrink-0">{item.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${(item.value / 89) * 100}%`, backgroundColor: item.color }} />
                </div>
                <span className="text-sm font-mono font-semibold text-gray-700 w-7 text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Danh sách lớp — Khối {selectedGrade}</h3>
          <div className="space-y-2">
            {classesData.map((cls) => (
              <button
                key={cls.name}
                onClick={() => navigate("class-dashboard")}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                  {cls.name}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">Lớp {cls.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{cls.students} HS</span>
                  </div>
                  <ProgressBar value={cls.completion} />
                </div>
                <div className="text-right flex-shrink-0 w-12">
                  <span className={`text-sm font-mono font-bold ${cls.completion >= 80 ? "text-green-600" : cls.completion >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                    {cls.completion}%
                  </span>
                  {cls.risk > 0 && <div className="text-xs text-red-500">{cls.risk} cần HT</div>}
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 4: Class Dashboard ────────────────────────────────────────────────
const ClassDashboard = ({ navigate }: { navigate: (v: string) => void }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = studentsInClass.filter((s) => {
    if (filter === "risk" && s.risk === "none") return false;
    if (filter === "incomplete" && s.testStatus === "Hoàn thành") return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lớp 9A</h1>
          <p className="text-sm text-gray-500 mt-0.5">GVCN: Cô Trần Thị Lan · 38 học sinh</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("teacher-entry")}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus size={14} /> Nhập dữ liệu
          </button>
          <button className="px-4 py-2 bg-[#EA580C] text-white rounded-xl text-sm font-semibold hover:bg-[#C2410C] flex items-center gap-2">
            <MessageSquare size={14} /> Tạo lịch tư vấn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Hoàn thành hồ sơ" value="89%" sub="34 / 38 HS" icon={CheckCircle} color="green" />
        <StatCard title="Test hướng nghiệp" value="79%" sub="30 / 38 HS" icon={FileText} color="blue" />
        <StatCard title="Điểm TB lớp" value="7.8" sub="HK1 · 2024–2025" icon={BarChart2} color="navy" />
        <StatCard title="Cần hỗ trợ" value="2 HS" sub="Mức độ khẩn cấp" icon={AlertTriangle} color="red" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm học sinh..."
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
                filter === f.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Học sinh</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Điểm TB</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Nhóm ngành</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Test</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Hồ sơ</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tình trạng</th>
                <th className="py-3 px-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={s.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono font-bold text-sm ${s.avg >= 8 ? "text-green-600" : s.avg >= 6.5 ? "text-orange-600" : "text-red-600"}`}>
                      {s.avg.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className="text-gray-600 text-xs">{s.careerFit}</span>
                  </td>
                  <td className="py-3 px-4"><TestBadge status={s.testStatus} /></td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2 w-28">
                      <ProgressBar value={s.progress} />
                      <span className="text-xs text-gray-500 font-mono w-8">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><RiskBadge level={s.risk} /></td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate("student-profile")}
                      className="text-xs font-semibold text-orange-600 hover:text-orange-800 whitespace-nowrap flex items-center gap-0.5"
                    >
                      Xem hồ sơ <ArrowRight size={11} />
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
const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("academic");
  const [wellbeingRequested, setWellbeingRequested] = useState(false);

  const tabs = [
    { id: "academic", label: "Học tập" },
    { id: "personal", label: "Cá nhân" },
    { id: "career", label: "Hướng nghiệp" },
    { id: "wellbeing", label: "Wellbeing", locked: true },
    { id: "parent-exp", label: "Phụ huynh" },
    { id: "counseling", label: "Tư vấn" },
  ];

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="p-5">
          <div className="flex items-start gap-4 flex-wrap">
            <Avatar name="Nguyễn Minh Anh" size="lg" />
            <div className="flex-1 min-w-48">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Nguyễn Minh Anh</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Lớp 9A · Mã HS: <span className="font-mono">HS001</span> · GVCN: Cô Trần Thị Lan</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 whitespace-nowrap">
                  ✓ Hồ sơ 95%
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {[
                  { label: "Học lực", value: "Giỏi", cls: "text-green-600" },
                  { label: "Sở thích chính", value: "KH & CN", cls: "text-orange-600" },
                  { label: "Ngành phù hợp", value: "Phần mềm", cls: "text-indigo-600" },
                  { label: "Cố vấn", value: "Thầy Minh", cls: "text-gray-700" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${item.cls}`}>{item.value}</p>
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
                  activeTab === tab.id ? "border-blue-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
                } ${tab.locked ? "cursor-default" : ""}`}
              >
                {tab.label}
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
            <h3 className="font-semibold text-gray-800 mb-4">Xu hướng học tập</h3>
            <ResponsiveContainer width="100%" height={195}>
              <LineChart data={academicTrend}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis key="xaxis" dataKey="term" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis key="yaxis" tick={{ fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[6, 10]} />
                <Tooltip key="tooltip" />
                <Line key="line-score" type="monotone" dataKey="score" stroke="#EA580C" strokeWidth={2.5} dot={{ r: 4, fill: "#EA580C", strokeWidth: 0 }} name="Điểm TB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Điểm số theo môn</h3>
            <div className="space-y-3">
              {[
                { subject: "Tin học", score: 9.5, type: "strong" },
                { subject: "Toán", score: 9.2, type: "strong" },
                { subject: "Vật lý", score: 8.8, type: "strong" },
                { subject: "Ngữ văn", score: 7.1, type: "neutral" },
                { subject: "Lịch sử", score: 6.4, type: "weak" },
              ].map((s) => (
                <div key={s.subject} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20 flex-shrink-0">{s.subject}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={s.type === "strong" ? "h-2 rounded-full bg-green-500" : s.type === "weak" ? "h-2 rounded-full bg-red-400" : "h-2 rounded-full bg-blue-400"}
                      style={{ width: `${(s.score / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-mono font-bold w-8 text-right ${s.type === "strong" ? "text-green-600" : s.type === "weak" ? "text-red-500" : "text-orange-600"}`}>
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <strong>Thành tích:</strong> Giải Nhì Toán cấp Quận 2024 · Học sinh giỏi 3 năm liên tiếp · CLB Robotics
            </div>
          </div>
        </div>
      )}

      {/* Career tab */}
      {activeTab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Bản đồ kỹ năng & Sở thích</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={studentSkills}>
                <PolarGrid key="polar-grid" stroke="#e5e7eb" />
                <PolarAngleAxis key="polar-angle" dataKey="skill" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <PolarRadiusAxis key="polar-radius" domain={[0, 100]} tick={false} axisLine={false} />
                <Radar key="radar-score" name="Điểm" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Độ phù hợp nghề nghiệp</h3>
            <div className="space-y-3.5">
              {careerMatches.map((c, i) => (
                <div key={c.career} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                  <span className="text-sm text-gray-700 flex-1">{c.career}</span>
                  <div className="w-24 bg-gray-100 rounded-full h-2 flex-shrink-0">
                    <div className="h-2 rounded-full bg-[#0F766E]" style={{ width: `${c.score}%` }} />
                  </div>
                  <span className="text-sm font-bold font-mono text-indigo-700 w-10 text-right">{c.score}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700">
              <strong>Lộ trình gợi ý:</strong> Tập trung Toán–Lý–Tin · Tham gia CLB Robotics · Học Python cơ bản
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
          <h3 className="font-bold text-gray-700 mb-2">Dữ liệu Wellbeing — Bảo mật cao</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
            Thông tin sức khỏe tinh thần và cảm xúc chỉ hiển thị với người có quyền truy cập đặc biệt được phê duyệt.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-5">
            <AlertTriangle size={14} /> Lưu ý: Học sinh này cần được cố vấn hỗ trợ thêm
          </div>
          <div>
            {wellbeingRequested ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm border border-green-200">
                <CheckCircle size={14} /> Yêu cầu đã gửi — chờ phê duyệt
              </div>
            ) : (
              <button
                onClick={() => setWellbeingRequested(true)}
                className="px-5 py-2.5 bg-[#EA580C] text-white rounded-xl text-sm font-semibold hover:bg-[#C2410C]"
              >
                Yêu cầu quyền truy cập
              </button>
            )}
          </div>
        </div>
      )}

      {/* Counseling tab */}
      {activeTab === "counseling" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Timeline tư vấn</h3>
            <div className="space-y-4">
              {[
                { date: "15/01/2025", title: "Tư vấn định hướng khối 9", done: true, note: "HS quan tâm CNTT, cần test thêm" },
                { date: "20/02/2025", title: "Review kết quả career test", done: true, note: "Kết quả: KH & CN phù hợp 92%" },
                { date: "15/03/2025", title: "Lập kế hoạch thi ĐH", done: false, note: "" },
                { date: "20/04/2025", title: "Gặp phụ huynh — định hướng cuối cấp", done: false, note: "" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.done ? "bg-green-100" : "bg-gray-100"}`}>
                    {item.done ? <CheckCircle size={14} className="text-green-600" /> : <Clock size={14} className="text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-mono">{item.date}</p>
                    <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                    {item.note && <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Việc cần làm tiếp theo</h3>
            <div className="space-y-2">
              {[
                { task: "Hoàn thành bài test MBTI", priority: "Gấp", done: false },
                { task: "Nộp hồ sơ thi học sinh giỏi Toán", priority: "Trung bình", done: true },
                { task: "Tham gia buổi hướng nghiệp CLB IT", priority: "Trung bình", done: false },
                { task: "Cập nhật mục tiêu nghề nghiệp", priority: "Bình thường", done: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${item.done ? "opacity-50" : "hover:bg-gray-50"}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${item.done ? "border-green-500 bg-green-500" : "border-gray-300"}`}>
                    {item.done && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <span className={`text-sm flex-1 ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>{item.task}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                    item.priority === "Gấp" ? "bg-red-100 text-red-600" :
                    item.priority === "Trung bình" ? "bg-amber-100 text-amber-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>{item.priority}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab === "personal" || activeTab === "parent-exp") && (
        <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 text-sm">
            Nội dung tab <strong className="text-gray-600">{tabs.find((t) => t.id === activeTab)?.label}</strong> đang được cập nhật bởi học sinh và phụ huynh.
          </p>
        </div>
      )}
    </div>
  );
};

// ── Screen 6: Teacher Data Entry ─────────────────────────────────────────────
const TeacherEntry = () => {
  const [autosaved, setAutosaved] = useState(false);
  const markSaved = () => setAutosaved(true);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Nhập dữ liệu học sinh</h1>
        <p className="text-sm text-gray-500 mt-0.5">Lớp 9A · Lưu tự động khi thay đổi</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <Avatar name="Nguyễn Minh Anh" />
          <div>
            <p className="font-bold text-gray-800">Nguyễn Minh Anh</p>
            <p className="text-xs text-gray-500 font-mono">HS001 · Lớp 9A</p>
          </div>
          {autosaved && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
              <CheckCircle size={12} /> Đã lưu tự động
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {["Toán", "Ngữ văn", "Vật lý", "Hóa học", "Sinh học", "Tiếng Anh"].map((sub) => (
            <div key={sub}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Điểm {sub}</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                onChange={markSaved}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                placeholder="0.0"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Môn học nổi bật</label>
          <div className="flex flex-wrap gap-2">
            {["Toán", "Vật lý", "Tin học", "Ngữ văn", "Tiếng Anh", "Hóa học", "Sinh học"].map((s) => (
              <button
                key={s}
                onClick={markSaved}
                className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-full hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Hoạt động ngoại khóa</label>
          <input
            onChange={markSaved}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="VD: CLB Toán, CLB Robotics, Đội tuyển học sinh giỏi..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Thành tích & Giải thưởng</label>
          <input
            onChange={markSaved}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="VD: Giải Nhì Toán cấp Quận 2024, Học sinh giỏi..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét học tập</label>
          <textarea
            onChange={markSaved}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Học sinh có tư duy logic tốt, nổi bật ở Toán và Tin học..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nhận xét hành vi học tập</label>
          <textarea
            onChange={markSaved}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Chủ động, nghiêm túc, tích cực tham gia thảo luận..."
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Lưu nháp
          </button>
          <button className="px-4 py-2.5 border border-blue-200 bg-blue-50 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-100 flex items-center gap-2">
            <MessageSquare size={14} /> Gửi cố vấn
          </button>
          <button className="ml-auto px-5 py-2.5 bg-[#EA580C] text-white rounded-xl text-sm font-bold hover:bg-[#C2410C] flex items-center gap-2">
            <Save size={14} /> Hoàn tất cập nhật
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Screen 7: Counseling Workspace ───────────────────────────────────────────
const CounselingWorkspace = () => {
  const [note, setNote] = useState("");
  const plans = [
    {
      period: "Ngắn hạn (3 tháng)",
      items: ["Hoàn thành bộ test MBTI + Holland", "Tham gia CLB Robotics", "Ôn thi học sinh giỏi Toán"],
      bg: "bg-blue-50", border: "border-blue-100", textHdr: "text-blue-700", dot: "bg-blue-400",
    },
    {
      period: "Trung hạn (1 năm)",
      items: ["Học lập trình Python cơ bản", "Tham gia dự án STEM trường", "Tìm hiểu ngành CNTT tại ĐH"],
      bg: "bg-indigo-50", border: "border-indigo-100", textHdr: "text-indigo-700", dot: "bg-indigo-400",
    },
    {
      period: "Dài hạn (đến lớp 12)",
      items: ["Xây dựng portfolio dự án cá nhân", "Chuẩn bị hồ sơ ĐH top tier", "Thi chứng chỉ quốc tế IELTS/SAT"],
      bg: "bg-purple-50", border: "border-purple-100", textHdr: "text-purple-700", dot: "bg-purple-400",
    },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Không gian Tư vấn</h1>
        <p className="text-sm text-gray-500 mt-0.5">Nguyễn Minh Anh · HS001 · Lớp 9A</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Kế hoạch hành động</h3>
            <div className="space-y-3">
              {plans.map((plan) => (
                <div key={plan.period} className={`p-4 rounded-xl ${plan.bg} border ${plan.border}`}>
                  <p className={`text-sm font-bold mb-2 ${plan.textHdr}`}>{plan.period}</p>
                  <ul className="space-y-1.5">
                    {plan.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${plan.dot}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Ghi chú buổi tư vấn hôm nay</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Ghi lại nội dung, kết quả và cam kết của buổi tư vấn hôm nay..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium">Hủy</button>
              <button className="px-4 py-2 bg-[#EA580C] text-white rounded-xl text-sm font-bold hover:bg-[#C2410C] flex items-center gap-2">
                <Save size={13} /> Lưu ghi chú
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Gợi ý hành động</h3>
            <div className="space-y-1.5">
              {[
                { icon: BookOpen, label: "Chọn tổ hợp A00 hoặc A01" },
                { icon: Users, label: "Tham gia CLB Tin học" },
                { icon: Award, label: "Học chứng chỉ Python / C++" },
                { icon: Target, label: "Tìm hiểu ĐH Bách Khoa, UIT" },
                { icon: Briefcase, label: "Shadow day tại công ty tech" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                  <Plus size={14} className="text-gray-300 group-hover:text-blue-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Kết quả bài test</h3>
            <div className="space-y-2.5">
              {[
                { label: "MBTI", value: "INTJ" },
                { label: "Holland", value: "I–C–R" },
                { label: "DISC", value: "C–D" },
                { label: "Career Match", value: "KH & CN" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{r.label}</span>
                  <span className="text-sm font-bold text-gray-800 font-mono">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Screen 8: Student Career Portal ─────────────────────────────────────────
const StudentPortal = () => {
  const [step, setStep] = useState<"home" | "test" | "result">("home");
  const [interests, setInterests] = useState<string[]>([]);
  const [testQ, setTestQ] = useState(0);

  // ── Result view ──
  if (step === "result") {
    const results = [
      { emoji: "🖥️", field: "Khoa học & Công nghệ", match: 92, desc: "Tư duy logic, yêu thích kỹ thuật số", grad: "from-violet-500 to-indigo-500", top: true },
      { emoji: "📐", field: "Toán học & Nghiên cứu", match: 81, desc: "Khả năng phân tích và sáng tạo cao", grad: "from-blue-500 to-cyan-400", top: false },
      { emoji: "⚙️", field: "Kỹ thuật & Xây dựng", match: 74, desc: "Thích giải quyết vấn đề thực tiễn", grad: "from-teal-500 to-emerald-400", top: false },
    ];
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center py-2">
          <div className="text-5xl mb-3 animate-bounce">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">Kết quả của bạn đây!</h1>
          <p className="text-gray-500 mt-1 text-sm">Dựa trên bài test và sở thích cá nhân</p>
        </div>

        <div className="space-y-3">
          {results.map((item, i) => (
            <div key={item.field} className={`rounded-2xl p-1 bg-gradient-to-r ${item.grad} shadow-md`} style={{ transform: i === 0 ? "scale(1.02)" : undefined }}>
              <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.grad} flex items-center justify-center text-3xl flex-shrink-0 shadow-sm`}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  {item.top && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full mb-1 inline-block">⭐ Phù hợp nhất với bạn</span>}
                  <h3 className="font-bold text-gray-900">{item.field}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-2.5 rounded-full bg-gradient-to-r ${item.grad} transition-all duration-700`} style={{ width: `${item.match}%` }} />
                    </div>
                    <span className="text-sm font-bold text-gray-800 font-mono w-10 text-right">{item.match}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🗺️</span> Bạn cần làm gì tiếp theo?
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { e: "📚", l: "Tập trung Toán, Lý, Tin", bg: "bg-blue-100 text-blue-700" },
              { e: "🤖", l: "Tham gia CLB Robotics", bg: "bg-violet-100 text-violet-700" },
              { e: "💻", l: "Học lập trình Python", bg: "bg-emerald-100 text-emerald-700" },
            ].map((a) => (
              <div key={a.l} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${a.bg} text-center`}>
                <span className="text-2xl">{a.e}</span>
                <span className="text-xs font-bold leading-tight">{a.l}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setStep("home"); setInterests([]); setTestQ(0); }}
          className="w-full py-3 bg-white border-2 border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          ← Quay về trang chủ
        </button>
      </div>
    );
  }

  // ── Quiz view ──
  if (step === "test") {
    const current = QUIZ_QUESTIONS[testQ];
    const progress = (testQ / QUIZ_QUESTIONS.length) * 100;
    return (
      <div className="max-w-lg mx-auto space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-orange-600">Câu {testQ + 1} / {QUIZ_QUESTIONS.length}</span>
            <span className="text-xs text-gray-400">{Math.round(progress)}% hoàn thành</span>
          </div>
          <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #F97316, #EC4899)" }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-violet-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-violet-400 to-indigo-400" />
          <div className="p-6">
            <div className="text-4xl mb-4 text-center">🤔</div>
            <p className="text-lg font-bold text-gray-900 mb-5 text-center leading-snug">{current.q}</p>
            <div className="space-y-2.5">
              {current.opts.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => {
                    if (testQ < QUIZ_QUESTIONS.length - 1) setTestQ((q) => q + 1);
                    else setStep("result");
                  }}
                  className="w-full text-left px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-orange-400 hover:bg-orange-50 active:scale-98 transition-all font-semibold text-gray-700 text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => { setStep("home"); setTestQ(0); }} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Quay lại
        </button>
      </div>
    );
  }

  // ── Home view ──
  return (
    <div className="space-y-5 max-w-2xl">
      {/* Hero */}
      <div
        className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg"
        style={{ background: "linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)" }}
      >
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute bottom-3 right-20 w-12 h-12 rounded-full bg-white/10" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-semibold">Xin chào 👋</p>
          <h1 className="text-2xl font-bold mt-0.5 mb-1">Minh Anh ơi!</h1>
          <p className="text-white/80 text-sm mb-5">Hãy cùng khám phá nghề nghiệp phù hợp nhất với bạn nhé 🌟</p>
          <div className="bg-white/20 rounded-2xl p-3.5 backdrop-blur-sm">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-bold text-white/90">Hồ sơ hướng nghiệp</span>
              <span className="text-xs font-bold text-white">62% ✨</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-3 rounded-full bg-white transition-all" style={{ width: "62%" }} />
            </div>
            <p className="text-xs text-white/70 mt-1.5">Còn 38% nữa là hoàn thiện hồ sơ! 💪</p>
          </div>
        </div>
      </div>

      {/* Nudge to-do */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <span className="text-2xl flex-shrink-0">⚡</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">Bạn chưa làm bài test MBTI!</p>
          <p className="text-xs text-amber-600 mt-0.5">Chỉ 3 câu hỏi thôi — biết ngay bạn phù hợp với nghề nào nhé!</p>
        </div>
        <button
          onClick={() => setStep("test")}
          className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-colors"
        >
          Làm ngay →
        </button>
      </div>

      {/* Big test CTA */}
      <button
        onClick={() => setStep("test")}
        className="w-full rounded-3xl p-5 text-left shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #F97316, #EF4444)" }}
      >
        <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-white/15" />
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-5xl">🚀</span>
          <div>
            <h3 className="font-bold text-white text-base mb-0.5">Làm bài test hướng nghiệp</h3>
            <p className="text-white/80 text-xs">Khám phá nghề nghiệp phù hợp nhất với bạn!</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/25 px-3 py-1.5 rounded-full mt-2">
              Bắt đầu ngay <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </button>

      {/* 4 colorful small cards */}
      <div className="grid grid-cols-2 gap-3">
        {KID_CARDS.map((card) => (
          <button
            key={card.title}
            className="relative rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group"
            style={{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }}
          >
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/20 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <span className="text-2xl block mb-2">{card.emoji}</span>
              <h3 className="font-bold text-white text-sm mb-1 leading-tight">{card.title}</h3>
              <p className="text-white/80 text-xs mb-2.5 leading-relaxed">{card.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/25 px-2.5 py-1 rounded-full">
                {card.action} <ArrowRight size={10} />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Interest chip picker */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2 text-base">
          <span>🎯</span> Sở thích của tôi
        </h3>
        <p className="text-xs text-gray-500 mb-4">Chọn những lĩnh vực bạn yêu thích để gợi ý chính xác hơn</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setInterests((prev) =>
                prev.includes(chip.id) ? prev.filter((x) => x !== chip.id) : [...prev, chip.id]
              )}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                interests.includes(chip.id)
                  ? "border-orange-400 bg-orange-100 text-orange-700 scale-105 shadow-sm"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
        {interests.length > 0 && (
          <p className="text-xs text-orange-600 font-bold mt-3 flex items-center gap-1">
            <span>✨</span> Đã chọn {interests.length} sở thích — đã lưu tự động!
          </p>
        )}
      </div>
    </div>
  );
};

// ── Screen 9: Parent Portal ───────────────────────────────────────────────────
const ParentPortal = () => (
  <div className="space-y-5">
    <div>
      <h1 className="text-xl font-bold text-gray-900">Cổng thông tin Phụ huynh</h1>
      <p className="text-sm text-gray-500 mt-0.5">Theo dõi tiến độ của con — Nguyễn Minh Anh · Lớp 9A</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Hồ sơ hướng nghiệp" value="95%" sub="Gần hoàn thiện" icon={CheckCircle} color="green" />
      <StatCard title="Học lực" value="Giỏi" sub="ĐTB 8.5 · HK1" icon={BarChart2} color="blue" />
      <StatCard title="Nhóm ngành quan tâm" value="KH & CN" sub="Phù hợp 92%" icon={Star} color="navy" />
      <StatCard title="Buổi tư vấn" value="2 / 4" sub="Đã hoàn thành" icon={MessageSquare} color="yellow" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Phụ huynh nên làm gì tiếp theo?</h3>
        <div className="space-y-2.5">
          {[
            { task: "Con cần hoàn thành bài test MBTI — nhắc nhở con làm trước 30/03", urgent: true },
            { task: "Hỗ trợ con tìm hiểu về ngành CNTT qua sách, video, hoặc tham quan", urgent: false },
            { task: "Cùng con tham dự Ngày hướng nghiệp tháng 4 tại trường", urgent: false },
            { task: "Cân nhắc cho con học thêm lập trình tại trung tâm hoặc online", urgent: false },
          ].map((item, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${item.urgent ? "bg-amber-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}>
              {item.urgent ? <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> : <ArrowRight size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />}
              <p className="text-sm text-gray-700">{item.task}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Cập nhật kỳ vọng gia đình</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Định hướng học tập</label>
            <div className="flex gap-2 flex-wrap">
              {["Trong nước", "Du học", "Chưa quyết định"].map((opt, i) => (
                <button key={opt} className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${i === 0 ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngân sách dự kiến / năm học</label>
            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>50 – 100 triệu đồng</option>
              <option>Dưới 50 triệu đồng</option>
              <option>100 – 200 triệu đồng</option>
              <option>Trên 200 triệu đồng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kỳ vọng của gia đình</label>
            <textarea
              rows={3}
              defaultValue="Muốn con theo học ngành kỹ thuật hoặc CNTT tại các trường đại học uy tín trong nước."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button className="w-full py-2.5 bg-[#EA580C] text-white rounded-xl text-sm font-bold hover:bg-[#C2410C]">
            Lưu cập nhật
          </button>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
      <Lock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-bold text-amber-800">Lưu ý về dữ liệu Wellbeing</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Một số thông tin sức khỏe tinh thần của con không được hiển thị để bảo vệ quyền riêng tư của con em. Nếu cần biết thêm, vui lòng liên hệ trực tiếp với cố vấn hướng nghiệp tại trường.
        </p>
      </div>
    </div>
  </div>
);

// ── Screen 10: Data Quality (Admin) ─────────────────────────────────────────
const DataQuality = () => {
  const permTable = [
    { type: "Academic Profile", sensitive: false, admin: true, counselor: true, teacher: true, parent: true, student: true },
    { type: "Personal Statement", sensitive: false, admin: true, counselor: true, teacher: true, parent: false, student: true },
    { type: "Career Profile", sensitive: false, admin: true, counselor: true, teacher: true, parent: true, student: true },
    { type: "Wellbeing Profile", sensitive: true, admin: true, counselor: true, teacher: false, parent: false, student: false },
    { type: "Parent Expectation", sensitive: false, admin: true, counselor: true, teacher: false, parent: true, student: false },
    { type: "Alumni Data", sensitive: false, admin: true, counselor: true, teacher: true, parent: false, student: true },
  ];
  const check = (val: boolean) => val
    ? <span className="text-green-600 font-bold text-base">✓</span>
    : <span className="text-gray-200 text-base">—</span>;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Chất lượng & Bảo mật Dữ liệu</h1>
        <p className="text-sm text-gray-500 mt-0.5">Dành cho Quản trị viên · Cập nhật: 25/06/2025 08:32</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Dữ liệu thiếu" value="234" sub="Trường bắt buộc" icon={AlertTriangle} color="yellow" />
        <StatCard title="Dữ liệu trùng" value="12" sub="Cần xem xét" icon={Database} color="red" />
        <StatCard title="Log thao tác (7 ngày)" value="1,482" sub="Hoạt động ghi nhận" icon={Activity} color="blue" />
        <StatCard title="Dữ liệu nhạy cảm" value="Bảo mật" sub="Wellbeing — 2 lớp xác thực" icon={Lock} color="navy" />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Phân quyền truy cập dữ liệu</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 rounded-lg">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide rounded-l-lg">Loại dữ liệu</th>
                {["Admin", "Cố vấn", "GV", "Phụ huynh", "Học sinh"].map((h) => (
                  <th key={h} className="text-center py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {permTable.map((row) => (
                <tr key={row.type} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium text-sm">{row.type}</span>
                      {row.sensitive && (
                        <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-semibold">
                          <Lock size={9} /> Nhạy cảm
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">{check(row.admin)}</td>
                  <td className="py-3 px-3 text-center">{check(row.counselor)}</td>
                  <td className="py-3 px-3 text-center">{check(row.teacher)}</td>
                  <td className="py-3 px-3 text-center">{check(row.parent)}</td>
                  <td className="py-3 px-3 text-center">{check(row.student)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Nhật ký hoạt động gần đây</h3>
        <div className="space-y-1.5">
          {[
            { time: "08:31", user: "GV Trần Thị Lan", action: "Cập nhật điểm HK1 lớp 9A", type: "edit" },
            { time: "08:15", user: "Admin Hệ thống", action: "Import Excel lớp 10 — phát hiện 3 lỗi dữ liệu", type: "error" },
            { time: "07:55", user: "CV Nguyễn Văn Minh", action: "Xem hồ sơ Wellbeing HS001 (quyền đã cấp)", type: "sensitive" },
            { time: "07:30", user: "GV Lê Hoàng Nam", action: "Nhập nhận xét 35 học sinh lớp 11C", type: "edit" },
            { time: "Hôm qua", user: "PH Nguyễn Văn Bình", action: "Cập nhật kỳ vọng gia đình học sinh HS001", type: "edit" },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
              <span className="text-xs text-gray-400 font-mono w-16 flex-shrink-0">{log.time}</span>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.type === "error" ? "bg-red-500" : log.type === "sensitive" ? "bg-amber-400" : "bg-green-400"}`} />
              <span className="text-blue-700 font-semibold text-sm flex-shrink-0">{log.user}</span>
              <span className="text-gray-600 text-sm min-w-0 truncate">{log.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Student sub-screens ───────────────────────────────────────────────────────

const StudentDashboard = ({ setView }: { setView: (v: string) => void }) => (
  <div className="space-y-5">
    {/* Hero */}
    <div className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg"
      style={{ background: "linear-gradient(135deg, #F97316 0%, #EC4899 55%, #8B5CF6 100%)" }}>
      <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10" />
      <div className="absolute bottom-3 right-20 w-12 h-12 rounded-full bg-white/10" />
      <div className="relative z-10">
        <p className="text-white/80 text-sm font-semibold">Xin chào 👋</p>
        <h1 className="text-2xl font-bold mt-0.5 mb-1">Minh Anh ơi!</h1>
        <p className="text-white/80 text-sm mb-4">Hôm nay bạn có <strong className="text-white">2 bài học</strong> và <strong className="text-white">1 khảo sát</strong> cần hoàn thành 🌟</p>
        <div className="bg-white/20 rounded-2xl p-3.5 backdrop-blur-sm">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-bold text-white/90">Hồ sơ hướng nghiệp</span>
            <span className="text-xs font-bold text-white">62%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-3 rounded-full bg-white" style={{ width: "62%" }} />
          </div>
          <p className="text-xs text-white/70 mt-1.5">Còn 38% nữa là hoàn thiện hồ sơ! 💪</p>
        </div>
      </div>
    </div>

    {/* To-do nudge */}
    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <span className="text-2xl flex-shrink-0">⚡</span>
      <div className="flex-1">
        <p className="text-sm font-bold text-amber-800">Bạn chưa làm bài khảo sát MBTI!</p>
        <p className="text-xs text-amber-600 mt-0.5">Chỉ 5 phút — biết ngay bạn phù hợp với nghề nào nhé!</p>
      </div>
      <button onClick={() => setView("st-surveys")}
        className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-colors">
        Làm ngay →
      </button>
    </div>

    {/* Quick stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { emoji: "📚", label: "Bài học", value: "8", sub: "2 chưa hoàn thành", bg: "from-orange-400 to-amber-400" },
        { emoji: "📝", label: "Khảo sát", value: "3", sub: "1 đang chờ", bg: "from-pink-500 to-rose-400" },
        { emoji: "✅", label: "Bài tập", value: "5", sub: "Hoàn thành hết", bg: "from-emerald-500 to-teal-400" },
        { emoji: "🎮", label: "Games", value: "12", sub: "4 huy hiệu đạt", bg: "from-violet-500 to-indigo-500" },
      ].map((c) => (
        <div key={c.label} className={`rounded-2xl p-4 bg-gradient-to-br ${c.bg} text-white shadow-sm`}>
          <span className="text-2xl block mb-1">{c.emoji}</span>
          <p className="text-2xl font-bold">{c.value}</p>
          <p className="text-xs font-bold opacity-90">{c.label}</p>
          <p className="text-xs opacity-75 mt-0.5">{c.sub}</p>
        </div>
      ))}
    </div>

    {/* Upcoming */}
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><span>📅</span> Việc cần làm hôm nay</h3>
      <div className="space-y-2">
        {[
          { label: "Xem bài học: Khám phá ngành IT", tag: "Lessons", tagCls: "bg-orange-100 text-orange-700", done: false },
          { label: "Làm khảo sát MBTI", tag: "Surveys", tagCls: "bg-pink-100 text-pink-700", done: false },
          { label: "Nộp bài tập về Career Goals", tag: "Assignment", tagCls: "bg-emerald-100 text-emerald-700", done: true },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.done ? "opacity-50" : "hover:bg-orange-50"} transition-colors`}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}>
              {item.done && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className={`text-sm flex-1 ${item.done ? "line-through text-gray-400" : "text-gray-700 font-medium"}`}>{item.label}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.tagCls}`}>{item.tag}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Quick nav cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { emoji: "📖", title: "Tiếp tục bài học", desc: "Bài 3: Ngành Kỹ thuật phần mềm", action: () => setView("st-lessons"), bg: "bg-orange-50 border-orange-200", btn: "bg-orange-500 text-white" },
        { emoji: "🧭", title: "Khám phá ngành nghề", desc: "Tìm hiểu 200+ ngành nghề phù hợp", action: () => setView("st-explore"), bg: "bg-violet-50 border-violet-200", btn: "bg-violet-500 text-white" },
      ].map((c) => (
        <div key={c.title} className={`rounded-2xl p-4 border-2 ${c.bg} shadow-sm`}>
          <span className="text-3xl block mb-2">{c.emoji}</span>
          <h3 className="font-bold text-gray-800 text-sm mb-1">{c.title}</h3>
          <p className="text-xs text-gray-500 mb-3">{c.desc}</p>
          <button onClick={c.action} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${c.btn} flex items-center gap-1`}>
            Xem ngay <ArrowRight size={11} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const StudentLessons = () => {
  const lessons = [
    { id: 1, title: "Giới thiệu về hướng nghiệp", tag: "Cơ bản", duration: "15 phút", progress: 100, emoji: "🌱" },
    { id: 2, title: "Khám phá sở thích cá nhân", tag: "Cơ bản", duration: "20 phút", progress: 100, emoji: "❤️" },
    { id: 3, title: "Ngành Kỹ thuật phần mềm là gì?", tag: "Khoa học & CN", duration: "25 phút", progress: 60, emoji: "💻" },
    { id: 4, title: "Ngành Y tế & Sức khỏe", tag: "Y tế", duration: "20 phút", progress: 0, emoji: "🩺" },
    { id: 5, title: "Kỹ năng mềm cần thiết", tag: "Kỹ năng", duration: "18 phút", progress: 0, emoji: "🤝" },
    { id: 6, title: "Thiết lập mục tiêu nghề nghiệp", tag: "Kế hoạch", duration: "22 phút", progress: 0, emoji: "🎯" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Bài học 📖</h1>
        <p className="text-sm text-gray-500 mt-0.5">2 / 6 bài đã hoàn thành</p>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-3 rounded-full" style={{ width: "33%", background: "linear-gradient(90deg,#F97316,#FBBF24)" }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lessons.map((l) => (
          <div key={l.id} className={`bg-white rounded-2xl p-4 border-2 flex items-center gap-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${l.progress === 100 ? "border-emerald-200" : l.progress > 0 ? "border-orange-200" : "border-gray-100"}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${l.progress === 100 ? "bg-emerald-100" : l.progress > 0 ? "bg-orange-100" : "bg-gray-100"}`}>
              {l.progress === 100 ? "✅" : l.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-gray-800 text-sm">{l.title}</h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{l.tag}</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">⏱ {l.duration}</p>
              {l.progress > 0 && l.progress < 100 && (
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-32">
                  <div className="h-1.5 rounded-full bg-orange-400" style={{ width: `${l.progress}%` }} />
                </div>
              )}
            </div>
            <button className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${l.progress === 100 ? "bg-emerald-100 text-emerald-700" : l.progress > 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>
              {l.progress === 100 ? "Xem lại" : l.progress > 0 ? "Tiếp tục" : "Bắt đầu"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentSurveys = () => {
  const [step, setStep] = useState<"list" | "quiz" | "result" | "detail">("list");
  const [qIdx, setQIdx] = useState(0);
  const [activeResult, setActiveResult] = useState<"holland" | "mbti" | "skills" | null>(null);
  const [surveys, setSurveys] = useState([
    { id: 1, key: "holland" as const, title: "Bài test Sở thích nghề nghiệp (Holland)", tag: "Holland Code", time: "5 phút", done: true, emoji: "🌟", color: "from-amber-400 to-orange-500" },
    { id: 2, key: "mbti" as const, title: "Trắc nghiệm tính cách MBTI", tag: "Tính cách", time: "8 phút", done: true, emoji: "🧠", color: "from-violet-500 to-pink-500" },
    { id: 3, key: "skills" as const, title: "Đánh giá kỹ năng mềm", tag: "Kỹ năng", time: "6 phút", done: true, emoji: "⚡", color: "from-blue-500 to-cyan-400" },
    { id: 4, key: null, title: "Khảo sát năng lực học tập", tag: "Học tập", time: "7 phút", done: false, emoji: "📚", color: "from-emerald-500 to-teal-400" },
  ]);

  // Detail view for a completed survey result
  if (step === "detail" && activeResult) {
    if (activeResult === "holland") {
      const r = SURVEY_COMPLETED_RESULTS.holland;
      return (
        <div className="space-y-5">
          <button onClick={() => setStep("list")} className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800">
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div className="rounded-3xl p-6 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#F97316,#F59E0B)" }}>
            <p className="text-white/80 text-sm font-semibold mb-1">Mã Holland của bạn</p>
            <h2 className="text-5xl font-black mb-2">{r.code}</h2>
            <p className="text-lg font-bold text-white/90">{r.label}</p>
            <p className="text-white/75 text-sm mt-2 leading-relaxed">{r.desc}</p>
            <p className="text-white/50 text-xs mt-3">Hoàn thành ngày {r.date}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Điểm số 6 nhóm tính cách</h3>
            <div className="space-y-3">
              {r.dims.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-36 flex-shrink-0">{d.label}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${d.score}%`, backgroundColor: d.color }}>
                      <span className="text-white text-xs font-bold" style={{ fontSize: 10 }}>{d.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">🎯 Nghề nghiệp phù hợp nhất</h3>
            <div className="flex flex-wrap gap-2">
              {r.topCareers.map((c) => (
                <span key={c} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold border border-orange-200">{c}</span>
              ))}
            </div>
          </div>
        </div>
      );
    }
    if (activeResult === "mbti") {
      const r = SURVEY_COMPLETED_RESULTS.mbti;
      return (
        <div className="space-y-5">
          <button onClick={() => setStep("list")} className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800">
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div className="rounded-3xl p-6 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)" }}>
            <p className="text-white/80 text-lg mb-1">Kiểu tính cách của bạn</p>
            <h2 className="text-6xl font-black mb-2">{r.type}</h2>
            <p className="text-xl font-bold text-white/90">{r.fullName}</p>
            <p className="text-white/75 text-sm mt-2 leading-relaxed max-w-sm mx-auto">{r.desc}</p>
            <p className="text-white/50 text-xs mt-3">Hoàn thành ngày {r.date}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Phân tích 4 chiều tính cách</h3>
            <div className="space-y-4">
              {r.dims.map((d) => (
                <div key={d.left}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className={d.side === "left" ? "text-violet-700" : "text-gray-400"}>{d.left}</span>
                    <span className={d.side === "right" ? "text-violet-700" : "text-gray-400"}>{d.right}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    {d.side === "left" ? (
                      <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" style={{ width: `${d.score}%` }} />
                    ) : (
                      <div className="h-3 rounded-full bg-gradient-to-l from-violet-500 to-pink-500 absolute right-0" style={{ width: `${d.score}%` }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black text-white drop-shadow">{d.score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 text-sm mb-2">💪 Điểm mạnh</h3>
              <div className="flex flex-wrap gap-1.5">
                {r.strengths.map((s) => <span key={s} className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">{s}</span>)}
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <h3 className="font-bold text-amber-800 text-sm mb-2">📈 Cần phát triển</h3>
              <div className="flex flex-wrap gap-1.5">
                {r.weaknesses.map((s) => <span key={s} className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold">{s}</span>)}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (activeResult === "skills") {
      const r = SURVEY_COMPLETED_RESULTS.skills;
      return (
        <div className="space-y-5">
          <button onClick={() => setStep("list")} className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800">
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div className="rounded-3xl p-6 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)" }}>
            <p className="text-white/80 text-sm font-semibold mb-1">Điểm kỹ năng mềm tổng thể</p>
            <div className="flex items-end gap-3 mb-2">
              <h2 className="text-6xl font-black">{r.overall}</h2>
              <span className="text-2xl text-white/70 mb-1">/100</span>
            </div>
            <p className="text-white/75 text-sm">Hoàn thành ngày {r.date}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Chi tiết từng kỹ năng</h3>
            <div className="space-y-3">
              {r.dims.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">{d.label}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${d.score}%`, backgroundColor: d.color }}>
                      <span className="text-white text-xs font-bold" style={{ fontSize: 10 }}>{d.score}</span>
                    </div>
                  </div>
                  {d.label === r.topStrength && <span className="text-xs text-emerald-600 font-bold flex-shrink-0">Top 💪</span>}
                  {d.label === r.needWork && <span className="text-xs text-amber-600 font-bold flex-shrink-0">Cải thiện</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }

  // Quiz flow
  if (step === "quiz") {
    const qs = [
      { q: "Bạn thích làm việc một mình hay theo nhóm?", opts: ["Một mình, tập trung sâu", "Theo nhóm nhỏ 2-3 người", "Theo nhóm lớn, sôi động", "Tuỳ tình huống"] },
      { q: "Khi gặp vấn đề, bạn thường xử lý bằng cách nào?", opts: ["Phân tích logic từng bước", "Dựa vào trực giác và cảm xúc", "Hỏi ý kiến người khác", "Thử nghiệm nhiều cách"] },
      { q: "Bạn thích lên kế hoạch hay hành động ngẫu hứng?", opts: ["Luôn lên kế hoạch kỹ", "Kế hoạch sơ bộ rồi linh hoạt", "Thích ngẫu hứng, tự do", "Phụ thuộc vào công việc"] },
      { q: "Điều gì thúc đẩy bạn học tập?", opts: ["Muốn đạt thành tích cao", "Yêu thích khám phá kiến thức", "Muốn giúp ích cho mọi người", "Muốn ổn định tương lai"] },
      { q: "Bạn miêu tả bản thân là người như thế nào?", opts: ["Độc lập và tự chủ", "Sáng tạo và nghệ sĩ", "Thực tế và có tổ chức", "Đồng cảm và quan tâm người khác"] },
    ];
    const cur = qs[qIdx];
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-pink-600">Câu {qIdx + 1} / {qs.length}</span>
            <span className="text-xs text-gray-400">{Math.round((qIdx / qs.length) * 100)}% hoàn thành</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${(qIdx / qs.length) * 100}%`, background: "linear-gradient(90deg,#EC4899,#8B5CF6)" }} />
          </div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-pink-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-pink-400 to-violet-500" />
          <div className="p-6">
            <div className="text-4xl text-center mb-4">🤔</div>
            <p className="text-lg font-bold text-gray-900 text-center mb-5">{cur.q}</p>
            <div className="space-y-2.5">
              {cur.opts.map((opt) => (
                <button key={opt}
                  onClick={() => { if (qIdx < qs.length - 1) setQIdx(i => i + 1); else { setStep("result"); setQIdx(0); } }}
                  className="w-full text-left px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-pink-400 hover:bg-pink-50 hover:text-pink-800 transition-all font-semibold text-gray-700 text-sm">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => { setStep("list"); setQIdx(0); }} className="w-full py-2 text-sm text-gray-400 hover:text-gray-600">← Quay lại</button>
      </div>
    );
  }

  // Result after completing quiz
  if (step === "result") {
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center py-2">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">Bài test hoàn thành!</h1>
          <p className="text-gray-500 mt-1 text-sm">Kết quả đã được lưu vào hồ sơ của bạn</p>
        </div>
        <div className="rounded-3xl p-6 text-white text-center shadow-lg" style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)" }}>
          <p className="text-white/80 text-lg mb-1">Kiểu tính cách của bạn là</p>
          <h2 className="text-6xl font-black mb-2">INTJ</h2>
          <p className="text-lg font-bold">Người Kiến trúc sư</p>
          <p className="text-white/75 text-sm mt-2">Chiến lược gia, độc lập, quyết đoán và sáng tạo</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Hướng nội", pct: 72, color: "bg-violet-500" },
            { label: "Trực giác", pct: 65, color: "bg-pink-500" },
            { label: "Tư duy", pct: 81, color: "bg-orange-500" },
            { label: "Kế hoạch", pct: 78, color: "bg-emerald-500" },
          ].map((t) => (
            <div key={t.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">{t.label}</span>
                <span className="text-sm font-bold font-mono">{t.pct}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-2.5 rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setStep("list")} className="w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl text-sm font-bold hover:opacity-90">
          Xem tổng hợp kết quả →
        </button>
      </div>
    );
  }

  // ── Main list view with summary ──────────────────────────────────────────────
  const doneCount = surveys.filter(s => s.done).length;
  const completionPct = Math.round((doneCount / surveys.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Khảo sát & Bài test 📝</h1>
          <p className="text-sm text-gray-500 mt-0.5">{doneCount} / {surveys.length} bài đã hoàn thành</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: `${completionPct}%` }} />
          </div>
          <span className="text-sm font-black text-violet-700">{completionPct}%</span>
        </div>
      </div>

      {/* ── Summary of Results ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="font-bold text-gray-900">Tổng hợp kết quả</h2>
          <span className="ml-auto text-xs text-gray-400 font-medium">Từ {doneCount} bài test đã hoàn thành</span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Holland summary */}
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group"
            style={{ background: "linear-gradient(135deg,#FFF7ED,#FEF3C7)" }}
            onClick={() => { setActiveResult("holland"); setStep("detail"); }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">🌟</span>
              <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded-full">Holland</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Mã sở thích nghề nghiệp</p>
            <p className="text-2xl font-black text-amber-700">{SURVEY_COMPLETED_RESULTS.holland.code}</p>
            <p className="text-xs text-gray-600 mt-1">{SURVEY_COMPLETED_RESULTS.holland.label}</p>
            <p className="text-xs text-amber-600 font-semibold mt-2 group-hover:underline">Xem chi tiết →</p>
          </div>

          {/* MBTI summary */}
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group"
            style={{ background: "linear-gradient(135deg,#F5F3FF,#FDF4FF)" }}
            onClick={() => { setActiveResult("mbti"); setStep("detail"); }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xs text-violet-600 font-bold bg-violet-100 px-2 py-0.5 rounded-full">MBTI</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Kiểu tính cách</p>
            <p className="text-2xl font-black text-violet-700">{SURVEY_COMPLETED_RESULTS.mbti.type}</p>
            <p className="text-xs text-gray-600 mt-1">{SURVEY_COMPLETED_RESULTS.mbti.fullName}</p>
            <p className="text-xs text-violet-600 font-semibold mt-2 group-hover:underline">Xem chi tiết →</p>
          </div>

          {/* Skills summary */}
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group"
            style={{ background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)" }}
            onClick={() => { setActiveResult("skills"); setStep("detail"); }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xs text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-full">Kỹ năng</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">Điểm kỹ năng mềm</p>
            <p className="text-2xl font-black text-blue-700">{SURVEY_COMPLETED_RESULTS.skills.overall}<span className="text-sm text-gray-400 font-normal">/100</span></p>
            <p className="text-xs text-gray-600 mt-1">Top: {SURVEY_COMPLETED_RESULTS.skills.topStrength}</p>
            <p className="text-xs text-blue-600 font-semibold mt-2 group-hover:underline">Xem chi tiết →</p>
          </div>
        </div>

        {/* Key insights bar */}
        <div className="px-5 pb-5">
          <div className="bg-gradient-to-r from-violet-50 to-pink-50 border border-violet-100 rounded-2xl p-4">
            <p className="text-xs font-bold text-violet-800 mb-3 flex items-center gap-1.5">
              ✨ Điểm kết quả chính từ bài test của bạn
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { icon: "🎯", label: "Nhóm nghề phù hợp nhất", value: "Khoa học & Công nghệ", color: "text-orange-700" },
                { icon: "🧩", label: "Kiểu tính cách", value: "INTJ — Kiến trúc sư", color: "text-violet-700" },
                { icon: "💪", label: "Kỹ năng nổi bật", value: "Tư duy phản biện (88/100)", color: "text-blue-700" },
                { icon: "📈", label: "Cần phát triển", value: "Quản lý thời gian", color: "text-amber-700" },
              ].map((k) => (
                <div key={k.label} className="bg-white rounded-xl p-3 shadow-sm">
                  <span className="text-lg block mb-1">{k.icon}</span>
                  <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                  <p className={`text-xs font-bold mt-0.5 ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Survey list ──────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-bold text-gray-800 mb-3">Danh sách bài test</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {surveys.map((s) => (
            <div key={s.id}
              className={`bg-white rounded-2xl border-2 shadow-sm transition-all ${s.done ? "border-emerald-200 hover:shadow-md" : "border-gray-100 hover:border-pink-200"}`}>
              <div className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${s.done ? `bg-gradient-to-br ${s.color}` : "bg-gray-100"}`}>
                  {s.done ? <span className="text-white">{s.emoji}</span> : s.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">{s.tag}</span>
                  </div>
                  <p className="text-xs text-gray-500">⏱ {s.time} {s.done && "· ✅ Đã hoàn thành"}</p>
                </div>
                <button
                  onClick={() => {
                    if (s.done && s.key) { setActiveResult(s.key); setStep("detail"); }
                    else if (!s.done) setStep("quiz");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-colors ${
                    s.done
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90"
                  }`}>
                  {s.done ? "Xem kết quả" : "Bắt đầu →"}
                </button>
              </div>

              {/* Done bar mini-preview */}
              {s.done && s.key === "skills" && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-50 mt-1">
                  <div className="flex gap-1.5">
                    {SURVEY_COMPLETED_RESULTS.skills.dims.slice(0, 4).map((d) => (
                      <div key={d.label} className="flex-1">
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
                          <div className="h-1.5 rounded-full" style={{ width: `${d.score}%`, backgroundColor: d.color }} />
                        </div>
                        <p className="text-xs text-center text-gray-400" style={{ fontSize: 9 }}>{d.score}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {s.done && s.key === "mbti" && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-50 mt-1 flex items-center gap-2">
                  {["I", "N", "T", "J"].map((c, i) => (
                    <div key={c} className="flex-1 text-center py-1 rounded-lg text-sm font-black text-white"
                      style={{ background: ["#8B5CF6", "#EC4899", "#F97316", "#10B981"][i] }}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
              {s.done && s.key === "holland" && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-50 mt-1 flex flex-wrap gap-1.5">
                  {SURVEY_COMPLETED_RESULTS.holland.dims.map((d) => (
                    <div key={d.label} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-gray-500">{d.label.split(" ")[0]}</span>
                      <span className="text-xs font-bold text-gray-700">{d.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentAssignment = () => {
  const assignments = [
    { title: "Viết về ước mơ nghề nghiệp của bạn", due: "28/06/2025", subject: "Hướng nghiệp", done: true, emoji: "✍️" },
    { title: "Nghiên cứu 3 ngành nghề phù hợp", due: "05/07/2025", subject: "Khám phá", done: false, urgent: true, emoji: "🔍" },
    { title: "Lập kế hoạch học tập học kỳ 2", due: "10/07/2025", subject: "Kế hoạch", done: false, urgent: false, emoji: "📋" },
    { title: "Phỏng vấn thử với cố vấn", due: "15/07/2025", subject: "Kỹ năng", done: false, urgent: false, emoji: "🎤" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bài tập ✅</h1>
          <p className="text-sm text-gray-500 mt-0.5">1 hoàn thành · 3 còn lại</p>
        </div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-emerald-600 bg-emerald-100">25%</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assignments.map((a, i) => (
          <div key={i} className={`bg-white rounded-2xl p-4 border-2 flex gap-4 shadow-sm ${a.done ? "border-emerald-200 opacity-75" : a.urgent ? "border-red-200" : "border-gray-100"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${a.done ? "bg-emerald-100" : a.urgent ? "bg-red-50" : "bg-amber-50"}`}>
              {a.done ? "✅" : a.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-bold text-sm ${a.done ? "line-through text-gray-400" : "text-gray-800"}`}>{a.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${a.done ? "bg-emerald-100 text-emerald-700" : a.urgent ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>
                  {a.done ? "Xong" : a.urgent ? "Gấp!" : "Chờ nộp"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">📅 Hạn nộp: {a.due} · 📌 {a.subject}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentGames = () => {
  const games = [
    { emoji: "🏙️", title: "City Builder Career", desc: "Xây dựng thành phố, khám phá 20 nghề nghiệp khác nhau", tag: "Mô phỏng", xp: 150, played: true },
    { emoji: "🔬", title: "Science Lab Adventure", desc: "Thí nghiệm khoa học thú vị — dành cho ai yêu Lý, Hóa", tag: "Khoa học", xp: 200, played: false },
    { emoji: "💼", title: "Mini CEO Challenge", desc: "Điều hành công ty nhỏ, học kỹ năng kinh doanh cơ bản", tag: "Kinh tế", xp: 180, played: false },
    { emoji: "🎨", title: "Design Studio Game", desc: "Tạo ra sản phẩm thiết kế, khám phá ngành sáng tạo", tag: "Nghệ thuật", xp: 120, played: false },
    { emoji: "🩺", title: "Virtual Hospital", desc: "Trải nghiệm làm bác sĩ, y tá trong bệnh viện ảo", tag: "Y tế", xp: 250, played: false },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Real Games 🎮</h1>
        <p className="text-sm text-gray-500 mt-0.5">Khám phá nghề nghiệp qua trò chơi thực tế</p>
      </div>
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl p-4 flex items-center gap-4 text-white shadow-md">
        <span className="text-4xl">🏆</span>
        <div>
          <p className="text-xs text-white/80 font-semibold">Điểm XP của bạn</p>
          <p className="text-3xl font-black">150 XP</p>
          <p className="text-xs text-white/70">Hạng 12 trong lớp 9A</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-white/80">Huy hiệu đạt được</p>
          <div className="flex gap-1 mt-1">
            {["🥉", "🔬", "🌱"].map((b) => <span key={b} className="text-xl">{b}</span>)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <div key={g.title} className={`bg-white rounded-2xl p-4 border-2 flex items-center gap-4 shadow-sm ${g.played ? "border-violet-200" : "border-gray-100 hover:border-violet-200"} transition-all cursor-pointer`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${g.played ? "bg-violet-100" : "bg-gray-100"}`}>
              {g.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-gray-800 text-sm">{g.title}</h3>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{g.tag}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{g.desc}</p>
              <p className="text-xs font-bold text-amber-600">⭐ +{g.xp} XP</p>
            </div>
            <button className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${g.played ? "bg-violet-100 text-violet-700" : "bg-violet-500 text-white"}`}>
              {g.played ? "Chơi lại" : "Chơi ngay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Career detail view
const ExploreCareerDetail = ({
  career, onBack, favorites, onToggleFav, reactions, onReact, onSelectRelated, onNavigateToUni,
}: {
  career: ExploreCareer; onBack: () => void;
  favorites: string[]; onToggleFav: () => void;
  reactions: Record<string, string>; onReact: (actId: string, emoji: string) => void;
  onSelectRelated: (id: string) => void;
  onNavigateToUni?: (uniId: string) => void;
}) => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const likedActivities = Object.entries(reactions)
    .filter(([, e]) => e === "😍" || e === "👍")
    .map(([id]) => career.activities.find(a => a.id === id)?.label)
    .filter(Boolean);

  const relatedData = EXPLORE_CAREERS.filter((c) =>
    c.id !== career.id && career.relatedCareers.some((r) => c.name.includes(r.split(" ")[0]) || r.includes(c.name.split(" ")[0]))
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors">
        <ArrowRight size={13} className="rotate-180" /> Quay lại danh sách
      </button>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-200" style={{ height: 280 }}>
        <img src={career.coverPhoto} alt={career.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block ${career.fieldColor}`}>{career.field}</span>
          <h1 className="text-3xl font-black text-white">{career.name}</h1>
          <p className="text-white/80 text-sm mt-1">{career.desc}</p>
        </div>
        {/* Fav + Why buttons on hero */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setShowWhy(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold shadow-lg hover:opacity-90 transition-opacity"
          >
            💭 Why?
          </button>
          <button
            onClick={onToggleFav}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${favorites.includes(career.id) ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:text-red-500"}`}
          >
            <Heart size={16} fill={favorites.includes(career.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Quick info */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: "Lương tối thiểu", value: career.salaryMin + career.salaryNote, cls: "text-emerald-600" },
          { icon: TrendingUp, label: "Lương tối đa", value: career.salaryMax + career.salaryNote, cls: "text-emerald-700" },
          { icon: GraduationCap, label: "Trình độ", value: career.education, cls: "text-blue-600" },
          { icon: Star, label: "Triển vọng", value: "Rất cao 🔥", cls: "text-orange-600" },
        ].map((info) => (
          <div key={info.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <info.icon size={13} className={info.cls} />
              <span className="text-xs text-gray-500 font-medium">{info.label}</span>
            </div>
            <p className={`text-sm font-bold ${info.cls}`}>{info.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">📋 Mô tả công việc</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{career.fullDesc}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">📷 Hình ảnh thực tế</h3>
            <div className="grid grid-cols-3 gap-2">
              {career.gallery.map((url, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <img src={url} alt={`${career.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">🎬 Video giới thiệu nghề nghiệp</h3>
            <div className="relative rounded-xl overflow-hidden cursor-pointer bg-gray-900" style={{ aspectRatio: "16/9" }} onClick={() => setVideoPlaying(true)}>
              <img src={career.videoThumb} alt="Video thumbnail" className={`w-full h-full object-cover transition-opacity duration-300 ${videoPlaying ? "opacity-40" : "opacity-90"}`} />
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                    <div className="w-0 h-0 ml-1" style={{ borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "18px solid #EA580C" }} />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  <div><p className="text-4xl mb-2">▶</p><p className="text-sm font-semibold opacity-80">Video đang phát...</p></div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">⚡ Kỹ năng cần có</h3>
            <div className="flex flex-wrap gap-2">
              {career.skills.map((s) => (
                <span key={s} className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold">{s}</span>
              ))}
            </div>
          </div>

          {/* Universities section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">🎓 Trường đào tạo ngành này</h3>
              <span className="text-xs text-gray-400 font-medium">{career.universities.length} trường</span>
            </div>
            <div className="divide-y divide-gray-50">
              {career.universities.map((u, i) => {
                const canNav = !!u.uniId && !!onNavigateToUni;
                return (
                  <div
                    key={i}
                    onClick={() => canNav && onNavigateToUni!(u.uniId!)}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors group ${canNav ? "cursor-pointer hover:bg-blue-50" : "hover:bg-orange-50/40"}`}
                  >
                    <span className="text-xs font-black font-mono text-gray-300 w-5 flex-shrink-0">{i + 1}</span>
                    <div className="w-11 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={u.photo} alt={u.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className={`text-xs font-black font-mono ${canNav ? "text-blue-700 group-hover:underline" : "text-gray-700"}`}>{u.shortName}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${u.type === "Công lập" ? "bg-blue-100 text-blue-700" : u.type === "Tư thục" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                          {u.type}
                        </span>
                        {canNav && <span className="text-xs text-blue-500 font-medium hidden group-hover:inline">· Xem trường →</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{u.program}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-black text-emerald-700">{u.score}</div>
                      <div className="text-xs text-gray-400 font-mono">{u.combination}</div>
                    </div>
                    {canNav && <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />}
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-700 font-medium">📌 Điểm chuẩn năm 2024 — chỉ mang tính tham khảo, có thể thay đổi theo năm.</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Why button (collapsed state) */}
          {!showWhy && (
            <button
              onClick={() => setShowWhy(true)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💭</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-orange-700">Tôi thích điều gì?</p>
                  <p className="text-xs text-orange-500">Khám phá cảm xúc với từng hoạt động</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-orange-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Why panel (expanded) */}
          {showWhy && (
            <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">💭 Tôi thích điều gì?</h3>
                  <p className="text-xs text-white/80 mt-0.5">Chọn cảm xúc cho từng hoạt động</p>
                </div>
                <button onClick={() => setShowWhy(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                {career.activities.map((act) => (
                  <div key={act.id} className={`p-3 rounded-xl border-2 transition-all ${reactions[act.id] ? "border-orange-200 bg-orange-50" : "border-gray-100 bg-gray-50"}`}>
                    <p className="text-xs font-medium text-gray-700 mb-2 leading-snug">{act.label}</p>
                    <div className="flex gap-1.5">
                      {REACTIONS.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() => onReact(act.id, reactions[act.id] === r.emoji ? "" : r.emoji)}
                          title={r.label}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all hover:scale-110 ${reactions[act.id] === r.emoji ? "bg-orange-200 ring-2 ring-orange-400 scale-110" : "bg-white border border-gray-200 hover:border-orange-300"}`}
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {likedActivities.length > 0 && (
                <div className="p-3 border-t border-orange-100 bg-amber-50">
                  <p className="text-xs font-bold text-amber-800 mb-1.5">✨ Đã lưu vào sở thích:</p>
                  <div className="flex flex-wrap gap-1">
                    {likedActivities.slice(0, 4).map((a) => (
                      <span key={a} className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">{a?.split(" ").slice(0, 3).join(" ")}...</span>
                    ))}
                    {likedActivities.length > 4 && <span className="text-xs text-amber-700 font-semibold">+{likedActivities.length - 4}</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related careers — small cards with image + name + salary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">🔗 Nghề nghiệp liên quan</h3>
            <div className="space-y-2">
              {relatedData.length > 0 ? relatedData.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelated(rel.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50 transition-colors group text-left"
                >
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={rel.coverPhoto} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-700 transition-colors">{rel.name}</p>
                    <p className="text-xs text-emerald-600 font-semibold">{rel.salaryMin}–{rel.salaryMax}{rel.salaryNote}</p>
                  </div>
                  <ChevronRight size={13} className="text-gray-300 group-hover:text-orange-400 flex-shrink-0" />
                </button>
              )) : (
                career.relatedCareers.slice(0, 4).map((name) => (
                  <div key={name} className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={12} className="text-orange-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 hover:text-orange-700">{name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Career card (grid tile)
const ExploreCareerCard = ({ career, onSelect, isFav, onToggleFav }: {
  career: ExploreCareer; onSelect: () => void;
  isFav: boolean; onToggleFav: (e: React.MouseEvent) => void;
}) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer" onClick={onSelect}>
    {/* Cover photo */}
    <div className="relative overflow-hidden bg-gray-200 flex-shrink-0" style={{ height: 160 }}>
      <img src={career.coverPhoto} alt={career.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <button
        onClick={onToggleFav}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${isFav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
      >
        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
      </button>
    </div>

    {/* Card body */}
    <div className="p-4 flex flex-col flex-1">
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-2 ${career.fieldColor}`}>{career.field}</span>
      <h3 className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline mb-1.5 leading-snug">{career.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-3 flex-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {career.desc}
      </p>

      {/* Education + Salary - no progress bar */}
      <div className="space-y-1.5 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <GraduationCap size={12} className="text-gray-400 flex-shrink-0" />
          <span>{career.education}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp size={12} className="text-emerald-500 flex-shrink-0" />
          <span className="font-bold text-emerald-700">{career.salaryMin} – {career.salaryMax}</span>
          <span className="text-gray-400">{career.salaryNote}</span>
        </div>
      </div>
    </div>
  </div>
);

const ExploreTestModal = ({ onClose, onResults }: { onClose: () => void; onResults: (careers: ExploreCareer[]) => void }) => {
  const [filters, setFilters] = useState<TestFilters>({ minSalary: 0, education: [], demand: [], personality: [], clusters: [], subjects: [] });
  const [step, setStep] = useState<"form" | "results">("form");
  const [results, setResults] = useState<{ career: ExploreCareer; score: number }[]>([]);
  const [showAllClusters, setShowAllClusters] = useState(false);

  const set = <K extends keyof TestFilters>(k: K, v: TestFilters[K]) => setFilters(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    const scored = EXPLORE_CAREERS.map(c => ({ career: c, score: scoreCareer(c, filters) }))
      .sort((a, b) => b.score - a.score);
    setResults(scored);
    setStep("results");
  };

  const SALARY_STEPS = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const salaryLabel = filters.minSalary === 0 ? "Không yêu cầu" : `${filters.minSalary} triệu+/tháng`;

  const visibleClusters = showAllClusters ? CLUSTER_OPTS : CLUSTER_OPTS.slice(0, 4);
  const suggestedClusters = ["Công nghệ & CNTT", "Nghệ thuật & Thiết kế"]; // demo

  const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-0 mb-3">
      <span className="text-sm font-bold text-gray-800 w-44 flex-shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );

  if (step === "results") return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Kết quả khám phá 🎯</h2>
            <p className="text-sm text-gray-500 mt-0.5">Dựa trên tiêu chí bạn đã chọn</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setStep("form")} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              ← Chỉnh lại
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
              <span className="text-lg leading-none">×</span>
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-6 space-y-3">
          {results.map(({ career, score }, i) => {
            const pct = Math.round(score);
            const bar = pct >= 80 ? "from-emerald-500 to-green-400"
              : pct >= 60 ? "from-blue-500 to-sky-400"
              : pct >= 40 ? "from-amber-400 to-yellow-300"
              : "from-gray-300 to-gray-200";
            return (
              <div key={career.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${i === 0 ? "border-emerald-300 bg-emerald-50/40" : i === 1 ? "border-blue-200 bg-blue-50/30" : "border-gray-100 bg-white"}`}
                onClick={() => { onClose(); onResults([career]); }}>
                {/* Rank */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </div>
                {/* Photo */}
                <div className="w-14 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={career.coverPhoto} alt={career.name} className="w-full h-full object-cover" />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-gray-900 text-sm">{career.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${career.fieldColor}`}>{career.field}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={`text-xs font-black font-mono w-8 ${pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-blue-600" : pct >= 40 ? "text-amber-600" : "text-gray-400"}`}>{pct}%</span>
                  </div>
                </div>
                {/* Salary */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-emerald-700">{career.salaryMin}–{career.salaryMax}</p>
                  <p className="text-xs text-gray-400">{career.salaryNote}</p>
                </div>
                <ArrowRight size={14} className="text-gray-300 flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0" style={{ background: "linear-gradient(135deg,#1e3a5f,#2563EB)" }}>
          <div>
            <h2 className="text-lg font-bold text-white">🔍 Test Khám phá Nghề nghiệp</h2>
            <p className="text-sm text-blue-200 mt-0.5">Chọn tiêu chí để tìm ngành nghề phù hợp nhất với bạn</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
            <span className="text-xl leading-none font-light">×</span>
          </button>
        </div>

        {/* Form body */}
        <div className="overflow-y-auto p-6 space-y-7 flex-1">

          {/* Minimum Salary */}
          <div>
            <SectionLabel label="Mức lương tối thiểu" />
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-mono w-20 flex-shrink-0">Không yêu cầu</span>
              <input type="range" min={0} max={50} step={5}
                value={filters.minSalary}
                onChange={(e) => set("minSalary", parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#2563EB" }}
              />
              <span className="text-xs text-gray-400 font-mono w-14 flex-shrink-0 text-right">50 tr+</span>
            </div>
            <div className="mt-2 text-center">
              <span className="inline-block text-sm font-bold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
                {salaryLabel}
              </span>
            </div>
          </div>

          {/* Education */}
          <div>
            <SectionLabel label="Trình độ học vấn" />
            <MultiCheck options={EDU_OPTS.map(e => e.label)} selected={filters.education} onChange={(v) => set("education", v)} cols={2} />
          </div>

          {/* Career Demand */}
          <div>
            <SectionLabel label="Triển vọng ngành" />
            <MultiCheck options={DEMAND_OPTIONS} selected={filters.demand} onChange={(v) => set("demand", v)} cols={4} />
          </div>

          {/* Personality Styles */}
          <div>
            <SectionLabel label="Phong cách cá nhân" />
            <MultiCheck options={PERSONALITY_OPTS} selected={filters.personality} onChange={(v) => set("personality", v)} cols={3} />
          </div>

          {/* Career Clusters */}
          <div>
            <SectionLabel label="Nhóm ngành quan tâm" />
            <div className={`grid gap-2`} style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {visibleClusters.map((o) => {
                const isSuggested = suggestedClusters.includes(o);
                const isSelected = filters.clusters.includes(o);
                return (
                  <button key={o} onClick={() => set("clusters", isSelected ? filters.clusters.filter(x => x !== o) : [...filters.clusters, o])}
                    className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${isSelected ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                      {isSelected && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <div>
                      <span className="font-medium">{o}</span>
                      {isSuggested && <span className="ml-1.5 text-xs text-blue-500 font-semibold">(gợi ý cho bạn)</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            {!showAllClusters && (
              <button onClick={() => setShowAllClusters(true)} className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800">
                <Plus size={14} /> Xem thêm nhóm ngành
              </button>
            )}
          </div>

          {/* School Subjects */}
          <div>
            <SectionLabel label="Môn học yêu thích" />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SUBJECT_OPTS.map((o) => (
                <button key={o} onClick={() => set("subjects", filters.subjects.includes(o) ? filters.subjects.filter(x => x !== o) : [...filters.subjects, o])}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${filters.subjects.includes(o) ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${filters.subjects.includes(o) ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                    {filters.subjects.includes(o) && <CheckCircle size={10} className="text-white" />}
                  </div>
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50">
          <button onClick={() => setFilters({ minSalary: 0, education: [], demand: [], personality: [], clusters: [], subjects: [] })}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
            Đặt lại tất cả
          </button>
          <button onClick={handleSubmit}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
            Tìm ngành phù hợp <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentExplore = ({ onNavigateToUni }: { onNavigateToUni?: (uniId: string) => void }) => {
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState("Tất cả");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<ExploreCareer | null>(null);
  const [showFavs, setShowFavs] = useState(false);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [showTest, setShowTest] = useState(false);

  const toggleFav = (id: string) =>
    setFavorites((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleReact = (actId: string, emoji: string) =>
    setReactions((p) => ({ ...p, [actId]: emoji }));

  const filtered = EXPLORE_CAREERS.filter((c) => {
    if (showFavs && !favorites.includes(c.id)) return false;
    if (activeField !== "Tất cả" && c.field !== activeField) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.field.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selected) return (
    <ExploreCareerDetail
      career={selected} onBack={() => setSelected(null)}
      favorites={favorites} onToggleFav={() => toggleFav(selected.id)}
      reactions={reactions} onReact={handleReact}
      onSelectRelated={(id) => { const c = EXPLORE_CAREERS.find((x) => x.id === id); if (c) setSelected(c); }}
      onNavigateToUni={onNavigateToUni}
    />
  );

  return (
    <div className="space-y-5">
      {showTest && (
        <ExploreTestModal
          onClose={() => setShowTest(false)}
          onResults={(careers) => { if (careers[0]) setSelected(careers[0]); }}
        />
      )}

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Khám phá Ngành nghề 🧭</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tìm hiểu ngành nghề và khám phá điều bạn yêu thích</p>
        </div>
        {/* Test button */}
        <button
          onClick={() => setShowTest(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
        >
          <span className="text-base">🔍</span> Test Khám phá
        </button>
      </div>

      {/* Search + fav filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400"
            placeholder="Tìm ngành nghề..." />
        </div>
        <button onClick={() => setShowFavs((v) => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${showFavs ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-300"}`}>
          <Heart size={14} fill={showFavs ? "currentColor" : "none"} />
          Yêu thích {favorites.length > 0 && `(${favorites.length})`}
        </button>
      </div>

      {/* Field chips */}
      <div className="flex gap-2 flex-wrap">
        {EXPLORE_FIELDS.map((f) => (
          <button key={f} onClick={() => setActiveField(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${activeField === f ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"}`}>
            {f}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 font-medium">{filtered.length} ngành nghề</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((c) => (
            <ExploreCareerCard key={c.id} career={c}
              onSelect={() => setSelected(c)}
              isFav={favorites.includes(c.id)}
              onToggleFav={(e) => { e.stopPropagation(); toggleFav(c.id); }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold">Không tìm thấy kết quả</p>
          <p className="text-sm mt-1">Thử từ khoá khác hoặc bỏ bộ lọc</p>
        </div>
      )}
    </div>
  );
};

const StudentPersonalInfo = () => {
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
                <h2 className="font-bold text-gray-900 text-base">Nguyễn Minh Anh</h2>
                <p className="text-sm text-gray-500">Lớp 9A · HS001</p>
                <p className="text-xs text-orange-600 font-semibold mt-1">THCS Nguyễn Du</p>
              </div>
              <div className="w-full pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Năm học", value: "9" },
                  { label: "ĐTB", value: "8.5" },
                  { label: "Xếp loại", value: "Giỏi" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-sm font-black text-orange-600">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">🏆 Thành tích nổi bật</h3>
              <div className="space-y-2">
                {[
                  { icon: "🥈", text: "Giải Nhì Toán cấp Quận 2024" },
                  { icon: "⭐", text: "Học sinh Giỏi 4 năm liên tiếp" },
                  { icon: "🤖", text: "CLB Robotics — Thành viên tích cực" },
                  { icon: "📜", text: "Chứng chỉ Scratch — Code.org" },
                ].map((a) => (
                  <div key={a.text} className="flex items-start gap-2.5 text-xs text-gray-600">
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
              <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-3">Thông tin cơ bản</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Họ và tên", value: "Nguyễn Minh Anh", type: "text" },
                  { label: "Ngày sinh", value: "15/03/2010", type: "text" },
                  { label: "Giới tính", value: "Nữ", type: "text" },
                  { label: "Lớp hiện tại", value: "9A", type: "text" },
                  { label: "Email học sinh", value: "minhanh@truong.edu.vn", type: "email" },
                  { label: "Số điện thoại", value: "", type: "tel", placeholder: "Chưa cập nhật" },
                  { label: "Địa chỉ", value: "Q.Bình Thạnh, TP.HCM", type: "text" },
                  { label: "Dân tộc", value: "Kinh", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{f.label}</label>
                    <input
                      type={f.type} defaultValue={f.value} placeholder={f.placeholder}
                      onChange={() => setSaved(false)}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-3">Định hướng & Mục tiêu</h3>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Giới thiệu bản thân</label>
                <textarea rows={3} defaultValue="Mình thích lập trình và giải toán. Mơ ước trở thành kỹ sư phần mềm tại Việt Nam."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Nghề nghiệp mơ ước</label>
                <input defaultValue="Kỹ sư Phần mềm / Nhà khoa học Dữ liệu"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Trường ĐH mục tiêu</label>
                <input defaultValue="ĐH Bách Khoa HCM / ĐH FPT / UIT"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>

            <button
              onClick={() => setSaved(true)}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Save size={15} /> Lưu thay đổi
              {saved && <span className="text-white/80 text-xs font-normal">(Đã lưu ✓)</span>}
            </button>
          </div>
        </div>
      )}

      {/* ── Academic History Tab ── */}
      {tab === "academic" && (
        <div className="space-y-5">
          {/* GPA trend chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">📈 Xu hướng điểm trung bình qua các năm</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gpaData}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis key="x" dataKey="year" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis key="y" tick={{ fontSize: 11, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} domain={[6, 10]} />
                <Tooltip key="tip" formatter={(v: number) => [v.toFixed(2), ""]} />
                <Line key="hk1" type="monotone" dataKey="hk1" stroke="#F97316" strokeWidth={2.5} dot={{ r: 4, fill: "#F97316", strokeWidth: 0 }} name="HK1" />
                <Line key="hk2" type="monotone" dataKey="hk2" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }} name="HK2" strokeDasharray="5 3" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-5 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600"><div className="w-4 h-0.5 bg-orange-500 rounded" />Học kỳ 1</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600"><div className="w-4 h-0.5 bg-violet-500 rounded" style={{ borderTop: "2px dashed #8B5CF6" }} />Học kỳ 2</div>
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
                  { label: "ĐTB Học kỳ 1", value: avg(yearData.hk1), color: "from-orange-500 to-amber-400" },
                  { label: "ĐTB Học kỳ 2", value: avg(yearData.hk2), color: "from-violet-500 to-indigo-500" },
                  { label: "ĐTB Cả năm", value: ((parseFloat(avg(yearData.hk1)) + parseFloat(avg(yearData.hk2))) / 2).toFixed(2), color: "from-emerald-500 to-teal-400" },
                ].map((s) => (
                  <div key={s.label} className={`rounded-2xl p-4 bg-gradient-to-br ${s.color} text-white text-center shadow-sm`}>
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
                    <p className="text-xs text-gray-500 font-medium">Danh hiệu</p>
                    <p className="text-sm font-black text-orange-600">{yearData.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Hạnh kiểm</p>
                    <p className="text-sm font-black text-emerald-600">{yearData.conduct}</p>
                  </div>
                </div>
              </div>

              {/* HK1 scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Học kỳ 1</h3>
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">ĐTB {avg(yearData.hk1)}</span>
                </div>
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub, i) => <ScoreBar key={sub} score={yearData.hk1[i]} subject={sub} />)}
                </div>
              </div>

              {/* HK2 scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Học kỳ 2</h3>
                  <span className="text-xs font-black text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">ĐTB {avg(yearData.hk2)}</span>
                </div>
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub, i) => <ScoreBar key={sub} score={yearData.hk2[i]} subject={sub} />)}
                </div>
              </div>
            </div>

            {/* Right: comparison table */}
            <div className="lg:col-span-2 space-y-4">
              {/* Subject comparison */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">So sánh HK1 vs HK2</h3>
                </div>
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">Môn</th>
                      <th className="text-center px-3 py-2.5 text-orange-600 font-semibold">HK1</th>
                      <th className="text-center px-3 py-2.5 text-violet-600 font-semibold">HK2</th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-semibold">±</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SUBJECTS.map((sub, i) => {
                      const diff = yearData.hk2[i] - yearData.hk1[i];
                      return (
                        <tr key={sub} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-700">{sub}</td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-orange-600">{yearData.hk1[i].toFixed(1)}</td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-violet-600">{yearData.hk2[i].toFixed(1)}</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className={`font-bold font-mono ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}>
                              {diff > 0 ? `+${diff.toFixed(1)}` : diff === 0 ? "–" : diff.toFixed(1)}
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
                <h3 className="font-bold text-gray-800 text-sm">Phân tích môn học</h3>
                <div>
                  <p className="text-xs font-bold text-emerald-600 mb-2">💪 Môn mạnh (≥ 8.5)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter((_, i) => ((yearData.hk1[i] + yearData.hk2[i]) / 2) >= 8.5).map((s) => (
                      <span key={s} className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 mb-2">📈 Cần cải thiện (&lt; 7.5)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter((_, i) => ((yearData.hk1[i] + yearData.hk2[i]) / 2) < 7.5).map((s) => (
                      <span key={s} className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">{s}</span>
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

const StudentPortfolio = () => {
  const items = [
    { emoji: "🏆", title: "Giải Nhì Toán cấp Quận 2024", type: "Giải thưởng", date: "11/2024" },
    { emoji: "🤖", title: "Dự án Robot tránh vật cản — CLB Robotics", type: "Dự án", date: "03/2025" },
    { emoji: "💻", title: "App quản lý chi tiêu cá nhân (Python)", type: "Dự án cá nhân", date: "05/2025" },
    { emoji: "📜", title: "Chứng chỉ Scratch cơ bản — Code.org", type: "Chứng chỉ", date: "01/2025" },
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
          <div key={item.title} className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 shadow-sm transition-all">
            <span className="text-3xl block mb-3">{item.emoji}</span>
            <h3 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">{item.type}</span>
              <span className="text-xs text-gray-400 font-mono">{item.date}</span>
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

const StudentResume = () => (
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
            <h2 className="text-xl font-black text-gray-900">Nguyễn Minh Anh</h2>
            <p className="text-sm text-gray-500">Học sinh lớp 9A · THCS Nguyễn Du</p>
            <p className="text-xs text-orange-600 font-semibold mt-0.5">Định hướng: Kỹ thuật phần mềm</p>
          </div>
        </div>
        {[
          { title: "🎯 Mục tiêu", content: "Phát triển kỹ năng lập trình và công nghệ để trở thành kỹ sư phần mềm tại công ty công nghệ hàng đầu Việt Nam." },
          { title: "📚 Học tập", content: "Học sinh giỏi 3 năm liên tiếp · Điểm TB: 8.5 · Giỏi Toán, Tin học, Vật lý" },
          { title: "🏆 Thành tích", content: "Giải Nhì Toán cấp Quận 2024 · Dự án Robot CLB Robotics · App Python cá nhân" },
          { title: "⚙️ Kỹ năng", content: "Lập trình Python cơ bản · Scratch · Tư duy logic · Làm việc nhóm · Tiếng Anh B1" },
        ].map((s) => (
          <div key={s.title} className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-1.5">{s.title}</h3>
            <p className="text-sm text-gray-600">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const StudentApplicationResults = () => {
  const items = [
    { school: "THPT Chuyên Lê Hồng Phong", program: "Chuyên Toán - Tin", status: "pending", date: "20/07/2025", emoji: "🏫" },
    { school: "THPT Trần Đại Nghĩa", program: "Lớp thường", status: "accepted", date: "15/07/2025", emoji: "✅" },
    { school: "Học bổng Toán cấp Thành phố", program: "Đợt 1/2025", status: "reviewing", date: "30/06/2025", emoji: "🎓" },
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
          <div key={item.school} className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{item.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.school}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{item.program}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusMap[item.status].cls}`}>{statusMap[item.status].label}</span>
                <span className="text-xs text-gray-400 font-mono">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentPlanGrade = () => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">Kế hoạch theo Lớp 📅</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        { grade: "Lớp 9 (Hiện tại)", color: "from-orange-500 to-amber-400", items: ["Hoàn thiện hồ sơ hướng nghiệp 100%", "Làm đủ 4 bài test tính cách & năng lực", "Tham gia CLB Robotics & Tin học", "Ôn thi lên lớp 10 — Toán, Văn, Anh"], active: true },
        { grade: "Lớp 10", color: "from-emerald-500 to-teal-400", items: ["Chọn tổ hợp môn phù hợp (A00, A01...)", "Học thêm lập trình Python / C++", "Tham gia dự án STEM cấp trường", "Khám phá thêm 5–10 ngành nghề"], active: false },
        { grade: "Lớp 11", color: "from-violet-500 to-indigo-400", items: ["Thi thử ĐGNL / ĐGTD", "Xây dựng portfolio cá nhân", "Học chứng chỉ quốc tế IELTS/SAT", "Tham quan các trường ĐH mục tiêu"], active: false },
        { grade: "Lớp 12", color: "from-pink-500 to-rose-400", items: ["Nộp hồ sơ xét tuyển ĐH", "Thi THPT Quốc gia", "Phỏng vấn học bổng", "Chuẩn bị tài chính cho ĐH"], active: false },
      ].map((plan) => (
        <div key={plan.grade} className={`rounded-2xl overflow-hidden shadow-sm border-2 ${plan.active ? "border-orange-200" : "border-gray-100"}`}>
          <div className={`p-3 bg-gradient-to-r ${plan.color} text-white flex items-center justify-between`}>
            <span className="font-bold text-sm">{plan.grade}</span>
            {plan.active && <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold">Đang thực hiện</span>}
          </div>
          <div className="bg-white p-4">
            <ul className="space-y-2">
              {plan.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${plan.active ? "bg-orange-400" : "bg-gray-300"}`} />
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

const StudentPlanPathways = () => {
  const pathways = [
    { emoji: "💻", title: "Con đường Kỹ thuật phần mềm", match: 92, steps: ["Lớp 9: Học Scratch, Python cơ bản", "Lớp 10–11: C++, Web, App", "Lớp 12: Portfolio + thi ĐH CNTT", "ĐH: Kỹ thuật phần mềm — UIT, BK HCM"], grad: "from-violet-500 to-indigo-500" },
    { emoji: "🔬", title: "Con đường Khoa học dữ liệu", match: 81, steps: ["Lớp 9–10: Toán xác suất + Python", "Lớp 11: Machine Learning cơ bản", "Lớp 12: Dự án data thực tế", "ĐH: Toán tin, Khoa học máy tính"], grad: "from-blue-500 to-cyan-400" },
    { emoji: "⚙️", title: "Con đường Kỹ thuật điện tử", match: 71, steps: ["Lớp 9–10: Điện tử cơ bản, Arduino", "Lớp 11: Robotics, IoT", "Lớp 12: Dự án kỹ thuật cấp trường", "ĐH: Điện tử viễn thông — BK, ĐH Bách Khoa"], grad: "from-teal-500 to-emerald-400" },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Lộ trình Ngành nghề 🗺️</h1>
      <p className="text-sm text-gray-500">3 con đường nghề nghiệp phù hợp nhất với bạn, được cá nhân hoá dựa trên hồ sơ của bạn.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {pathways.map((p, i) => (
          <div key={p.title} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
            <div className={`h-2 bg-gradient-to-r ${p.grad}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⭐ Phù hợp nhất</span>}
                  </div>
                  <h3 className="font-bold text-gray-900 mt-0.5">{p.title}</h3>
                </div>
                <span className="text-sm font-black font-mono text-gray-800">{p.match}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className={`h-2 rounded-full bg-gradient-to-r ${p.grad}`} style={{ width: `${p.match}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {p.steps.map((step, j) => (
                  <div key={j} className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 text-xs text-gray-600">
                    <span className="text-base flex-shrink-0">{"🌱📈🚀🎓"[j]}</span>
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
const UniversityCard = ({ uni, onSelect, isFav, onToggleFav }: {
  uni: University; onSelect: () => void;
  isFav: boolean; onToggleFav: (e: React.MouseEvent) => void;
}) => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer" onClick={onSelect}>
    <div className="relative overflow-hidden bg-gray-200 flex-shrink-0" style={{ height: 148 }}>
      <img src={uni.coverPhoto} alt={uni.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <button
        onClick={onToggleFav}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 transition-all ${isFav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
      >
        <Heart size={13} fill={isFav ? "currentColor" : "none"} />
      </button>
      <div className="absolute bottom-2 left-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${uni.typeColor}`}>{uni.type}</span>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      {/* Short name badge */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-black text-gray-400 font-mono">{uni.shortName}</span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-500 truncate">{uni.location}</span>
      </div>
      <h3 className="text-sm font-bold text-blue-700 hover:text-blue-900 leading-snug mb-2">{uni.name}</h3>
      <p className="text-xs text-gray-500 mb-3 flex-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {uni.desc}
      </p>
      {/* Top major chips */}
      <div className="flex flex-wrap gap-1 mb-3">
        {uni.majors.slice(0, 2).map((m) => (
          <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
        ))}
        {uni.majors.length > 2 && <span className="text-xs text-gray-400">+{uni.majors.length - 2}</span>}
      </div>
      <div className="pt-2.5 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <GraduationCap size={11} className="text-gray-400 flex-shrink-0" />
          <span>Điểm chuẩn: <span className="font-semibold text-gray-800">{uni.admissionScore}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <TrendingUp size={11} className="text-emerald-500 flex-shrink-0" />
          <span className="font-bold text-emerald-700">{uni.tuitionMin}–{uni.tuitionMax}</span>
          <span className="text-gray-400">{uni.tuitionNote}</span>
        </div>
      </div>
    </div>
  </div>
);

// University detail
const UniversityDetail = ({ uni, onBack, favorites, onToggleFav, reactions, onReact, onSelectRelated }: {
  uni: University; onBack: () => void;
  favorites: string[]; onToggleFav: () => void;
  reactions: Record<string, string>; onReact: (id: string, emoji: string) => void;
  onSelectRelated: (id: string) => void;
}) => {
  const [showWhy, setShowWhy] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const liked = Object.entries(reactions).filter(([, e]) => e === "😍" || e === "👍")
    .map(([id]) => uni.activities.find(a => a.id === id)?.label).filter(Boolean);
  const relatedUnis = UNIVERSITIES.filter(u => u.id !== uni.id && uni.related.includes(u.id));

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
        <ArrowRight size={13} className="rotate-180" /> Quay lại danh sách
      </button>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-200" style={{ height: 280 }}>
        <img src={uni.coverPhoto} alt={uni.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${uni.typeColor}`}>{uni.type}</span>
            <span className="text-white/80 text-xs">📍 {uni.location}</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">{uni.name}</h1>
          <p className="text-sm font-bold text-white/60 font-mono mt-0.5">{uni.shortName} · {uni.ranking}</p>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setShowWhy(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-lg hover:opacity-90">
            💭 Why?
          </button>
          <button onClick={onToggleFav}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${favorites.includes(uni.id) ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:text-red-500"}`}>
            <Heart size={16} fill={favorites.includes(uni.id) ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: "Học phí/năm", value: `${uni.tuitionMin}–${uni.tuitionMax}`, cls: "text-emerald-600" },
          { icon: GraduationCap, label: "Điểm chuẩn", value: uni.admissionScore, cls: "text-blue-600" },
          { icon: Star, label: "Xếp hạng", value: uni.ranking, cls: "text-orange-600" },
          { icon: MapPin, label: "Địa điểm", value: uni.location.split(" / ")[0], cls: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon size={13} className={s.cls} />
              <span className="text-xs text-gray-500 font-medium">{s.label}</span>
            </div>
            <p className={`text-sm font-bold ${s.cls} leading-snug`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">🏫 Giới thiệu trường</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{uni.fullDesc}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">📚 Ngành đào tạo nổi bật</h3>
            <div className="flex flex-wrap gap-2">
              {uni.majors.map((m) => (
                <span key={m} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${m === uni.topMajor ? "bg-blue-500 text-white border-blue-500" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                  {m === uni.topMajor && "⭐ "}{m}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">📷 Hình ảnh khuôn viên</h3>
            <div className="grid grid-cols-3 gap-2">
              {uni.gallery.map((url, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
                  <img src={url} alt={`${uni.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">🎬 Video giới thiệu trường</h3>
            <div className="relative rounded-xl overflow-hidden cursor-pointer bg-gray-900" style={{ aspectRatio: "16/9" }} onClick={() => setVideoPlaying(true)}>
              <img src={uni.videoThumb} alt="Video" className={`w-full h-full object-cover transition-opacity ${videoPlaying ? "opacity-30" : "opacity-90"}`} />
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                    <div className="w-0 h-0 ml-1" style={{ borderTop: "10px solid transparent", borderBottom: "10px solid transparent", borderLeft: "18px solid #2563EB" }} />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                  <div><p className="text-4xl mb-2">▶</p><p className="text-sm opacity-80">Video đang phát...</p></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* Why collapsed */}
          {!showWhy && (
            <button onClick={() => setShowWhy(true)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💭</span>
                <div className="text-left">
                  <p className="text-sm font-bold text-blue-700">Tôi thích điều gì?</p>
                  <p className="text-xs text-blue-500">Khám phá cuộc sống sinh viên ở đây</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          {/* Why expanded */}
          {showWhy && (
            <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold">💭 Tôi thích điều gì?</h3>
                  <p className="text-xs text-white/80 mt-0.5">Chọn cảm xúc với từng trải nghiệm</p>
                </div>
                <button onClick={() => setShowWhy(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
                  <ChevronDown size={14} />
                </button>
              </div>
              <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                {uni.activities.map((act) => (
                  <div key={act.id} className={`p-3 rounded-xl border-2 transition-all ${reactions[act.id] ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}`}>
                    <p className="text-xs font-medium text-gray-700 mb-2 leading-snug">{act.label}</p>
                    <div className="flex gap-1.5">
                      {UNI_REACTIONS.map((r) => (
                        <button key={r.emoji}
                          onClick={() => onReact(act.id, reactions[act.id] === r.emoji ? "" : r.emoji)}
                          title={r.label}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all hover:scale-110 ${reactions[act.id] === r.emoji ? "bg-blue-200 ring-2 ring-blue-400 scale-110" : "bg-white border border-gray-200 hover:border-blue-300"}`}>
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {liked.length > 0 && (
                <div className="p-3 border-t border-blue-100 bg-indigo-50">
                  <p className="text-xs font-bold text-indigo-800 mb-1.5">✨ Đã lưu vào sở thích:</p>
                  <div className="flex flex-wrap gap-1">
                    {liked.slice(0, 4).map((a) => (
                      <span key={a} className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-medium">{a?.split(" ").slice(0, 3).join(" ")}...</span>
                    ))}
                    {liked.length > 4 && <span className="text-xs text-indigo-600 font-semibold">+{liked.length - 4}</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related universities */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">🔗 Trường liên quan</h3>
            <div className="space-y-2">
              {relatedUnis.map((rel) => (
                <button key={rel.id} onClick={() => onSelectRelated(rel.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50 transition-colors group text-left">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={rel.coverPhoto} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate group-hover:text-blue-700">{rel.shortName} – {rel.name.split(" ").slice(-2).join(" ")}</p>
                    <p className="text-xs text-emerald-600 font-semibold">{rel.tuitionMin}–{rel.tuitionMax}{rel.tuitionNote}</p>
                  </div>
                  <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentUniversities = ({ initialUniId }: { initialUniId?: string | null }) => {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<University | null>(
    initialUniId ? (UNIVERSITIES.find(u => u.id === initialUniId) ?? null) : null
  );
  const [showFavs, setShowFavs] = useState(false);
  const [reactions, setReactions] = useState<Record<string, string>>({});

  const toggleFav = (id: string) =>
    setFavorites((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const handleReact = (id: string, emoji: string) =>
    setReactions((p) => ({ ...p, [id]: emoji }));

  const filtered = UNIVERSITIES.filter((u) => {
    if (showFavs && !favorites.includes(u.id)) return false;
    if (activeType !== "Tất cả" && u.type !== activeType) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.shortName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selected) return (
    <UniversityDetail
      uni={selected} onBack={() => setSelected(null)}
      favorites={favorites} onToggleFav={() => toggleFav(selected.id)}
      reactions={reactions} onReact={handleReact}
      onSelectRelated={(id) => { const u = UNIVERSITIES.find(x => x.id === id); if (u) setSelected(u); }}
    />
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Khám phá Đại học 🎓</h1>
        <p className="text-sm text-gray-500 mt-0.5">Tìm hiểu các trường đại học phù hợp với bạn</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-52">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400"
            placeholder="Tìm trường, ngành..." />
        </div>
        <button onClick={() => setShowFavs(v => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${showFavs ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-300"}`}>
          <Heart size={14} fill={showFavs ? "currentColor" : "none"} />
          Yêu thích {favorites.length > 0 && `(${favorites.length})`}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {UNI_TYPES.map((t) => (
          <button key={t} onClick={() => setActiveType(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${activeType === t ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"}`}>
            {t}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-500 font-medium">{filtered.length} trường đại học</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((u) => (
            <UniversityCard key={u.id} uni={u}
              onSelect={() => setSelected(u)}
              isFav={favorites.includes(u.id)}
              onToggleFav={(e) => { e.stopPropagation(); toggleFav(u.id); }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎓</p>
          <p className="font-semibold">Không tìm thấy trường</p>
          <p className="text-sm mt-1">Thử từ khoá khác hoặc bỏ bộ lọc</p>
        </div>
      )}
    </div>
  );
};

const MessengerView = ({ role }: { role: string }) => {
  const contacts = role === "student" ? CONTACTS_FOR_STUDENT : CONTACTS_FOR_COUNSELOR;
  const [activeContact, setActiveContact] = useState<ChatContact>(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "me", text: input.trim(), time: new Date().toLocaleTimeString("vi", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  const avatarGrad = role === "student"
    ? "from-orange-400 to-pink-500"
    : "from-blue-500 to-indigo-600";

  return (
    <div className="h-[calc(100vh-7.5rem)] flex gap-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Contact list */}
      <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3">Tin nhắn 💬</h2>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-50 ${activeContact.id === c.id ? "bg-orange-50 border-l-4 border-l-orange-500" : "hover:bg-gray-50"}`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-800 truncate">{c.name}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{c.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">{c.lastMsg}</p>
                  {c.unread > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{c.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold flex-shrink-0`}>
            {activeContact.avatar}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{activeContact.name}</p>
            <p className="text-xs text-gray-500">{activeContact.role}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-gray-500">Đang hoạt động</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
              {msg.from === "them" && (
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1`}>
                  {activeContact.avatar}
                </div>
              )}
              <div className={`max-w-xs lg:max-w-md ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === "me" ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}>
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity flex-shrink-0"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdvisementNotesStudent = () => {
  const [notes, setNotes] = useState<AdviceNote[]>(SAMPLE_NOTES);
  const [selected, setSelected] = useState<AdviceNote | null>(null);

  const markRead = (id: number) => {
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notes.filter((n) => !n.read).length;
  const priorityCls: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const priorityLabel: Record<string, string> = { high: "Quan trọng", medium: "Lưu ý", low: "Thông tin" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lời khuyên từ Giáo viên 📬</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? <span className="text-orange-600 font-semibold">{unreadCount} lời khuyên chưa đọc</span> : "Tất cả đã đọc ✓"}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">{unreadCount}</span>
        )}
      </div>

      {selected ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-800">
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-pink-500" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[selected.priority]} mb-2 inline-block`}>{priorityLabel[selected.priority]}</span>
                  <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-5 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selected.from.charAt(selected.from.lastIndexOf(" ") + 1)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{selected.from}</p>
                  <p className="text-xs text-gray-500">{selected.date}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => { markRead(selected.id); setSelected(null); }}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:opacity-90"
                >
                  ✓ Đã đọc & Hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => { setSelected(note); markRead(note.id); }}
              className={`bg-white rounded-2xl p-5 border-2 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${!note.read ? "border-orange-300" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[note.priority]}`}>{priorityLabel[note.priority]}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!note.read && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  <span className="text-xs text-gray-400 font-mono">{note.date}</span>
                </div>
              </div>
              <h3 className={`text-sm font-bold mb-1 ${!note.read ? "text-gray-900" : "text-gray-700"}`}>{note.subject}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{note.body}</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {note.from.charAt(note.from.lastIndexOf(" ") + 1)}
                </div>
                <span className="text-xs text-gray-600 font-medium">{note.from}</span>
                {!note.read && <span className="ml-auto text-xs font-bold text-orange-600">Chưa đọc →</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AdvisementNotesCounselor = () => {
  const [notes, setNotes] = useState<(AdviceNote & { to: string })[]>([
    { id: 1, from: "Thầy Nguyễn Văn Minh", to: "Nguyễn Minh Anh", subject: "Lộ trình học tập học kỳ 2", body: "Minh Anh ơi, dựa trên kết quả test MBTI và Holland của em, thầy khuyên em nên chọn tổ hợp A01...", date: "20/06/2025", read: false, priority: "high" },
    { id: 2, from: "Thầy Nguyễn Văn Minh", to: "Trần Đức Huy", subject: "Định hướng nghề nghiệp phù hợp", body: "Dựa trên kết quả khảo sát, em phù hợp với nhóm ngành Kinh tế và Quản trị...", date: "18/06/2025", read: true, priority: "medium" },
    { id: 3, from: "Thầy Nguyễn Văn Minh", to: "Hoàng Thị Mai", subject: "Chuẩn bị hồ sơ Y khoa", body: "Hồ sơ y khoa cần điểm Sinh-Hóa rất cao. Em cần tập trung ôn luyện...", date: "15/06/2025", read: true, priority: "high" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ to: "", subject: "", body: "", priority: "medium" as "high" | "medium" | "low" });

  const send = () => {
    if (!form.to || !form.subject || !form.body) return;
    const newNote = { id: Date.now(), from: "Thầy Nguyễn Văn Minh", to: form.to, subject: form.subject, body: form.body, date: new Date().toLocaleDateString("vi"), read: false, priority: form.priority };
    setNotes((prev) => [newNote, ...prev]);
    setForm({ to: "", subject: "", body: "", priority: "medium" });
    setShowForm(false);
  };

  const priorityCls: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const priorityLabel: Record<string, string> = { high: "Quan trọng", medium: "Lưu ý", low: "Thông tin" };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Lời khuyên cho Học sinh 📝</h1>
          <p className="text-sm text-gray-500 mt-0.5">{notes.length} lời khuyên đã gửi</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={15} /> Tạo lời khuyên mới
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><FileText size={16} className="text-blue-600" /> Soạn lời khuyên mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Gửi đến học sinh</label>
              <select value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Chọn học sinh --</option>
                {CONTACTS_FOR_COUNSELOR.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Mức độ ưu tiên</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="high">🔴 Quan trọng</option>
                <option value="medium">🟡 Lưu ý</option>
                <option value="low">⚪ Thông tin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Tiêu đề</label>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="VD: Lộ trình học tập học kỳ 2..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Nội dung lời khuyên</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={5} placeholder="Nhập lời khuyên chi tiết dành cho học sinh..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex gap-3 pt-1 border-t border-gray-100">
            <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Huỷ</button>
            <button onClick={send} disabled={!form.to || !form.subject || !form.body}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
              <ArrowRight size={14} /> Gửi lời khuyên
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[note.priority]}`}>{priorityLabel[note.priority]}</span>
              <span className="text-xs text-gray-400 font-mono">{note.date}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{note.subject}</h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{note.body}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {note.to.split(" ").pop()?.charAt(0)}
                </div>
                <span className="text-xs text-gray-600 font-semibold">→ {note.to}</span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${note.read ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                {note.read ? "Đã đọc ✓" : "Chưa đọc"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Counselor Views ───────────────────────────────────────────────────────────

/* ── Dashboard ── */
const CounselorDashboard = () => {
  const gradeCompletionData = [
    { grade: "Lớp 6", done: 42, total: 62 },
    { grade: "Lớp 7", done: 55, total: 70 },
    { grade: "Lớp 8", done: 61, total: 65 },
    { grade: "Lớp 9", done: 74, total: 80 },
    { grade: "Lớp 10", done: 82, total: 95 },
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
        <p className="text-sm text-gray-500 mt-0.5">Tổng quan hoạt động học sinh · Năm học 2024–2025</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Học sinh quản lý" value="128" sub="8 lớp, 4 khối" icon={Users} color="blue" trend="+3 so với năm ngoái" />
        <StatCard title="Bài học đã giao" value="24" sub="18 đã hoàn thành" icon={BookOpen} color="green" />
        <StatCard title="Khảo sát hoàn thành" value="73%" sub="94 / 128 HS" icon={ClipboardList} color="yellow" trend="+12% tháng này" />
        <StatCard title="Cần hỗ trợ" value="11 HS" sub="Ưu tiên cao" icon={AlertTriangle} color="red" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Hoạt động trong tuần</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} barSize={14}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis key="x" dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis key="y" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip key="tip" />
              <Bar key="lessons" dataKey="lessons" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Bài học" />
              <Bar key="surveys" dataKey="surveys" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Khảo sát" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-600"><div className="w-3 h-3 rounded bg-blue-500" />Bài học</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-600"><div className="w-3 h-3 rounded bg-amber-400" />Khảo sát</div>
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
                    <span className="font-mono font-bold">{g.done}/{g.total}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">🔴 Học sinh cần hỗ trợ ngay</h3>
          <div className="space-y-2.5">
            {studentsInClass.filter(s => s.risk === "high" || s.risk === "medium").map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50">
                <Avatar name={s.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 font-mono">{s.id} · Hồ sơ {s.progress}%</p>
                </div>
                <RiskBadge level={s.risk} />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">📅 Lịch tư vấn sắp tới</h3>
          <div className="space-y-2.5">
            {[
              { name: "Nguyễn Minh Anh", date: "Hôm nay 14:00", type: "Định hướng học kỳ", cls: "bg-orange-100 text-orange-700" },
              { name: "Hoàng Thị Mai", date: "Ngày mai 09:30", type: "Review career test", cls: "bg-blue-100 text-blue-700" },
              { name: "Trần Đức Huy", date: "28/06 15:00", type: "Tư vấn chọn ngành", cls: "bg-emerald-100 text-emerald-700" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.date}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.cls}`}>{a.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Student Detail (6 tabs) ── */
const CounselorStudentDetail = ({ student, onBack }: { student: typeof studentsInClass[0]; onBack: () => void }) => {
  const [tab, setTab] = useState("academic");
  const [wellbeingUnlocked, setWellbeingUnlocked] = useState(false);
  const tabs = [
    { id: "academic", label: "Academic Profile" },
    { id: "personal", label: "Personal Statement" },
    { id: "career", label: "Career Profile" },
    { id: "wellbeing", label: "Wellbeing", locked: true },
    { id: "parent", label: "Kỳ vọng PH" },
    { id: "alumni", label: "Alumni" },
  ];
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800">
        <ArrowRight size={13} className="rotate-180" /> Quay lại danh sách
      </button>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="p-5 flex items-start gap-4 flex-wrap">
          <Avatar name={student.name} size="lg" />
          <div className="flex-1 min-w-48">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Mã HS: <span className="font-mono">{student.id}</span> · Lớp 9A · GVCN: Cô Trần Thị Lan</p>
              </div>
              <RiskBadge level={student.risk} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              {[
                { label: "Học lực", value: student.avg >= 8 ? "Giỏi" : student.avg >= 6.5 ? "Khá" : "Trung bình", cls: student.avg >= 8 ? "text-green-600" : "text-blue-600" },
                { label: "Career Fit", value: student.careerFit, cls: "text-indigo-600" },
                { label: "Hồ sơ", value: `${student.progress}%`, cls: "text-orange-600" },
                { label: "Test", value: student.testStatus, cls: student.testStatus === "Hoàn thành" ? "text-emerald-600" : "text-amber-600" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className={`text-sm font-bold mt-0.5 ${item.cls}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 border-t border-gray-100">
          <div className="flex gap-0 overflow-x-auto -mb-px">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => !t.locked && setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {t.label}{t.locked && <Lock size={11} className="opacity-60" />}
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
              <LineChart data={academicTrend}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis key="x" dataKey="term" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis key="y" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[6, 10]} />
                <Tooltip key="tip" />
                <Line key="l" type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="ĐTB" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Điểm số theo môn</h3>
            <div className="space-y-2.5">
              {[["Toán", 9.5, "strong"], ["Vật lý", 8.8, "strong"], ["Tin học", 9.2, "strong"], ["Ngữ văn", 7.1, "neutral"], ["Lịch sử", 6.4, "weak"]].map(([s, v, t]) => (
                <div key={s as string} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-20 flex-shrink-0">{s as string}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2"><div className={`h-2 rounded-full ${t === "strong" ? "bg-emerald-500" : t === "weak" ? "bg-red-400" : "bg-blue-400"}`} style={{ width: `${((v as number) / 10) * 100}%` }} /></div>
                  <span className={`text-xs font-mono font-bold w-8 text-right ${t === "strong" ? "text-emerald-600" : t === "weak" ? "text-red-500" : "text-blue-600"}`}>{(v as number).toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <strong>Thành tích:</strong> Giải Nhì Toán cấp Quận 2024 · HS Giỏi 3 năm
            </div>
          </div>
        </div>
      )}
      {tab === "personal" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Personal Statement</h3>
          {[
            { label: "Suy nghĩ & Mục tiêu", value: "Em muốn trở thành kỹ sư phần mềm và góp phần xây dựng sản phẩm công nghệ có ích cho xã hội." },
            { label: "Sở thích cá nhân", value: "Lập trình, giải toán, chơi chess, đọc sách công nghệ." },
            { label: "Điểm mạnh", value: "Tư duy logic tốt, kiên nhẫn, chủ động học hỏi." },
            { label: "Cần cải thiện", value: "Kỹ năng giao tiếp, quản lý thời gian." },
            { label: "Động lực học tập", value: "Muốn tạo ra sản phẩm mình tự hào và có cuộc sống ổn định." },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{f.label}</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{f.value}</p>
            </div>
          ))}
        </div>
      )}
      {tab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Bản đồ kỹ năng</h3>
            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={studentSkills}>
                <PolarGrid key="pg" stroke="#e5e7eb" />
                <PolarAngleAxis key="pa" dataKey="skill" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <PolarRadiusAxis key="pr" domain={[0, 100]} tick={false} axisLine={false} />
                <Radar key="r" name="Điểm" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 mb-2">Kết quả bài test</h3>
            {[["MBTI", "INTJ — Kiến trúc sư"], ["Holland Code", "I–C–R (Nghiên cứu)"], ["Career Match Top 1", "Kỹ sư Phần mềm 92%"], ["Nhóm ngành", "Khoa học & Công nghệ"]].map(([k, v]) => (
              <div key={k as string} className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
                <span className="text-xs text-gray-500 font-medium">{k as string}</span>
                <span className="text-xs font-bold text-blue-700">{v as string}</span>
              </div>
            ))}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 mt-2">
              <strong>Lộ trình gợi ý:</strong> Tổ hợp A01 · Python/C++ · Tham gia CLB Robotics
            </div>
          </div>
        </div>
      )}
      {tab === "wellbeing" && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock size={22} className="text-gray-400" />
          </div>
          <h3 className="font-bold text-gray-700 mb-2">Dữ liệu Wellbeing — Bảo mật</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">Thông tin sức khỏe tinh thần chỉ hiển thị với cố vấn được cấp quyền đặc biệt.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-5">
            <AlertTriangle size={14} /> Học sinh này cần hỗ trợ thêm
          </div>
          <div>
            {wellbeingUnlocked ? (
              <div className="space-y-3 text-left max-w-md mx-auto">
                {[["Trạng thái cảm xúc", "Ổn định, đôi khi lo lắng về tương lai"], ["Áp lực học tập", "Trung bình — đang được theo dõi"], ["Hỗ trợ cần thiết", "Tư vấn định kỳ mỗi 2 tuần"]].map(([k, v]) => (
                  <div key={k as string} className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs font-bold text-red-700 mb-0.5">{k as string}</p>
                    <p className="text-sm text-gray-700">{v as string}</p>
                  </div>
                ))}
              </div>
            ) : (
              <button onClick={() => setWellbeingUnlocked(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700">
                Xem với quyền Cố vấn
              </button>
            )}
          </div>
        </div>
      )}
      {tab === "parent" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Kỳ vọng & Tài chính Phụ huynh</h3>
          {[["Định hướng", "Học trong nước, ưu tiên Bách Khoa hoặc UIT"], ["Kỳ vọng", "Con trở thành kỹ sư CNTT có thu nhập ổn định"], ["Ngân sách ĐH", "50–100 triệu/năm"], ["Du học", "Chưa có kế hoạch, có thể xem xét học bổng"], ["Đầu tư học thêm", "Sẵn sàng cho lập trình, ngoại ngữ"], ["Mức độ quan tâm", "Rất tích cực, thường xuyên liên hệ GV"]].map(([k, v]) => (
            <div key={k as string} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-500 w-32 flex-shrink-0">{k as string}</span>
              <span className="text-sm text-gray-700">{v as string}</span>
            </div>
          ))}
        </div>
      )}
      {tab === "alumni" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Alumni phù hợp để tham khảo</h3>
          <p className="text-xs text-gray-500 mb-4">Cựu học sinh có hành trình học tập tương tự — có thể dùng để gợi ý pathway</p>
          <div className="space-y-3">
            {[
              { name: "Lê Minh Đức", year: "K2018", school: "ĐH Bách Khoa HCM", major: "Kỹ thuật Máy tính", job: "Software Engineer tại VNG", match: 91 },
              { name: "Phạm Thị Hương", year: "K2019", school: "ĐH FPT", major: "Kỹ thuật Phần mềm", job: "Frontend Dev tại Shopee", match: 85 },
              { name: "Nguyễn Văn Khoa", year: "K2017", school: "UIT", major: "KTPM", job: "Data Engineer tại MoMo", match: 78 },
            ].map((a) => (
              <div key={a.name} className="flex items-center gap-4 p-3.5 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors">
                <Avatar name={a.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-sm text-gray-800">{a.name}</span>
                    <span className="text-xs text-gray-400 font-mono">{a.year}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-semibold">{a.school} · {a.major}</p>
                  <p className="text-xs text-gray-500">{a.job}</p>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{a.match}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Students List ── */
const CounselorStudentList = () => {
  const [selected, setSelected] = useState<typeof studentsInClass[0] | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  if (selected) return <CounselorStudentDetail student={selected} onBack={() => setSelected(null)} />;
  const filtered = studentsInClass.filter(s => {
    if (filter === "risk" && s.risk === "none") return false;
    if (filter === "incomplete" && s.testStatus === "Hoàn thành") return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Danh sách Học sinh 👥</h1>
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm học sinh..."
            className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {[{ id: "all", label: "Tất cả" }, { id: "risk", label: "Cần hỗ trợ" }, { id: "incomplete", label: "Chưa test" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f.id ? "bg-blue-100 text-blue-700" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Học sinh", "Điểm TB", "Career Fit", "Test", "Hồ sơ", "Tình trạng", ""].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="sm" />
                    <div><p className="font-semibold text-gray-800">{s.name}</p><p className="text-xs text-gray-400 font-mono">{s.id}</p></div>
                  </div>
                </td>
                <td className="py-3 px-4"><span className={`font-mono font-bold ${s.avg >= 8 ? "text-green-600" : s.avg >= 6.5 ? "text-blue-600" : "text-red-600"}`}>{s.avg.toFixed(1)}</span></td>
                <td className="py-3 px-4 text-xs text-gray-600">{s.careerFit}</td>
                <td className="py-3 px-4"><TestBadge status={s.testStatus} /></td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 w-24"><ProgressBar value={s.progress} /><span className="text-xs font-mono text-gray-500">{s.progress}%</span></div>
                </td>
                <td className="py-3 px-4"><RiskBadge level={s.risk} /></td>
                <td className="py-3 px-4">
                  <button onClick={() => setSelected(s)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5">Chi tiết <ArrowRight size={11} /></button>
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
const CounselorStudentGroups = () => {
  const groups = [
    { field: "Khoa học & Công nghệ", color: "from-blue-500 to-indigo-500", emoji: "💻", count: 42, students: ["Nguyễn Minh Anh", "Bùi Minh Tuấn", "Võ Thanh Nam"] },
    { field: "Y tế & Sức khỏe", color: "from-red-400 to-rose-500", emoji: "🩺", count: 18, students: ["Hoàng Thị Mai", "Lê Thu Hương"] },
    { field: "Kinh tế & Tài chính", color: "from-emerald-500 to-teal-500", emoji: "💰", count: 25, students: ["Trần Đức Huy"] },
    { field: "Nghệ thuật & Thiết kế", color: "from-purple-500 to-pink-500", emoji: "🎨", count: 12, students: ["Đặng Lan Anh"] },
    { field: "Kỹ thuật & Cơ khí", color: "from-orange-500 to-amber-500", emoji: "⚙️", count: 15, students: [] },
    { field: "Chưa xác định", color: "from-gray-400 to-gray-500", emoji: "❓", count: 16, students: ["Phạm Văn Long"] },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Nhóm Học sinh theo Ngành nghề 🗂️</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map(g => (
          <div key={g.field} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 bg-gradient-to-r ${g.color}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-2xl text-white flex-shrink-0`}>{g.emoji}</div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">{g.field}</h3>
                  <p className="text-2xl font-black text-gray-900">{g.count} <span className="text-sm font-normal text-gray-500">học sinh</span></p>
                </div>
              </div>
              {g.students.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                  {g.students.slice(0, 3).map(n => (
                    <span key={n} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{n.split(" ").pop()}</span>
                  ))}
                  {g.count > 3 && <span className="text-xs text-gray-400 px-1">+{g.count - 3} khác</span>}
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
const CounselorFamilies = () => {
  const families = [
    { student: "Nguyễn Minh Anh", parent: "Nguyễn Văn Bình", phone: "0901 234 567", email: "binh@gmail.com", engagement: "Cao", lastContact: "20/06/2025", notes: "Rất tích cực, quan tâm sát sao" },
    { student: "Trần Đức Huy", parent: "Trần Văn Minh", phone: "0912 345 678", email: "minh@gmail.com", engagement: "Trung bình", lastContact: "10/06/2025", notes: "Bận rộn, thường liên hệ qua email" },
    { student: "Hoàng Thị Mai", parent: "Hoàng Văn Sơn", phone: "0923 456 789", email: "", engagement: "Thấp", lastContact: "01/05/2025", notes: "Khó liên hệ, cần nhắc nhở" },
    { student: "Phạm Văn Long", parent: "Phạm Thị Hoa", phone: "0934 567 890", email: "hoa@gmail.com", engagement: "Trung bình", lastContact: "15/06/2025", notes: "Lo lắng về tình hình học tập của con" },
  ];
  const engCls: Record<string, string> = { "Cao": "bg-emerald-100 text-emerald-700", "Trung bình": "bg-amber-100 text-amber-700", "Thấp": "bg-red-100 text-red-700" };
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Gia đình Học sinh 👨‍👩‍👧</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {families.map(f => (
          <div key={f.student} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-bold text-gray-900">{f.parent}</p>
                <p className="text-xs text-blue-600 font-semibold">PH của: {f.student}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${engCls[f.engagement]}`}>{f.engagement}</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2"><span className="text-gray-400 w-24">Điện thoại</span><span className="font-mono font-medium">{f.phone}</span></div>
              <div className="flex items-center gap-2"><span className="text-gray-400 w-24">Email</span><span>{f.email || "Chưa có"}</span></div>
              <div className="flex items-center gap-2"><span className="text-gray-400 w-24">Liên hệ lần cuối</span><span>{f.lastContact}</span></div>
            </div>
            <p className="text-xs text-gray-500 mt-3 p-2.5 bg-gray-50 rounded-xl italic">"{f.notes}"</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-200 transition-colors">📱 Nhắn tin</button>
              <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">📝 Ghi chú</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Simple feature stubs ── */
const CounselorFeatureStub = ({ title, icon, color, items }: { title: string; icon: string; color: string; items: { label: string; value: string; sub?: string }[] }) => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">{icon} {title}</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div key={i} className={`rounded-2xl p-5 text-white shadow-sm bg-gradient-to-br ${color}`}>
          <p className="text-white/70 text-xs font-semibold mb-1">{item.label}</p>
          <p className="text-2xl font-black">{item.value}</p>
          {item.sub && <p className="text-white/70 text-xs mt-0.5">{item.sub}</p>}
        </div>
      ))}
    </div>
  </div>
);

const CounselorLessons = () => {
  const lessons = [
    { title: "Giới thiệu hướng nghiệp lớp 9", class: "9A, 9B", assigned: 72, done: 58, status: "active" },
    { title: "Khám phá bản thân", class: "Tất cả", assigned: 128, done: 91, status: "active" },
    { title: "Ngành nghề tương lai", class: "9C, 9D", assigned: 74, done: 30, status: "draft" },
    { title: "Kỹ năng phỏng vấn cơ bản", class: "Lớp 10", assigned: 45, done: 45, status: "done" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">📖 Bài học</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700"><Plus size={14} />Tạo bài học</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lessons.map((l, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800">{l.title}</h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${l.status === "active" ? "bg-blue-100 text-blue-700" : l.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                {l.status === "active" ? "Đang mở" : l.status === "done" ? "Hoàn thành" : "Nháp"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">📚 Lớp: {l.class}</p>
            <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
              <span>Tiến độ hoàn thành</span>
              <span className="font-bold">{l.done}/{l.assigned} HS</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${Math.round((l.done / l.assigned) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CounselorSurveys = () => {
  const surveys = [
    { title: "Holland Code — Sở thích nghề nghiệp", respondents: 102, total: 128, avg: "I–C–R", status: "active" },
    { title: "MBTI — Tính cách", respondents: 78, total: 128, avg: "INTJ/ENFP mix", status: "active" },
    { title: "Kỹ năng mềm", respondents: 55, total: 128, avg: "73/100", status: "active" },
    { title: "Kỳ vọng phụ huynh", respondents: 90, total: 128, avg: "–", status: "done" },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">📝 Khảo sát</h1>
        <button className="px-4 py-2 bg-pink-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-pink-700"><Plus size={14} />Tạo khảo sát</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {surveys.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${s.status === "active" ? "bg-pink-100 text-pink-700" : "bg-emerald-100 text-emerald-700"}`}>{s.status === "active" ? "Đang mở" : "Kết thúc"}</span>
            </div>
            <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
              <span>Phản hồi</span><span className="font-bold">{s.respondents}/{s.total}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-2 rounded-full bg-pink-400" style={{ width: `${Math.round((s.respondents / s.total) * 100)}%` }} />
            </div>
            {s.avg !== "–" && <p className="text-xs text-gray-500">Kết quả phổ biến: <span className="font-bold text-gray-700">{s.avg}</span></p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const CounselorReportBase = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
    {children}
  </div>
);

const CounselorReportStudentWork = () => (
  <CounselorReportBase title="📋 Student Work">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[["Bài nộp", "312", "Tổng cộng"], ["Đúng hạn", "89%", "278 bài"], ["Trễ hạn", "34", "11%"], ["Chưa nộp", "12", "Cần nhắc"]].map(([l, v, s], i) => (
        <div key={i} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${["from-blue-500 to-indigo-500", "from-emerald-500 to-teal-400", "from-amber-400 to-orange-500", "from-red-400 to-rose-500"][i]}`}>
          <p className="text-white/70 text-xs">{l}</p><p className="text-3xl font-black">{v}</p><p className="text-white/70 text-xs">{s}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Tiến độ nộp bài theo tuần</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={[{w:"T1",done:45,late:5},{w:"T2",done:52,late:8},{w:"T3",done:38,late:12},{w:"T4",done:61,late:4},{w:"T5",done:48,late:7}]} barSize={20}>
          <CartesianGrid key="g" strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis key="x" dataKey="w" tick={{fontSize:12}} axisLine={false} tickLine={false} />
          <YAxis key="y" tick={{fontSize:11}} axisLine={false} tickLine={false} />
          <Tooltip key="t" />
          <Bar key="done" dataKey="done" fill="#3B82F6" radius={[4,4,0,0]} name="Đúng hạn" />
          <Bar key="late" dataKey="late" fill="#F59E0B" radius={[4,4,0,0]} name="Trễ hạn" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CounselorReportBase>
);

const CounselorReportEngagement = () => (
  <CounselorReportBase title="📊 Engagement">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[["Đăng nhập/tuần", "4.2 lần", "Trung bình"], ["Thời gian/buổi", "22 phút", "Trung bình"], ["Tương tác bài học", "76%", "Hoàn thành video"], ["Điểm tham gia", "82/100", "Chỉ số Engagement"]].map(([l,v,s], i) => (
        <div key={i} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${["from-violet-500 to-purple-500","from-blue-500 to-sky-400","from-emerald-500 to-teal-400","from-orange-500 to-amber-400"][i]}`}>
          <p className="text-white/70 text-xs">{l}</p><p className="text-2xl font-black">{v}</p><p className="text-white/70 text-xs">{s}</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">Học sinh ít tương tác nhất</h3>
      <div className="space-y-2.5">
        {studentsInClass.filter(s => s.progress < 50).map(s => (
          <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-red-50 border border-red-100">
            <Avatar name={s.name} size="sm" />
            <div className="flex-1"><p className="text-sm font-semibold text-gray-800">{s.name}</p><p className="text-xs text-gray-500">Hồ sơ {s.progress}% · {s.testStatus}</p></div>
            <RiskBadge level={s.risk} />
          </div>
        ))}
      </div>
    </div>
  </CounselorReportBase>
);

const CounselorReportCollegePlanning = () => (
  <CounselorReportBase title="🎓 College Planning">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Xu hướng trường mục tiêu</h3>
        <div className="space-y-2.5">
          {[["ĐH Bách Khoa HCM", 28],["ĐH FPT", 22],["UIT", 18],["RMIT Vietnam", 12],["Fulbright", 8]].map(([s,n]) => (
            <div key={s as string} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-36 flex-shrink-0 truncate">{s as string}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-2 rounded-full bg-blue-500" style={{ width: `${((n as number)/28)*100}%` }} />
              </div>
              <span className="text-xs font-mono font-bold text-gray-700 w-5">{n as number}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Phân bố ngành mục tiêu</h3>
        <div className="space-y-2.5">
          {[["Công nghệ & CNTT", "42%", "#3B82F6"],["Y tế", "18%", "#EF4444"],["Kinh tế", "20%", "#10B981"],["Thiết kế", "10%", "#8B5CF6"],["Khác", "10%", "#9CA3AF"]].map(([f,p,c]) => (
            <div key={f as string} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor: c as string}} />
              <span className="text-xs text-gray-600 flex-1">{f as string}</span>
              <span className="text-xs font-bold text-gray-700">{p as string}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Trạng thái hồ sơ ĐH</h3>
        <div className="space-y-3">
          {[["Chưa bắt đầu", 45, "bg-gray-300"],["Đang chuẩn bị", 62, "bg-amber-400"],["Hoàn thiện", 21, "bg-emerald-500"]].map(([l,n,c]) => (
            <div key={l as string}>
              <div className="flex justify-between text-xs mb-1"><span className="text-gray-600">{l as string}</span><span className="font-bold">{n as number} HS</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-2 rounded-full ${c as string}`} style={{width:`${((n as number)/128)*100}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </CounselorReportBase>
);

// ── Sidebar ───────────────────────────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: any };
type NavGroup = { group: string; icon: any; items: NavItem[] };

const counselorNavGroups: NavGroup[] = [
  {
    group: "Dashboard", icon: LayoutDashboard,
    items: [{ id: "co-dashboard", label: "Tổng quan", icon: LayoutDashboard }],
  },
  {
    group: "Students", icon: Users,
    items: [
      { id: "co-students-list", label: "Students List", icon: UserCheck },
      { id: "co-student-groups", label: "Student Groups", icon: Layers },
    ],
  },
  {
    group: "Families", icon: Heart,
    items: [{ id: "co-families", label: "Families", icon: Heart }],
  },
  {
    group: "Features", icon: Lightbulb,
    items: [
      { id: "co-lessons", label: "Lessons", icon: BookOpen },
      { id: "co-assignments", label: "Assignment", icon: ClipboardList },
      { id: "co-surveys", label: "Surveys", icon: FileText },
      { id: "co-courses", label: "Course & Diploma", icon: GraduationCap },
      { id: "co-test-scores", label: "Test Scores", icon: BarChart2 },
    ],
  },
  {
    group: "Reports", icon: PieChart,
    items: [
      { id: "co-report-work", label: "Student Work", icon: Trophy },
      { id: "co-report-lessons", label: "Lesson Progress", icon: TrendingUp },
      { id: "co-report-assignment", label: "Assignment", icon: Award },
      { id: "co-report-engagement", label: "Engagement", icon: Activity },
      { id: "co-report-college", label: "College Planning", icon: Flag },
    ],
  },
  {
    group: "Connector", icon: MessageSquare,
    items: [
      { id: "co-messenger", label: "Messenger", icon: MessageSquare },
      { id: "co-advice", label: "Advice Notes", icon: BookMarked },
    ],
  },
];

const studentNavGroups: NavGroup[] = [
  {
    group: "Home", icon: Home,
    items: [
      { id: "st-dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "st-lessons", label: "Lessons", icon: BookMarked },
      { id: "st-surveys", label: "Surveys", icon: ClipboardList },
      { id: "st-assignment", label: "Assignment", icon: FileText },
      { id: "st-games", label: "Real Games", icon: Gamepad2 },
    ],
  },
  {
    group: "Explore", icon: Compass,
    items: [
      { id: "st-explore", label: "Khám phá ngành nghề", icon: MapPin },
      { id: "st-universities", label: "Khám phá Đại học", icon: GraduationCap },
    ],
  },
  {
    group: "About Me", icon: User,
    items: [
      { id: "st-personal", label: "Personal Information", icon: User },
      { id: "st-portfolio", label: "Portfolios", icon: FolderOpen },
      { id: "st-resume", label: "Resume", icon: FileText },
      { id: "st-applications", label: "Application Results", icon: Trophy },
    ],
  },
  {
    group: "Plans", icon: Map,
    items: [
      { id: "st-plan-grade", label: "Plan for Grade", icon: BookOpen },
      { id: "st-plan-pathways", label: "Plan for Pathways", icon: Target },
    ],
  },
  {
    group: "Connection", icon: MessageSquare,
    items: [
      { id: "st-messenger", label: "Messenger", icon: MessageSquare },
      { id: "st-advice", label: "Advisement Notes", icon: BookMarked },
    ],
  },
];

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { id: "school-overview", label: "Tổng quan trường", icon: LayoutDashboard },
    { id: "grade-dashboard", label: "Dashboard khối", icon: BarChart2 },
    { id: "class-dashboard", label: "Dashboard lớp", icon: Users },
    { id: "student-profile", label: "Hồ sơ học sinh", icon: UserCheck },
    { id: "data-quality", label: "Dữ liệu & Bảo mật", icon: Shield },
  ],
  teacher: [
    { id: "class-dashboard", label: "Lớp của tôi", icon: Users },
    { id: "student-profile", label: "Hồ sơ học sinh", icon: UserCheck },
    { id: "teacher-entry", label: "Nhập dữ liệu", icon: Edit2 },
  ],
  counselor: [], // uses CounselorSidebar with grouped nav
  parent: [
    { id: "parent-portal", label: "Tiến độ của con", icon: Heart },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Quản trị viên",
  teacher: "GV Trần Thị Lan",
  counselor: "CV Nguyễn Văn Minh",
  student: "Nguyễn Minh Anh",
  parent: "PH Nguyễn Văn Bình",
};

// Reusable grouped sidebar renderer
const GroupedSidebar = ({
  view, setView, onLogout, navGroups, brand, accentGrad, activeCls, userLabel, userSub, userGrad,
}: {
  view: string; setView: (v: string) => void; onLogout: () => void;
  navGroups: NavGroup[]; brand: string; accentGrad: string; activeCls: string;
  userLabel: string; userSub: string; userGrad: string;
}) => {
  const defaultOpen = navGroups.find((g) => g.items.some((i) => i.id === view))?.group ?? navGroups[0]?.group;
  const [openGroups, setOpenGroups] = useState<string[]>([defaultOpen ?? ""]);
  const toggle = (g: string) => setOpenGroups((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  return (
    <aside className="w-56 flex flex-col flex-shrink-0 h-screen" style={{ background: accentGrad }}>
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#F97316,#EC4899)" }}>
          <GraduationCap size={15} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-none">EduPath</p>
          <p className="text-white/50 text-xs mt-0.5">{brand}</p>
        </div>
      </div>
      <div className="mx-4 mt-4 mb-2 flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 bg-gradient-to-br ${userGrad}`}>
          {userLabel.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-bold leading-none truncate">{userLabel}</p>
          <p className="text-white/50 text-xs mt-0.5">{userSub}</p>
        </div>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto px-2">
        {navGroups.map((group) => {
          const isOpen = openGroups.includes(group.group);
          const isActiveGroup = group.items.some((i) => i.id === view);
          return (
            <div key={group.group} className="mb-1">
              <button onClick={() => toggle(group.group)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${isActiveGroup ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
                <group.icon size={15} className="flex-shrink-0" />
                <span className="text-sm font-bold flex-1">{group.group}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="ml-3 mt-0.5 border-l-2 border-white/10 pl-2 space-y-0.5">
                  {group.items.map((item) => (
                    <button key={item.id} onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-xs ${view === item.id ? activeCls + " font-bold shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white font-medium"}`}>
                      <item.icon size={13} className="flex-shrink-0" />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut size={14} /><span className="text-xs font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

const CounselorSidebar = ({ view, setView, onLogout }: { view: string; setView: (v: string) => void; onLogout: () => void }) => (
  <GroupedSidebar view={view} setView={setView} onLogout={onLogout}
    navGroups={counselorNavGroups}
    brand="Cố vấn hướng nghiệp"
    accentGrad="linear-gradient(180deg, #0F2744 0%, #1E3A5F 55%, #1E40AF 100%)"
    activeCls="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
    userLabel="Nguyễn Văn Minh" userSub="Cố vấn · 128 HS"
    userGrad="from-blue-400 to-indigo-600"
  />
);

const StudentSidebar = ({ view, setView, onLogout }: { view: string; setView: (v: string) => void; onLogout: () => void }) => (
  <GroupedSidebar view={view} setView={setView} onLogout={onLogout}
    navGroups={studentNavGroups}
    brand="Học sinh"
    accentGrad="linear-gradient(180deg, #1C1347 0%, #2D1B69 60%, #4C1D95 100%)"
    activeCls="bg-gradient-to-r from-orange-500 to-pink-500 text-white"
    userLabel="Nguyễn Minh Anh" userSub="Lớp 9A · 62% hồ sơ"
    userGrad="from-orange-400 to-pink-500"
  />
);

const Sidebar = ({ role, view, setView, onLogout }: { role: string; view: string; setView: (v: string) => void; onLogout: () => void }) => {
  const nav = navByRole[role] ?? [];
  return (
    <aside className="w-52 bg-[#1C2B4A] flex flex-col flex-shrink-0 h-screen">
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap size={15} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-none">EduPath</p>
          <p className="text-blue-300 text-xs mt-0.5">Hướng nghiệp</p>
        </div>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-4 pb-2 text-blue-300 text-xs font-bold uppercase tracking-wider">{roleLabels[role]}</p>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors mb-0.5 ${
              view === item.id ? "bg-[#EA580C] text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon size={15} className="flex-shrink-0" />
            <span className="text-sm font-medium leading-none">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-blue-300 hover:bg-white/10 hover:text-white transition-colors">
          <LogOut size={15} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

const TopNav = ({ role }: { role: string }) => (
  <header className={`h-14 border-b flex items-center px-5 gap-4 flex-shrink-0 ${role === "student" ? "border-orange-100 bg-white" : "border-gray-100 bg-white"}`}>
    <div className="relative flex-1 max-w-64">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        className={`w-full pl-8 pr-3 py-2 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${role === "student" ? "border-orange-200 focus:ring-orange-400" : "border-gray-200 focus:ring-orange-400"}`}
        placeholder={role === "student" ? "Tìm bài học, ngành nghề..." : "Tìm học sinh, lớp..."}
      />
    </div>
    <div className="flex items-center gap-3 ml-auto">
      <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
        <Bell size={17} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
      <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${role === "student" ? "bg-gradient-to-br from-orange-400 to-pink-500" : "bg-gradient-to-br from-orange-400 to-amber-500"}`}>
          {roleLabels[role]?.charAt(0)}
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden sm:block">{roleLabels[role]}</span>
      </div>
    </div>
  </header>
);

// ── Support Chatbot ───────────────────────────────────────────────────────────
type BotMsg = { id: number; from: "bot" | "user"; text: string };

const BOT_QUICK = [
  "Tôi nên chọn ngành nào?",
  "Điểm chuẩn vào HUST là bao nhiêu?",
  "Làm thế nào để hoàn thiện hồ sơ?",
  "Tôi có thể làm bài test hướng nghiệp ở đâu?",
];

const BOT_REPLIES: Record<string, string> = {
  "Tôi nên chọn ngành nào?": "Dựa trên kết quả MBTI và Holland của bạn (INTJ / I-C-R), bạn phù hợp nhất với nhóm **Khoa học & Công nghệ** — đặc biệt là Kỹ thuật Phần mềm (92%) và Khoa học Dữ liệu (87%). Bạn có muốn tìm hiểu chi tiết không? 🎯",
  "Điểm chuẩn vào HUST là bao nhiêu?": "Năm 2024, ĐH Bách Khoa Hà Nội có điểm chuẩn dao động **26.75 – 27.55 điểm** tùy ngành (tổ hợp A00/A01). Ngành Khoa học Máy tính là cao nhất: 27.55 điểm. Bạn muốn xem thêm các trường khác không? 📚",
  "Làm thế nào để hoàn thiện hồ sơ?": "Hồ sơ của bạn hiện đạt **62%**. Để hoàn thiện, bạn cần: ✅ Hoàn thành bài test MBTI · ✅ Cập nhật thông tin cá nhân · ✅ Thêm thành tích vào Portfolio. Tôi có thể dẫn bạn đến từng mục nhé! 💪",
  "Tôi có thể làm bài test hướng nghiệp ở đâu?": "Bạn có thể làm bài test tại mục **Surveys** trong thanh điều hướng bên trái. Hiện có 4 bài test: Holland Code ✅, MBTI 🧠, Kỹ năng mềm ⚡, và Năng lực học tập 📚. Bạn chưa làm MBTI nhé! 😊",
};

const BOT_DEFAULT = "Cảm ơn bạn đã hỏi! Tôi đang tìm câu trả lời phù hợp nhất cho bạn. Trong thời gian chờ, bạn có thể liên hệ trực tiếp cố vấn hướng nghiệp qua mục **Messenger** nhé 💬";

const SupportChatbot = ({ role }: { role: string }) => {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<BotMsg[]>([
    { id: 0, from: "bot", text: "Xin chào! Tôi là EduBot 🤖 — trợ lý hướng nghiệp của bạn. Tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useState<HTMLDivElement | null>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: BotMsg = { id: Date.now(), from: "user", text: text.trim() };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_REPLIES[text.trim()] ?? BOT_DEFAULT;
      setMsgs((p) => [...p, { id: Date.now() + 1, from: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  };

  const unread = !open && msgs.length > 1 && msgs[msgs.length - 1].from === "bot";

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-80 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={{ height: 480, background: "#fff" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0" style={{ background: "linear-gradient(135deg,#EA580C,#F59E0B)" }}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">🤖</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none">EduBot</p>
              <p className="text-white/75 text-xs mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                {typing ? "Đang nhập..." : "Trợ lý hướng nghiệp"}
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0">
              <span className="text-lg leading-none font-light">×</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/60">
            {msgs.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                {msg.from === "bot" && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#EA580C,#F59E0B)" }}>🤖</div>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === "user" ? "text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}
                  style={msg.from === "user" ? { background: "linear-gradient(135deg,#EA580C,#F59E0B)" } : {}}
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                />
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm" style={{ background: "linear-gradient(135deg,#EA580C,#F59E0B)" }}>🤖</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick replies */}
          {msgs.length <= 2 && !typing && (
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-xs text-gray-400 font-medium px-1">Câu hỏi gợi ý</p>
              <div className="flex flex-col gap-1">
                {BOT_QUICK.slice(0, 3).map((q) => (
                  <button key={q} onClick={() => send(q)}
                    className="text-left text-xs px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors font-medium">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Nhập câu hỏi..."
              className="flex-1 px-3.5 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
            />
            <button onClick={() => send(input)} disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#EA580C,#F59E0B)" }}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* FAB trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: open ? "#6b7280" : "linear-gradient(135deg,#EA580C,#F59E0B)" }}
        title="EduBot — Trợ lý hướng nghiệp"
      >
        {open ? (
          <span className="text-white text-2xl font-light leading-none">×</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
        {unread && (
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
        )}
      </button>
    </>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [view, setView] = useState<string>("school-overview");
  const [uniToOpen, setUniToOpen] = useState<string | null>(null);

  const handleLogin = (selectedRole: string) => {
    setRole(selectedRole);
    const defaults: Record<string, string> = {
      admin: "school-overview",
      teacher: "class-dashboard",
      counselor: "co-dashboard",
      student: "st-dashboard",
      parent: "parent-portal",
    };
    setView(defaults[selectedRole] ?? "school-overview");
  };

  if (!role) return <LoginScreen onLogin={handleLogin} />;

  const navigate = (target: string) => setView(target);

  const renderView = () => {
    switch (view) {
      case "school-overview": return <SchoolOverview navigate={navigate} />;
      case "grade-dashboard": return <GradeDashboard navigate={navigate} />;
      case "class-dashboard": return <ClassDashboard navigate={navigate} />;
      case "student-profile": return <StudentProfile />;
      case "teacher-entry": return <TeacherEntry />;
      case "counseling": return <CounselingWorkspace />;
      case "parent-portal": return <ParentPortal />;
      case "data-quality": return <DataQuality />;
      // Student views
      case "st-dashboard": return <StudentDashboard setView={setView} />;
      case "st-lessons": return <StudentLessons />;
      case "st-surveys": return <StudentSurveys />;
      case "st-assignment": return <StudentAssignment />;
      case "st-games": return <StudentGames />;
      case "st-explore": return (
        <StudentExplore
          onNavigateToUni={(id) => { setUniToOpen(id); setView("st-universities"); }}
        />
      );
      case "st-universities": return (
        <StudentUniversities
          initialUniId={uniToOpen}
          key={uniToOpen ?? "unis"}
        />
      );
      case "st-personal": return <StudentPersonalInfo />;
      case "st-portfolio": return <StudentPortfolio />;
      case "st-resume": return <StudentResume />;
      case "st-applications": return <StudentApplicationResults />;
      case "st-plan-grade": return <StudentPlanGrade />;
      case "st-plan-pathways": return <StudentPlanPathways />;
      case "st-messenger": return <MessengerView role="student" />;
      case "st-advice": return <AdvisementNotesStudent />;
      // Counselor views
      case "co-dashboard": return <CounselorDashboard />;
      case "co-students-list": return <CounselorStudentList />;
      case "co-student-groups": return <CounselorStudentGroups />;
      case "co-families": return <CounselorFamilies />;
      case "co-lessons": return <CounselorLessons />;
      case "co-assignments": return <CounselorFeatureStub title="Assignment" icon="✅" color="from-emerald-500 to-teal-400" items={[{label:"Đã giao",value:"16",sub:"Tổng bài tập"},{label:"Đúng hạn",value:"89%",sub:"278 nộp"},{label:"Trễ hạn",value:"34",sub:"Cần nhắc"}]} />;
      case "co-surveys": return <CounselorSurveys />;
      case "co-courses": return <CounselorFeatureStub title="Course & Diploma" icon="🎓" color="from-violet-500 to-indigo-500" items={[{label:"Khoá học",value:"8",sub:"Đang hoạt động"},{label:"Chứng chỉ",value:"156",sub:"Đã cấp"},{label:"Tỉ lệ hoàn thành",value:"81%",sub:""}]} />;
      case "co-test-scores": return <CounselorFeatureStub title="Test Scores" icon="📊" color="from-blue-500 to-cyan-500" items={[{label:"Bài test",value:"6",sub:"Loại kiểm tra"},{label:"Đã làm",value:"94 HS",sub:"73%"},{label:"ĐTB",value:"76/100",sub:"Kỹ năng mềm"}]} />;
      case "co-report-work": return <CounselorReportStudentWork />;
      case "co-report-lessons": return <CounselorFeatureStub title="Lesson Progress" icon="📈" color="from-orange-500 to-amber-400" items={[{label:"Bài học",value:"24",sub:"Tổng cộng"},{label:"Hoàn thành",value:"75%",sub:"96 HS"},{label:"Đang học",value:"18%",sub:"23 HS"}]} />;
      case "co-report-assignment": return <CounselorFeatureStub title="Assignment Report" icon="📋" color="from-teal-500 to-emerald-400" items={[{label:"Nộp đúng hạn",value:"89%",sub:"278 bài"},{label:"Nộp trễ",value:"34",sub:"11%"},{label:"Chưa nộp",value:"12",sub:"Cần nhắc"}]} />;
      case "co-report-engagement": return <CounselorReportEngagement />;
      case "co-report-college": return <CounselorReportCollegePlanning />;
      case "co-messenger": return <MessengerView role="counselor" />;
      case "co-advice": return <AdvisementNotesCounselor />;
      default: return <SchoolOverview navigate={navigate} />;
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        {role === "student"
          ? <StudentSidebar view={view} setView={setView} onLogout={() => setRole(null)} />
          : role === "counselor"
            ? <CounselorSidebar view={view} setView={setView} onLogout={() => setRole(null)} />
            : <Sidebar role={role} view={view} setView={setView} onLogout={() => setRole(null)} />
        }
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNav role={role} />
          <main className={`flex-1 overflow-y-auto p-5 ${role === "student" ? "bg-[#FFF7F0]" : "bg-[#FDF6EE]"}`}>
            {renderView()}
          </main>
        </div>
      </div>
      <SupportChatbot role={role} />
    </>
  );
}
