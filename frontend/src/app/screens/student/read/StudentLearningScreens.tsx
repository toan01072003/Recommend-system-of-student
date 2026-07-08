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

export const StudentLessons = () => {
  const lessons = [
    {
      id: 1,
      title: "Giới thiệu về hướng nghiệp",
      tag: "Cơ bản",
      duration: "15 phút",
      progress: 100,
      emoji: "🌱",
    },
    {
      id: 2,
      title: "Khám phá sở thích cá nhân",
      tag: "Cơ bản",
      duration: "20 phút",
      progress: 100,
      emoji: "❤️",
    },
    {
      id: 3,
      title: "Ngành Kỹ thuật phần mềm là gì?",
      tag: "Khoa học & CN",
      duration: "25 phút",
      progress: 60,
      emoji: "💻",
    },
    {
      id: 4,
      title: "Ngành Y tế & Sức khỏe",
      tag: "Y tế",
      duration: "20 phút",
      progress: 0,
      emoji: "🩺",
    },
    {
      id: 5,
      title: "Kỹ năng mềm cần thiết",
      tag: "Kỹ năng",
      duration: "18 phút",
      progress: 0,
      emoji: "🤝",
    },
    {
      id: 6,
      title: "Thiết lập mục tiêu nghề nghiệp",
      tag: "Kế hoạch",
      duration: "22 phút",
      progress: 0,
      emoji: "🎯",
    },
  ];
  return (
    <div className="space-y-5">
      {" "}
      <div>
        {" "}
        <h1 className="text-xl font-bold text-gray-900">Bài học 📖</h1>{" "}
        <p className="text-sm text-gray-500 mt-0.5">
          2 / 6 bài đã hoàn thành
        </p>{" "}
      </div>{" "}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        {" "}
        <div
          className="h-3 rounded-full"
          style={{
            width: "33%",
            background: "linear-gradient(90deg,#F97316,#FBBF24)",
          }}
        />{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {" "}
        {lessons.map((l) => (
          <div
            key={l.id}
            className={`bg-white rounded-2xl p-4 border-2 flex items-center gap-4 shadow-sm transition-all hover:shadow-md cursor-pointer ${l.progress === 100 ? "border-emerald-200" : l.progress > 0 ? "border-orange-200" : "border-gray-100"}`}
          >
            {" "}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${l.progress === 100 ? "bg-emerald-100" : l.progress > 0 ? "bg-orange-100" : "bg-gray-100"}`}
            >
              {" "}
              {l.progress === 100 ? "✅" : l.emoji}{" "}
            </div>{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {" "}
                <h3 className="font-bold text-gray-800 text-sm">
                  {l.title}
                </h3>{" "}
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                  {l.tag}
                </span>{" "}
              </div>{" "}
              <p className="text-xs text-gray-500 mb-2">⏱ {l.duration}</p>{" "}
              {l.progress > 0 && l.progress < 100 && (
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-32">
                  {" "}
                  <div
                    className="h-1.5 rounded-full bg-orange-400"
                    style={{ width: `${l.progress}%` }}
                  />{" "}
                </div>
              )}{" "}
            </div>{" "}
            <button
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${l.progress === 100 ? "bg-emerald-100 text-emerald-700" : l.progress > 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {" "}
              {l.progress === 100
                ? "Xem lại"
                : l.progress > 0
                  ? "Tiếp tục"
                  : "Bắt đầu"}{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
};

export const StudentAssignment = () => {
  const assignments = [
    {
      title: "Viết về ước mơ nghề nghiệp của bạn",
      due: "28/06/2025",
      subject: "Hướng nghiệp",
      done: true,
      emoji: "✍️",
    },
    {
      title: "Nghiên cứu 3 ngành nghề phù hợp",
      due: "05/07/2025",
      subject: "Khám phá",
      done: false,
      urgent: true,
      emoji: "🔍",
    },
    {
      title: "Lập kế hoạch học tập học kỳ 2",
      due: "10/07/2025",
      subject: "Kế hoạch",
      done: false,
      urgent: false,
      emoji: "📋",
    },
    {
      title: "Phỏng vấn thử với cố vấn",
      due: "15/07/2025",
      subject: "Kỹ năng",
      done: false,
      urgent: false,
      emoji: "🎤",
    },
  ];
  return (
    <div className="space-y-5">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div>
          {" "}
          <h1 className="text-xl font-bold text-gray-900">Bài tập ✅</h1>{" "}
          <p className="text-sm text-gray-500 mt-0.5">
            1 hoàn thành · 3 còn lại
          </p>{" "}
        </div>{" "}
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black text-emerald-600 bg-emerald-100">
          25%
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {" "}
        {assignments.map((a, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-4 border-2 flex gap-4 shadow-sm ${a.done ? "border-emerald-200 opacity-75" : a.urgent ? "border-red-200" : "border-gray-100"}`}
          >
            {" "}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${a.done ? "bg-emerald-100" : a.urgent ? "bg-red-50" : "bg-amber-50"}`}
            >
              {" "}
              {a.done ? "✅" : a.emoji}{" "}
            </div>{" "}
            <div className="flex-1">
              {" "}
              <div className="flex items-start justify-between gap-2">
                {" "}
                <h3
                  className={`font-bold text-sm ${a.done ? "line-through text-gray-400" : "text-gray-800"}`}
                >
                  {a.title}
                </h3>{" "}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${a.done ? "bg-emerald-100 text-emerald-700" : a.urgent ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}
                >
                  {" "}
                  {a.done ? "Xong" : a.urgent ? "Gấp!" : "Chờ nộp"}{" "}
                </span>{" "}
              </div>{" "}
              <p className="text-xs text-gray-500 mt-1">
                📅 Hạn nộp: {a.due} · 📌 {a.subject}
              </p>{" "}
            </div>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
};
export const StudentGames = () => {
  const games = [
    {
      emoji: "🏙️",
      title: "City Builder Career",
      desc: "Xây dựng thành phố, khám phá 20 nghề nghiệp khác nhau",
      tag: "Mô phỏng",
      xp: 150,
      played: true,
    },
    {
      emoji: "🔬",
      title: "Science Lab Adventure",
      desc: "Thí nghiệm khoa học thú vị — dành cho ai yêu Lý, Hóa",
      tag: "Khoa học",
      xp: 200,
      played: false,
    },
    {
      emoji: "💼",
      title: "Mini CEO Challenge",
      desc: "Điều hành công ty nhỏ, học kỹ năng kinh doanh cơ bản",
      tag: "Kinh tế",
      xp: 180,
      played: false,
    },
    {
      emoji: "🎨",
      title: "Design Studio Game",
      desc: "Tạo ra sản phẩm thiết kế, khám phá ngành sáng tạo",
      tag: "Nghệ thuật",
      xp: 120,
      played: false,
    },
    {
      emoji: "🩺",
      title: "Virtual Hospital",
      desc: "Trải nghiệm làm bác sĩ, y tá trong bệnh viện ảo",
      tag: "Y tế",
      xp: 250,
      played: false,
    },
  ];
  return (
    <div className="space-y-5">
      {" "}
      <div>
        {" "}
        <h1 className="text-xl font-bold text-gray-900">Real Games 🎮</h1>{" "}
        <p className="text-sm text-gray-500 mt-0.5">
          Khám phá nghề nghiệp qua trò chơi thực tế
        </p>{" "}
      </div>{" "}
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl p-4 flex items-center gap-4 text-white shadow-md">
        {" "}
        <span className="text-4xl">🏆</span>{" "}
        <div>
          {" "}
          <p className="text-xs text-white/80 font-semibold">
            Điểm XP của bạn
          </p>{" "}
          <p className="text-3xl font-black">150 XP</p>{" "}
          <p className="text-xs text-white/70">Hạng 12 trong lớp 9A</p>{" "}
        </div>{" "}
        <div className="ml-auto text-right">
          {" "}
          <p className="text-xs text-white/80">Huy hiệu đạt được</p>{" "}
          <div className="flex gap-1 mt-1">
            {" "}
            {["🥉", "🔬", "🌱"].map((b) => (
              <span key={b} className="text-xl">
                {b}
              </span>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {" "}
        {games.map((g) => (
          <div
            key={g.title}
            className={`bg-white rounded-2xl p-4 border-2 flex items-center gap-4 shadow-sm ${g.played ? "border-violet-200" : "border-gray-100 hover:border-violet-200"} transition-all cursor-pointer`}
          >
            {" "}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${g.played ? "bg-violet-100" : "bg-gray-100"}`}
            >
              {" "}
              {g.emoji}{" "}
            </div>{" "}
            <div className="flex-1 min-w-0">
              {" "}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {" "}
                <h3 className="font-bold text-gray-800 text-sm">
                  {g.title}
                </h3>{" "}
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">
                  {g.tag}
                </span>{" "}
              </div>{" "}
              <p className="text-xs text-gray-500 mb-1">{g.desc}</p>{" "}
              <p className="text-xs font-bold text-amber-600">
                ⭐ +{g.xp} XP
              </p>{" "}
            </div>{" "}
            <button
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 ${g.played ? "bg-violet-100 text-violet-700" : "bg-violet-500 text-white"}`}
            >
              {" "}
              {g.played ? "Chơi lại" : "Chơi ngay"}{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}; // Career detail view
