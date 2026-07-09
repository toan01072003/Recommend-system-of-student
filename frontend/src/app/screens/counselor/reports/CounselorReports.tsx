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

