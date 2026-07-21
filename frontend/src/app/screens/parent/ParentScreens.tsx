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

// ── Screen 9: Parent Portal ───────────────────────────────────────────────────

export const ParentPortal = () => {
  const t = useT();

  return (
  <div className="space-y-5">
    <div>
      <h1 className="text-xl font-bold text-gray-900">
        {t("Cổng thông tin Phụ huynh")}
      </h1>

      <p className="text-sm text-gray-500 mt-0.5">
        {t("Theo dõi tiến độ của con")} — Nguyễn Minh Anh · {t("Lớp 9A")}
      </p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Hồ sơ hướng nghiệp"
        value="95%"
        sub="Gần hoàn thiện"
        icon={CheckCircle}
        color="green"
      />

      <StatCard
        title="Học lực"
        value="Giỏi"
        sub="ĐTB 8.5 · HK1"
        icon={BarChart2}
        color="blue"
      />

      <StatCard
        title="Nhóm ngành quan tâm"
        value="KH & CN"
        sub="Phù hợp 92%"
        icon={Star}
        color="navy"
      />

      <StatCard
        title="Buổi tư vấn"
        value="2 / 4"
        sub="Đã hoàn thành"
        icon={MessageSquare}
        color="yellow"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("Phụ huynh nên làm gì tiếp theo?")}
        </h3>

        <div className="space-y-2.5">
          {[
            {
              task: "Con cần hoàn thành bài test MBTI — nhắc nhở con làm trước 30/03",
              urgent: true,
            },

            {
              task: "Hỗ trợ con tìm hiểu về ngành CNTT qua sách, video, hoặc tham quan",
              urgent: false,
            },

            {
              task: "Cùng con tham dự Ngày hướng nghiệp tháng 4 tại trường",
              urgent: false,
            },

            {
              task: "Cân nhắc cho con học thêm lập trình tại trung tâm hoặc online",
              urgent: false,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-xl ${item.urgent ? "bg-amber-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}
            >
              {item.urgent ? (
                <AlertTriangle
                  size={14}
                  className="text-amber-500 mt-0.5 flex-shrink-0"
                />
              ) : (
                <ArrowRight
                  size={14}
                  className="text-gray-400 mt-0.5 flex-shrink-0"
                />
              )}

              <p className="text-sm text-gray-700">{item.task}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">
          {t("Cập nhật kỳ vọng gia đình")}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Định hướng học tập")}
            </label>

            <div className="flex gap-2 flex-wrap">
              {["Trong nước", "Du học", "Chưa quyết định"].map((opt, i) => (
                <button
                  key={opt}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${i === 0 ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {t(opt)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("Ngân sách dự kiến / năm học")}
            </label>

            <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>50 – 100 triệu đồng</option>

              <option>Dưới 50 triệu đồng</option>

              <option>100 – 200 triệu đồng</option>

              <option>Trên 200 triệu đồng</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("Kỳ vọng của gia đình")}
            </label>

            <textarea
              rows={3}

              defaultValue="Muốn con theo học ngành kỹ thuật hoặc CNTT tại các trường đại học uy tín trong nước."

              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button className="w-full py-2.5 bg-[#EA580C] text-white rounded-xl text-sm font-bold hover:bg-[#C2410C]">
            {t("Lưu cập nhật")}
          </button>
        </div>
      </div>
    </div>

    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
      <Lock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />

      <div>
        <p className="text-sm font-bold text-amber-800">
          {t("Lưu ý về dữ liệu Wellbeing")}
        </p>

        <p className="text-xs text-amber-700 mt-0.5">
          {t("Một số thông tin sức khỏe tinh thần của con không được hiển thị để bảo vệ quyền riêng tư của con em. Nếu cần biết thêm, vui lòng liên hệ trực tiếp với cố vấn hướng nghiệp tại trường.")}
        </p>
      </div>
    </div>
  </div>
  );
};
