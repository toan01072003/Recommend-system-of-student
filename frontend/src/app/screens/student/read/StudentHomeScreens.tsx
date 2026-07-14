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
import {
  fetchMeetings,
  fetchStudentCommonReferences,
  syncReferenceActions,
  type MeetingRecord,
} from "../../../api/client";
import {
  careerReferenceActions,
  currentStudentReferenceId,
  referenceEmotionMeta,
} from "../../../logic/referenceActions";

const studentMeetingDate = (meeting: MeetingRecord) => new Date(meeting.scheduledAt);

const sameStudentMeetingDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const formatStudentMeetingTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const time = date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameStudentMeetingDay(date, now)) return `Hôm nay ${time}`;
  if (sameStudentMeetingDay(date, tomorrow)) return `Ngày mai ${time}`;

  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── Screen 8: Student Career Portal ─────────────────────────────────────────
export const StudentPortal = () => {
  const [step, setStep] = useState<"home" | "test" | "result">("home");
  const [interests, setInterests] = useState<string[]>([]);
  const [testQ, setTestQ] = useState(0);

  // ── Result view ──
  if (step === "result") {
    const results = [
      {
        emoji: "🖥️",
        field: "Khoa học & Công nghệ",
        match: 92,
        desc: "Tư duy logic, yêu thích kỹ thuật số",
        grad: "from-violet-500 to-indigo-500",
        top: true,
      },
      {
        emoji: "📐",
        field: "Toán học & Nghiên cứu",
        match: 81,
        desc: "Khả năng phân tích và sáng tạo cao",
        grad: "from-blue-500 to-cyan-400",
        top: false,
      },
      {
        emoji: "⚙️",
        field: "Kỹ thuật & Xây dựng",
        match: 74,
        desc: "Thích giải quyết vấn đề thực tiễn",
        grad: "from-teal-500 to-emerald-400",
        top: false,
      },
    ];
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <div className="text-center py-2">
          <div className="text-5xl mb-3 animate-bounce">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900">
            Kết quả của bạn đây!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Dựa trên bài test và sở thích cá nhân
          </p>
        </div>

        <div className="space-y-3">
          {results.map((item, i) => (
            <div
              key={item.field}
              className={`rounded-2xl p-1 bg-gradient-to-r ${item.grad} shadow-md`}
              style={{ transform: i === 0 ? "scale(1.02)" : undefined }}
            >
              <div className="bg-white rounded-xl p-4 flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.grad} flex items-center justify-center text-3xl flex-shrink-0 shadow-sm`}
                >
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  {item.top && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full mb-1 inline-block">
                      ⭐ Phù hợp nhất với bạn
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900">{item.field}</h3>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full bg-gradient-to-r ${item.grad} transition-all duration-700`}
                        style={{ width: `${item.match}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-800 font-mono w-10 text-right">
                      {item.match}%
                    </span>
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
              {
                e: "📚",
                l: "Tập trung Toán, Lý, Tin",
                bg: "bg-blue-100 text-blue-700",
              },
              {
                e: "🤖",
                l: "Tham gia CLB Robotics",
                bg: "bg-violet-100 text-violet-700",
              },
              {
                e: "💻",
                l: "Học lập trình Python",
                bg: "bg-emerald-100 text-emerald-700",
              },
            ].map((a) => (
              <div
                key={a.l}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl ${a.bg} text-center`}
              >
                <span className="text-2xl">{a.e}</span>
                <span className="text-xs font-bold leading-tight">{a.l}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setStep("home");
            setInterests([]);
            setTestQ(0);
          }}
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
            <span className="text-sm font-bold text-orange-600">
              Câu {testQ + 1} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs text-gray-400">
              {Math.round(progress)}% hoàn thành
            </span>
          </div>
          <div className="h-3.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-3.5 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #F97316, #EC4899)",
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border-2 border-violet-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-violet-400 to-indigo-400" />
          <div className="p-6">
            <div className="text-4xl mb-4 text-center">🤔</div>
            <p className="text-lg font-bold text-gray-900 mb-5 text-center leading-snug">
              {current.q}
            </p>
            <div className="space-y-2.5">
              {current.opts.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => {
                    if (testQ < QUIZ_QUESTIONS.length - 1)
                      setTestQ((q) => q + 1);
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

        <button
          onClick={() => {
            setStep("home");
            setTestQ(0);
          }}
          className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
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
        style={{
          background:
            "linear-gradient(135deg, #F97316 0%, #EC4899 50%, #8B5CF6 100%)",
        }}
      >
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute bottom-3 right-20 w-12 h-12 rounded-full bg-white/10" />
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-semibold">Xin chào 👋</p>
          <h1 className="text-2xl font-bold mt-0.5 mb-1">Minh Anh ơi!</h1>
          <p className="text-white/80 text-sm mb-5">
            Hãy cùng khám phá nghề nghiệp phù hợp nhất với bạn nhé 🌟
          </p>
          <div className="bg-white/20 rounded-2xl p-3.5 backdrop-blur-sm">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-bold text-white/90">
                Hồ sơ hướng nghiệp
              </span>
              <span className="text-xs font-bold text-white">62% ✨</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full bg-white transition-all"
                style={{ width: "62%" }}
              />
            </div>
            <p className="text-xs text-white/70 mt-1.5">
              Còn 38% nữa là hoàn thiện hồ sơ! 💪
            </p>
          </div>
        </div>
      </div>

      {/* Nudge to-do */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <span className="text-2xl flex-shrink-0">⚡</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">
            Bạn chưa làm bài test MBTI!
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Chỉ 3 câu hỏi thôi — biết ngay bạn phù hợp với nghề nào nhé!
          </p>
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
            <h3 className="font-bold text-white text-base mb-0.5">
              Làm bài test hướng nghiệp
            </h3>
            <p className="text-white/80 text-xs">
              Khám phá nghề nghiệp phù hợp nhất với bạn!
            </p>
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
            style={{
              background: `linear-gradient(135deg, ${card.from}, ${card.to})`,
            }}
          >
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/20 group-hover:scale-110 transition-transform" />
            <div className="relative z-10">
              <span className="text-2xl block mb-2">{card.emoji}</span>
              <h3 className="font-bold text-white text-sm mb-1 leading-tight">
                {card.title}
              </h3>
              <p className="text-white/80 text-xs mb-2.5 leading-relaxed">
                {card.desc}
              </p>
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
        <p className="text-xs text-gray-500 mb-4">
          Chọn những lĩnh vực bạn yêu thích để gợi ý chính xác hơn
        </p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_CHIPS.map((chip) => (
            <button
              key={chip.id}
              onClick={() =>
                setInterests((prev) =>
                  prev.includes(chip.id)
                    ? prev.filter((x) => x !== chip.id)
                    : [...prev, chip.id],
                )
              }
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
            <span>✨</span> Đã chọn {interests.length} sở thích — đã lưu tự
            động!
          </p>
        )}
      </div>
    </div>
  );
};

// ── Student sub-screens ───────────────────────────────────────────────────────

export const StudentDashboard = ({
  setView,
}: {
  setView: (v: string) => void;
}) => {
  const { studentsInClass: appStudents } = useAppData();
  const selectedStudentId = currentStudentReferenceId();
  const student =
    appStudents.find((item) => item.id === selectedStudentId) ??
    appStudents[0] ??
    null;
  const studentId = student?.id ?? selectedStudentId;
  const studentName = student?.name ?? "Học sinh";
  const shortName = studentName.split(/\s+/).slice(-2).join(" ") || studentName;
  const profileProgress = Math.max(
    0,
    Math.min(100, Math.round(Number(student?.progress ?? 0))),
  );
  const remainingProgress = Math.max(0, 100 - profileProgress);
  const surveyDone = student?.testStatus === "Hoàn thành";
  const exploredCareers = student?.exploredCareers ?? [];
  const exploredCount = exploredCareers.length;
  const topCareer =
    student?.latestRecommendCareer ||
    student?.currentExploredCareer ||
    student?.favoriteCareer ||
    student?.careerFit ||
    "ngành phù hợp";
  const averageScore =
    student?.avg !== undefined ? Number(student.avg).toFixed(1) : "-";
  const [referenceSummary, setReferenceSummary] = useState({
    selected: 0,
    total: careerReferenceActions().length,
    highlight: "Chưa chọn cảm xúc nào",
    loading: true,
  });
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [meetingsStatus, setMeetingsStatus] = useState<
    "loading" | "idle" | "error"
  >("loading");

  useEffect(() => {
    const controller = new AbortController();
    const actions = careerReferenceActions();

    setReferenceSummary((current) => ({
      ...current,
      total: actions.length,
      loading: true,
    }));
    syncReferenceActions(actions, controller.signal)
      .then(() => fetchStudentCommonReferences(studentId, controller.signal))
      .then((payload) => {
        const references = payload.references.length
          ? payload.references
          : [];
        const selected = references.filter((item) => item.emotion).length;
        const highlighted =
          references.find((item) => item.emotion === "passion") ??
          references.find((item) => item.emotion === "like") ??
          references.find((item) => item.emotion);
        const emotion = referenceEmotionMeta(highlighted?.emotion);

        setReferenceSummary({
          selected,
          total: references.length,
          highlight: highlighted
            ? `${emotion?.label ?? "Đã chọn"}: ${highlighted.label}`
            : "Chưa chọn cảm xúc nào",
          loading: false,
        });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setReferenceSummary({
          selected: 0,
          total: actions.length,
          highlight: "Không tải được References",
          loading: false,
        });
      });

    return () => controller.abort();
  }, [studentId]);

  useEffect(() => {
    const controller = new AbortController();
    setMeetingsStatus("loading");
    fetchMeetings({ role: "student", studentId }, controller.signal)
      .then((payload) => {
        setMeetings(payload.meetings);
        setMeetingsStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setMeetingsStatus("error");
      });

    return () => controller.abort();
  }, [studentId]);

  const shouldCompleteReferences =
    referenceSummary.total > 0 &&
    referenceSummary.selected < referenceSummary.total;
  const nudge = shouldCompleteReferences
      ? {
        title: "Bạn còn hành động chung chưa có cảm xúc.",
        body: `Đã chọn ${referenceSummary.selected}/${referenceSummary.total}. Mở References để xem và tiếp tục cập nhật.`,
        action: "Mở References",
        view: "st-references",
      }
    : surveyDone
      ? {
          title: "Dữ liệu hướng nghiệp đã được cập nhật.",
          body: `Hồ sơ ${studentId} đang ghi nhận ${topCareer} là hướng quan tâm hiện tại.`,
          action: "Khám phá thêm",
          view: "st-explore",
        }
      : {
          title: "Bạn chưa làm bài khảo sát hướng nghiệp.",
          body: "Hoàn thành khảo sát để cố vấn có dữ liệu mới nhất từ database.",
          action: "Làm ngay",
          view: "st-surveys",
        };

  const quickStats = [
    {
      emoji: "🧑‍🎓",
      label: "Hồ sơ",
      value: `${profileProgress}%`,
      sub: student?.riasecTop3 ? `RIASEC ${student.riasecTop3}` : "Từ database",
      bg: "from-orange-400 to-amber-400",
    },
    {
      emoji: "📝",
      label: "Khảo sát",
      value: surveyDone ? "Đã làm" : "Cần làm",
      sub: student?.testStatus ?? "Chưa có dữ liệu",
      bg: "from-pink-500 to-rose-400",
    },
    {
      emoji: "🧭",
      label: "Khám phá",
      value: `${exploredCount}`,
      sub: topCareer,
      bg: "from-emerald-500 to-teal-400",
    },
    {
      emoji: "📌",
      label: "References",
      value: referenceSummary.loading
        ? "..."
        : `${referenceSummary.selected}/${referenceSummary.total}`,
      sub: referenceSummary.highlight,
      bg: "from-violet-500 to-indigo-500",
    },
  ];
  const todayTasks = [
    {
      label: shouldCompleteReferences
        ? "Chọn cảm xúc cho các hành động chung"
        : "References đã đồng bộ với database",
      tag: "References",
      tagCls: "bg-violet-100 text-violet-700",
      done: !shouldCompleteReferences,
      view: "st-references",
    },
    {
      label: surveyDone
        ? "Khảo sát hướng nghiệp đã hoàn thành"
        : "Làm khảo sát hướng nghiệp",
      tag: "Surveys",
      tagCls: "bg-pink-100 text-pink-700",
      done: surveyDone,
      view: "st-surveys",
    },
    {
      label: exploredCount
        ? `Tiếp tục khám phá ${topCareer}`
        : "Khám phá ngành nghề đầu tiên",
      tag: "Explore",
      tagCls: "bg-orange-100 text-orange-700",
      done: exploredCount > 0,
      view: "st-explore",
    },
  ];
  const upcomingMeetings = [...meetings]
    .filter((meeting) => {
      const date = studentMeetingDate(meeting);
      return !Number.isNaN(date.getTime()) && date >= new Date();
    })
    .sort((a, b) => studentMeetingDate(a).getTime() - studentMeetingDate(b).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-5">
      <div
        className="rounded-3xl p-6 text-white relative overflow-hidden shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, #F97316 0%, #EC4899 55%, #8B5CF6 100%)",
        }}
      >
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute bottom-3 right-20 w-12 h-12 rounded-full bg-white/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <p className="text-white/80 text-sm font-semibold">Xin chào 👋</p>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
              DB: {studentId}
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-0.5 mb-1">{shortName} ơi!</h1>
          <p className="text-white/80 text-sm mb-4">
            Điểm TB <strong className="text-white">{averageScore}</strong> ·{" "}
            Nhóm quan tâm <strong className="text-white">{topCareer}</strong>
          </p>
          <div className="bg-white/20 rounded-2xl p-3.5 backdrop-blur-sm">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-bold text-white/90">
                Hồ sơ hướng nghiệp
              </span>
              <span className="text-xs font-bold text-white">
                {profileProgress}%
              </span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-3 rounded-full bg-white"
                style={{ width: `${profileProgress}%` }}
              />
            </div>
            <p className="text-xs text-white/70 mt-1.5">
              {remainingProgress > 0
                ? `Còn ${remainingProgress}% nữa là hoàn thiện hồ sơ.`
                : "Hồ sơ đã hoàn thiện theo dữ liệu hiện tại."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <span className="text-2xl flex-shrink-0">⚡</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-amber-800">{nudge.title}</p>
          <p className="text-xs text-amber-600 mt-0.5">{nudge.body}</p>
        </div>
        <button
          onClick={() => setView(nudge.view)}
          className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-sm transition-colors"
        >
          {nudge.action} →
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-4 bg-gradient-to-br ${card.bg} text-white shadow-sm min-h-32`}
          >
            <span className="text-2xl block mb-1">{card.emoji}</span>
            <p className="text-2xl font-bold leading-tight">{card.value}</p>
            <p className="text-xs font-bold opacity-90">{card.label}</p>
            <p className="text-xs opacity-75 mt-0.5 line-clamp-2">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>📅</span> Việc cần làm hôm nay
        </h3>
        <div className="space-y-2">
          {todayTasks.map((item) => (
            <button
              key={item.tag}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left ${item.done ? "opacity-60" : "hover:bg-orange-50"} transition-colors`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done ? "border-emerald-500 bg-emerald-500" : "border-gray-300"}`}
              >
                {item.done && <CheckCircle size={12} className="text-white" />}
              </div>
              <span
                className={`text-sm flex-1 ${item.done ? "text-gray-400" : "text-gray-700 font-medium"}`}
              >
                {item.label}
              </span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${item.tagCls}`}
              >
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span>🗓️</span> Lịch tư vấn sắp tới
          </h3>
          <button
            onClick={() => setView("st-meeting")}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Xem lịch
          </button>
        </div>

        <div className="space-y-2.5">
          {meetingsStatus === "loading" ? (
            <p className="rounded-xl bg-gray-50 px-3 py-4 text-sm text-gray-500">
              Đang tải lịch tư vấn từ database...
            </p>
          ) : meetingsStatus === "error" ? (
            <p className="rounded-xl bg-red-50 px-3 py-4 text-sm font-semibold text-red-700">
              Không tải được lịch tư vấn.
            </p>
          ) : upcomingMeetings.length === 0 ? (
            <p className="rounded-xl bg-gray-50 px-3 py-4 text-sm text-gray-500">
              Bạn chưa có lịch tư vấn sắp tới.
            </p>
          ) : (
            upcomingMeetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => setView("st-meeting")}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 text-left transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    meeting.meetingType === "online"
                      ? "bg-violet-100 text-violet-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <Clock size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {meeting.topic}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatStudentMeetingTime(meeting.scheduledAt)} · Cố vấn{" "}
                    {meeting.counselorName}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    meeting.meetingType === "online"
                      ? "bg-violet-100 text-violet-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {meeting.meetingType === "online" ? "Online" : "Offline"}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            emoji: "📌",
            title: "References",
            desc: "Xem cảm xúc theo hành động chung",
            action: () => setView("st-references"),
            bg: "bg-violet-50 border-violet-200",
            btn: "bg-violet-500 text-white",
          },
          {
            emoji: "🧭",
            title: "Khám phá ngành nghề",
            desc: "Chọn cảm xúc ngay khi xem từng hành động",
            action: () => setView("st-explore"),
            bg: "bg-orange-50 border-orange-200",
            btn: "bg-orange-500 text-white",
          },
          {
            emoji: "📝",
            title: "Khảo sát",
            desc: surveyDone ? "Xem lại bài đã hoàn thành" : "Làm khảo sát còn thiếu",
            action: () => setView("st-surveys"),
            bg: "bg-pink-50 border-pink-200",
            btn: "bg-pink-500 text-white",
          },
          {
            emoji: "📖",
            title: "Bài học",
            desc: "Tiếp tục lộ trình học tập",
            action: () => setView("st-lessons"),
            bg: "bg-emerald-50 border-emerald-200",
            btn: "bg-emerald-500 text-white",
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl p-4 border-2 ${card.bg} shadow-sm`}
          >
            <span className="text-3xl block mb-2">{card.emoji}</span>
            <h3 className="font-bold text-gray-800 text-sm mb-1">
              {card.title}
            </h3>
            <p className="text-xs text-gray-500 mb-3 min-h-8">{card.desc}</p>
            <button
              onClick={card.action}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${card.btn} flex items-center gap-1`}
            >
              Xem ngay <ArrowRight size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
