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
import { useT } from "../../i18n";

// ── Screen 6: Teacher Data Entry ─────────────────────────────────────────────

export const TeacherEntry = () => {
  const t = useT();
  const [autosaved, setAutosaved] = useState(false);

  const markSaved = () => setAutosaved(true);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {t("Nhập dữ liệu học sinh")}
        </h1>

        <p className="text-sm text-gray-500 mt-0.5">
          {t("Lớp 9A")} · {t("Lưu tự động khi thay đổi")}
        </p>
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
              <CheckCircle size={12} /> {t("Đã lưu tự động")}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            "Toán",
            "Ngữ văn",
            "Vật lý",
            "Hóa học",
            "Sinh học",
            "Tiếng Anh",
          ].map((sub) => (
            <div key={sub}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("Điểm")} {t(sub)}
              </label>

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Môn học nổi bật")}
          </label>

          <div className="flex flex-wrap gap-2">
            {[
              "Toán",
              "Vật lý",
              "Tin học",
              "Ngữ văn",
              "Tiếng Anh",
              "Hóa học",
              "Sinh học",
            ].map((s) => (
              <button
                key={s}

                onClick={markSaved}

                className="px-3 py-1.5 text-sm border-2 border-gray-200 rounded-full hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
              >
                {t(s)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("Hoạt động ngoại khóa")}
          </label>

          <input
            onChange={markSaved}

            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"

            placeholder={t("VD: CLB Toán, CLB Robotics, Đội tuyển học sinh giỏi...")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("Thành tích & Giải thưởng")}
          </label>

          <input
            onChange={markSaved}

            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"

            placeholder={t("VD: Giải Nhì Toán cấp Quận 2024, Học sinh giỏi...")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("Nhận xét học tập")}
          </label>

          <textarea
            onChange={markSaved}

            rows={3}

            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"

            placeholder={t("Học sinh có tư duy logic tốt, nổi bật ở Toán và Tin học...")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {t("Nhận xét hành vi học tập")}
          </label>

          <textarea
            onChange={markSaved}

            rows={2}

            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"

            placeholder={t("Chủ động, nghiêm túc, tích cực tham gia thảo luận...")}
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-gray-100">
          <button className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
            {t("Lưu nháp")}
          </button>

          <button className="px-4 py-2.5 border border-blue-200 bg-blue-50 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-100 flex items-center gap-2">
            <MessageSquare size={14} /> {t("Gửi cố vấn")}
          </button>

          <button className="ml-auto px-5 py-2.5 bg-[#EA580C] text-white rounded-xl text-sm font-bold hover:bg-[#C2410C] flex items-center gap-2">
            <Save size={14} /> {t("Hoàn tất cập nhật")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Screen 7: Counseling Workspace ───────────────────────────────────────────

export const CounselingWorkspace = () => {
  const t = useT();
  const [note, setNote] = useState("");

  const plans = [
    {
      period: "Ngắn hạn (3 tháng)",

      items: [
        "Hoàn thành bộ test MBTI + Holland",
        "Tham gia CLB Robotics",
        "Ôn thi học sinh giỏi Toán",
      ],

      bg: "bg-blue-50",
      border: "border-blue-100",
      textHdr: "text-blue-700",
      dot: "bg-blue-400",
    },

    {
      period: "Trung hạn (1 năm)",

      items: [
        "Học lập trình Python cơ bản",
        "Tham gia dự án STEM trường",
        "Tìm hiểu ngành CNTT tại ĐH",
      ],

      bg: "bg-indigo-50",
      border: "border-indigo-100",
      textHdr: "text-indigo-700",
      dot: "bg-indigo-400",
    },

    {
      period: "Dài hạn (đến lớp 12)",

      items: [
        "Xây dựng portfolio dự án cá nhân",
        "Chuẩn bị hồ sơ ĐH top tier",
        "Thi chứng chỉ quốc tế IELTS/SAT",
      ],

      bg: "bg-purple-50",
      border: "border-purple-100",
      textHdr: "text-purple-700",
      dot: "bg-purple-400",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{t("Không gian Tư vấn")}</h1>

        <p className="text-sm text-gray-500 mt-0.5">
          Nguyễn Minh Anh · HS001 · Lớp 9A
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">
              {t("Kế hoạch hành động")}
            </h3>

            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.period}
                  className={`p-4 rounded-xl ${plan.bg} border ${plan.border}`}
                >
                  <p className={`text-sm font-bold mb-2 ${plan.textHdr}`}>
                    {plan.period}
                  </p>

                  <ul className="space-y-1.5">
                    {plan.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${plan.dot}`}
                        />

                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              {t("Ghi chú buổi tư vấn hôm nay")}
            </h3>

            <textarea
              value={note}

              onChange={(e) => setNote(e.target.value)}

              rows={4}

              placeholder={t("Ghi lại nội dung, kết quả và cam kết của buổi tư vấn hôm nay...")}

              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

            <div className="flex justify-end gap-2 mt-3">
              <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium">
                {t("Hủy")}
              </button>

              <button className="px-4 py-2 bg-[#EA580C] text-white rounded-xl text-sm font-bold hover:bg-[#C2410C] flex items-center gap-2">
                <Save size={13} /> {t("Lưu ghi chú")}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              {t("Gợi ý hành động")}
            </h3>

            <div className="space-y-1.5">
              {[
                { icon: BookOpen, label: "Chọn tổ hợp A00 hoặc A01" },

                { icon: Users, label: "Tham gia CLB Tin học" },

                { icon: Award, label: "Học chứng chỉ Python / C++" },

                { icon: Target, label: "Tìm hiểu ĐH Bách Khoa, UIT" },

                { icon: Briefcase, label: "Shadow day tại công ty tech" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <item.icon size={14} className="text-orange-600" />
                  </div>

                  <span className="text-sm text-gray-700 flex-1">
                    {item.label}
                  </span>

                  <Plus
                    size={14}
                    className="text-gray-300 group-hover:text-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">
              {t("Kết quả bài test")}
            </h3>

            <div className="space-y-2.5">
              {[
                { label: "MBTI", value: "INTJ" },

                { label: "Holland", value: "I–C–R" },

                { label: "DISC", value: "C–D" },

                { label: "Career Match", value: "KH & CN" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-gray-500">{r.label}</span>

                  <span className="text-sm font-bold text-gray-800 font-mono">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
