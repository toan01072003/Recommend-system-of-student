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

export const StudentSurveys = () => {
  const [step, setStep] = useState<"list" | "quiz" | "result" | "detail">(
    "list",
  );
  const [qIdx, setQIdx] = useState(0);
  const [activeResult, setActiveResult] = useState<
    "holland" | "mbti" | "skills" | null
  >(null);
  const [surveys, setSurveys] = useState([
    {
      id: 1,
      key: "holland" as const,
      title: "Bài test Sở thích nghề nghiệp (Holland)",
      tag: "Holland Code",
      time: "5 phút",
      done: true,
      emoji: "🌟",
      color: "from-amber-400 to-orange-500",
    },
    {
      id: 2,
      key: "mbti" as const,
      title: "Trắc nghiệm tính cách MBTI",
      tag: "Tính cách",
      time: "8 phút",
      done: true,
      emoji: "🧠",
      color: "from-violet-500 to-pink-500",
    },
    {
      id: 3,
      key: "skills" as const,
      title: "Đánh giá kỹ năng mềm",
      tag: "Kỹ năng",
      time: "6 phút",
      done: true,
      emoji: "⚡",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: 4,
      key: null,
      title: "Khảo sát năng lực học tập",
      tag: "Học tập",
      time: "7 phút",
      done: false,
      emoji: "📚",
      color: "from-emerald-500 to-teal-400",
    },
  ]);

  // Detail view for a completed survey result
  if (step === "detail" && activeResult) {
    if (activeResult === "holland") {
      const r = SURVEY_COMPLETED_RESULTS.holland;
      return (
        <div className="space-y-5">
          <button
            onClick={() => setStep("list")}
            className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800"
          >
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div
            className="rounded-3xl p-6 text-white shadow-lg"
            style={{ background: "linear-gradient(135deg,#F97316,#F59E0B)" }}
          >
            <p className="text-white/80 text-sm font-semibold mb-1">
              Mã Holland của bạn
            </p>
            <h2 className="text-5xl font-black mb-2">{r.code}</h2>
            <p className="text-lg font-bold text-white/90">{r.label}</p>
            <p className="text-white/75 text-sm mt-2 leading-relaxed">
              {r.desc}
            </p>
            <p className="text-white/50 text-xs mt-3">
              Hoàn thành ngày {r.date}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">
              Điểm số 6 nhóm tính cách
            </h3>
            <div className="space-y-3">
              {r.dims.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-36 flex-shrink-0">
                    {d.label}
                  </span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-4 rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${d.score}%`, backgroundColor: d.color }}
                    >
                      <span
                        className="text-white text-xs font-bold"
                        style={{ fontSize: 10 }}
                      >
                        {d.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">
              🎯 Nghề nghiệp phù hợp nhất
            </h3>
            <div className="flex flex-wrap gap-2">
              {r.topCareers.map((c) => (
                <span
                  key={c}
                  className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold border border-orange-200"
                >
                  {c}
                </span>
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
          <button
            onClick={() => setStep("list")}
            className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800"
          >
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div
            className="rounded-3xl p-6 text-white text-center shadow-lg"
            style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)" }}
          >
            <p className="text-white/80 text-lg mb-1">Kiểu tính cách của bạn</p>
            <h2 className="text-6xl font-black mb-2">{r.type}</h2>
            <p className="text-xl font-bold text-white/90">{r.fullName}</p>
            <p className="text-white/75 text-sm mt-2 leading-relaxed max-w-sm mx-auto">
              {r.desc}
            </p>
            <p className="text-white/50 text-xs mt-3">
              Hoàn thành ngày {r.date}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">
              Phân tích 4 chiều tính cách
            </h3>
            <div className="space-y-4">
              {r.dims.map((d) => (
                <div key={d.left}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span
                      className={
                        d.side === "left" ? "text-violet-700" : "text-gray-400"
                      }
                    >
                      {d.left}
                    </span>
                    <span
                      className={
                        d.side === "right" ? "text-violet-700" : "text-gray-400"
                      }
                    >
                      {d.right}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
                    {d.side === "left" ? (
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
                        style={{ width: `${d.score}%` }}
                      />
                    ) : (
                      <div
                        className="h-3 rounded-full bg-gradient-to-l from-violet-500 to-pink-500 absolute right-0"
                        style={{ width: `${d.score}%` }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black text-white drop-shadow">
                        {d.score}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 text-sm mb-2">
                💪 Điểm mạnh
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {r.strengths.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <h3 className="font-bold text-amber-800 text-sm mb-2">
                📈 Cần phát triển
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {r.weaknesses.map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold"
                  >
                    {s}
                  </span>
                ))}
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
          <button
            onClick={() => setStep("list")}
            className="flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-pink-800"
          >
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div
            className="rounded-3xl p-6 text-white shadow-lg"
            style={{ background: "linear-gradient(135deg,#3B82F6,#06B6D4)" }}
          >
            <p className="text-white/80 text-sm font-semibold mb-1">
              Điểm kỹ năng mềm tổng thể
            </p>
            <div className="flex items-end gap-3 mb-2">
              <h2 className="text-6xl font-black">{r.overall}</h2>
              <span className="text-2xl text-white/70 mb-1">/100</span>
            </div>
            <p className="text-white/75 text-sm">Hoàn thành ngày {r.date}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">
              Chi tiết từng kỹ năng
            </h3>
            <div className="space-y-3">
              {r.dims.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-36 flex-shrink-0">
                    {d.label}
                  </span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-4 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${d.score}%`, backgroundColor: d.color }}
                    >
                      <span
                        className="text-white text-xs font-bold"
                        style={{ fontSize: 10 }}
                      >
                        {d.score}
                      </span>
                    </div>
                  </div>
                  {d.label === r.topStrength && (
                    <span className="text-xs text-emerald-600 font-bold flex-shrink-0">
                      Top 💪
                    </span>
                  )}
                  {d.label === r.needWork && (
                    <span className="text-xs text-amber-600 font-bold flex-shrink-0">
                      Cải thiện
                    </span>
                  )}
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
      {
        q: "Bạn thích làm việc một mình hay theo nhóm?",
        opts: [
          "Một mình, tập trung sâu",
          "Theo nhóm nhỏ 2-3 người",
          "Theo nhóm lớn, sôi động",
          "Tuỳ tình huống",
        ],
      },
      {
        q: "Khi gặp vấn đề, bạn thường xử lý bằng cách nào?",
        opts: [
          "Phân tích logic từng bước",
          "Dựa vào trực giác và cảm xúc",
          "Hỏi ý kiến người khác",
          "Thử nghiệm nhiều cách",
        ],
      },
      {
        q: "Bạn thích lên kế hoạch hay hành động ngẫu hứng?",
        opts: [
          "Luôn lên kế hoạch kỹ",
          "Kế hoạch sơ bộ rồi linh hoạt",
          "Thích ngẫu hứng, tự do",
          "Phụ thuộc vào công việc",
        ],
      },
      {
        q: "Điều gì thúc đẩy bạn học tập?",
        opts: [
          "Muốn đạt thành tích cao",
          "Yêu thích khám phá kiến thức",
          "Muốn giúp ích cho mọi người",
          "Muốn ổn định tương lai",
        ],
      },
      {
        q: "Bạn miêu tả bản thân là người như thế nào?",
        opts: [
          "Độc lập và tự chủ",
          "Sáng tạo và nghệ sĩ",
          "Thực tế và có tổ chức",
          "Đồng cảm và quan tâm người khác",
        ],
      },
    ];
    const cur = qs[qIdx];
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-bold text-pink-600">
              Câu {qIdx + 1} / {qs.length}
            </span>
            <span className="text-xs text-gray-400">
              {Math.round((qIdx / qs.length) * 100)}% hoàn thành
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(qIdx / qs.length) * 100}%`,
                background: "linear-gradient(90deg,#EC4899,#8B5CF6)",
              }}
            />
          </div>
        </div>
        <div className="bg-white rounded-3xl border-2 border-pink-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-pink-400 to-violet-500" />
          <div className="p-6">
            <div className="text-4xl text-center mb-4">🤔</div>
            <p className="text-lg font-bold text-gray-900 text-center mb-5">
              {cur.q}
            </p>
            <div className="space-y-2.5">
              {cur.opts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    if (qIdx < qs.length - 1) setQIdx((i) => i + 1);
                    else {
                      setStep("result");
                      setQIdx(0);
                    }
                  }}
                  className="w-full text-left px-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:border-pink-400 hover:bg-pink-50 hover:text-pink-800 transition-all font-semibold text-gray-700 text-sm"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setStep("list");
            setQIdx(0);
          }}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  // Result after completing quiz
  if (step === "result") {
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center py-2">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bài test hoàn thành!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Kết quả đã được lưu vào hồ sơ của bạn
          </p>
        </div>
        <div
          className="rounded-3xl p-6 text-white text-center shadow-lg"
          style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)" }}
        >
          <p className="text-white/80 text-lg mb-1">
            Kiểu tính cách của bạn là
          </p>
          <h2 className="text-6xl font-black mb-2">INTJ</h2>
          <p className="text-lg font-bold">Người Kiến trúc sư</p>
          <p className="text-white/75 text-sm mt-2">
            Chiến lược gia, độc lập, quyết đoán và sáng tạo
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Hướng nội", pct: 72, color: "bg-violet-500" },
            { label: "Trực giác", pct: 65, color: "bg-pink-500" },
            { label: "Tư duy", pct: 81, color: "bg-orange-500" },
            { label: "Kế hoạch", pct: 78, color: "bg-emerald-500" },
          ].map((t) => (
            <div
              key={t.label}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-700">
                  {t.label}
                </span>
                <span className="text-sm font-bold font-mono">{t.pct}%</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${t.color}`}
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep("list")}
          className="w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl text-sm font-bold hover:opacity-90"
        >
          Xem tổng hợp kết quả →
        </button>
      </div>
    );
  }

  // ── Main list view with summary ──────────────────────────────────────────────
  const doneCount = surveys.filter((s) => s.done).length;
  const completionPct = Math.round((doneCount / surveys.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Khảo sát & Bài test 📝
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {doneCount} / {surveys.length} bài đã hoàn thành
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <span className="text-sm font-black text-violet-700">
            {completionPct}%
          </span>
        </div>
      </div>

      {/* ── Summary of Results ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="font-bold text-gray-900">Tổng hợp kết quả</h2>
          <span className="ml-auto text-xs text-gray-400 font-medium">
            Từ {doneCount} bài test đã hoàn thành
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Holland summary */}
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group"
            style={{ background: "linear-gradient(135deg,#FFF7ED,#FEF3C7)" }}
            onClick={() => {
              setActiveResult("holland");
              setStep("detail");
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">🌟</span>
              <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                Holland
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Mã sở thích nghề nghiệp
            </p>
            <p className="text-2xl font-black text-amber-700">
              {SURVEY_COMPLETED_RESULTS.holland.code}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {SURVEY_COMPLETED_RESULTS.holland.label}
            </p>
            <p className="text-xs text-amber-600 font-semibold mt-2 group-hover:underline">
              Xem chi tiết →
            </p>
          </div>

          {/* MBTI summary */}
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group"
            style={{ background: "linear-gradient(135deg,#F5F3FF,#FDF4FF)" }}
            onClick={() => {
              setActiveResult("mbti");
              setStep("detail");
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xs text-violet-600 font-bold bg-violet-100 px-2 py-0.5 rounded-full">
                MBTI
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Kiểu tính cách
            </p>
            <p className="text-2xl font-black text-violet-700">
              {SURVEY_COMPLETED_RESULTS.mbti.type}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {SURVEY_COMPLETED_RESULTS.mbti.fullName}
            </p>
            <p className="text-xs text-violet-600 font-semibold mt-2 group-hover:underline">
              Xem chi tiết →
            </p>
          </div>

          {/* Skills summary */}
          <div
            className="rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all group"
            style={{ background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)" }}
            onClick={() => {
              setActiveResult("skills");
              setStep("detail");
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">⚡</span>
              <span className="text-xs text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                Kỹ năng
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-1">
              Điểm kỹ năng mềm
            </p>
            <p className="text-2xl font-black text-blue-700">
              {SURVEY_COMPLETED_RESULTS.skills.overall}
              <span className="text-sm text-gray-400 font-normal">/100</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Top: {SURVEY_COMPLETED_RESULTS.skills.topStrength}
            </p>
            <p className="text-xs text-blue-600 font-semibold mt-2 group-hover:underline">
              Xem chi tiết →
            </p>
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
                {
                  icon: "🎯",
                  label: "Nhóm nghề phù hợp nhất",
                  value: "Khoa học & Công nghệ",
                  color: "text-orange-700",
                },
                {
                  icon: "🧩",
                  label: "Kiểu tính cách",
                  value: "INTJ — Kiến trúc sư",
                  color: "text-violet-700",
                },
                {
                  icon: "💪",
                  label: "Kỹ năng nổi bật",
                  value: "Tư duy phản biện (88/100)",
                  color: "text-blue-700",
                },
                {
                  icon: "📈",
                  label: "Cần phát triển",
                  value: "Quản lý thời gian",
                  color: "text-amber-700",
                },
              ].map((k) => (
                <div
                  key={k.label}
                  className="bg-white rounded-xl p-3 shadow-sm"
                >
                  <span className="text-lg block mb-1">{k.icon}</span>
                  <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                  <p className={`text-xs font-bold mt-0.5 ${k.color}`}>
                    {k.value}
                  </p>
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
            <div
              key={s.id}
              className={`bg-white rounded-2xl border-2 shadow-sm transition-all ${s.done ? "border-emerald-200 hover:shadow-md" : "border-gray-100 hover:border-pink-200"}`}
            >
              <div className="p-4 flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${s.done ? `bg-gradient-to-br ${s.color}` : "bg-gray-100"}`}
                >
                  {s.done ? (
                    <span className="text-white">{s.emoji}</span>
                  ) : (
                    s.emoji
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {s.title}
                    </h3>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    ⏱ {s.time} {s.done && "· ✅ Đã hoàn thành"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (s.done && s.key) {
                      setActiveResult(s.key);
                      setStep("detail");
                    } else if (!s.done) setStep("quiz");
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-colors ${
                    s.done
                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      : "bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90"
                  }`}
                >
                  {s.done ? "Xem kết quả" : "Bắt đầu →"}
                </button>
              </div>

              {/* Done bar mini-preview */}
              {s.done && s.key === "skills" && (
                <div className="px-4 pb-4 pt-1 border-t border-gray-50 mt-1">
                  <div className="flex gap-1.5">
                    {SURVEY_COMPLETED_RESULTS.skills.dims
                      .slice(0, 4)
                      .map((d) => (
                        <div key={d.label} className="flex-1">
                          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-1">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${d.score}%`,
                                backgroundColor: d.color,
                              }}
                            />
                          </div>
                          <p
                            className="text-xs text-center text-gray-400"
                            style={{ fontSize: 9 }}
                          >
                            {d.score}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {s.done && s.key === "mbti" && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-50 mt-1 flex items-center gap-2">
                  {["I", "N", "T", "J"].map((c, i) => (
                    <div
                      key={c}
                      className="flex-1 text-center py-1 rounded-lg text-sm font-black text-white"
                      style={{
                        background: [
                          "#8B5CF6",
                          "#EC4899",
                          "#F97316",
                          "#10B981",
                        ][i],
                      }}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
              {s.done && s.key === "holland" && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-50 mt-1 flex flex-wrap gap-1.5">
                  {SURVEY_COMPLETED_RESULTS.holland.dims.map((d) => (
                    <div key={d.label} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-xs text-gray-500">
                        {d.label.split(" ")[0]}
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {d.score}
                      </span>
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
