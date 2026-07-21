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
import { CounselorStudentDetail } from "../update/CounselorStudentDetail";
import { useT } from "../../../i18n";

/* ── Students List ── */

export const CounselorStudentList = ({
  studentId,
  navigate,
}: {
  studentId?: string;
  navigate: (v: string, params?: { studentId?: string }) => void;
}) => {
  const t = useT();
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
          {t("Đang tải hồ sơ học sinh")}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          {detailStatus === "error"
            ? t("Không tải được hồ sơ chi tiết từ API. Vui lòng thử lại sau.")
            : `${t("Đang lấy dữ liệu chi tiết cho")} ${selected?.name ?? studentId}.`}
        </p>
        <button
          onClick={() => navigate("co-students-list")}
          className="mt-5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700"
        >
          {t("Quay lại danh sách")}
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
      <h1 className="text-xl font-bold text-gray-900">
        {t("Danh sách Học sinh")} 👥
      </h1>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Tìm học sinh...")}

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
            {t(f.label)}
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
                  {t(h)}
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
                    {t("Chi tiết")} <ArrowRight size={11} />
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

