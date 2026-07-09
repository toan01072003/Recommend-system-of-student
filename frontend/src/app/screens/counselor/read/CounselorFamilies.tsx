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

