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

/* ── Dashboard ── */

export const CounselorDashboard = () => {
  const { studentsInClass, gradeData } = useAppData();

  const managedStudents = studentsInClass.length;

  const managedClasses = new Set(
    studentsInClass.map((student) => student.className),
  ).size;

  const completedSurveys = studentsInClass.filter(
    (student) => student.testStatus === "Hoàn thành",
  ).length;

  const supportNeeded = studentsInClass.filter(
    (student) => student.risk === "medium" || student.risk === "high",
  ).length;

  const gradeCompletionData = [
    ...gradeData.map((item) => ({
      grade: item.grade,
      done: item.tests,
      total: item.students,
    })),
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

        <p className="text-sm text-gray-500 mt-0.5">
          Tổng quan hoạt động học sinh · Năm học 2024–2025
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Học sinh quản lý"
          value={`${managedStudents}`}
          sub={`${managedClasses} lớp, ${gradeData.length} khối`}
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Bài học đã giao"
          value="24"
          sub="18 đã hoàn thành"
          icon={BookOpen}
          color="green"
        />

        <StatCard
          title="Khảo sát hoàn thành"
          value={`${Math.round((completedSurveys / Math.max(managedStudents, 1)) * 100)}%`}
          sub={`${completedSurveys} / ${managedStudents} HS`}
          icon={ClipboardList}
          color="yellow"
        />

        <StatCard
          title="Cần hỗ trợ"
          value={`${supportNeeded} HS`}
          sub="Medium/high risk"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Hoạt động trong tuần</h3>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} barSize={14}>
              <CartesianGrid
                key="grid"
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />

              <XAxis
                key="x"
                dataKey="day"
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

              <Tooltip key="tip" />

              <Bar
                key="lessons"
                dataKey="lessons"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Bài học"
              />

              <Bar
                key="surveys"
                dataKey="surveys"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
                name="Khảo sát"
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-blue-500" />
              Bài học
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded bg-amber-400" />
              Khảo sát
            </div>
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

                    <span className="font-mono font-bold">
                      {g.done}/{g.total}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">
            🔴 Học sinh cần hỗ trợ ngay
          </h3>

          <div className="space-y-2.5">
            {studentsInClass
              .filter((s) => s.risk === "high" || s.risk === "medium")
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50"
                >
                  <Avatar name={s.name} size="sm" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {s.name}
                    </p>

                    <p className="text-xs text-gray-500 font-mono">
                      {s.id} · Hồ sơ {s.progress}%
                    </p>
                  </div>

                  <RiskBadge level={s.risk} />
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">
            📅 Lịch tư vấn sắp tới
          </h3>

          <div className="space-y-2.5">
            {[
              {
                name: "Nguyễn Minh Anh",
                date: "Hôm nay 14:00",
                type: "Định hướng học kỳ",
                cls: "bg-orange-100 text-orange-700",
              },

              {
                name: "Hoàng Thị Mai",
                date: "Ngày mai 09:30",
                type: "Review career test",
                cls: "bg-blue-100 text-blue-700",
              },

              {
                name: "Trần Đức Huy",
                date: "28/06 15:00",
                type: "Tư vấn chọn ngành",
                cls: "bg-emerald-100 text-emerald-700",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {a.name}
                  </p>

                  <p className="text-xs text-gray-500">{a.date}</p>
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.cls}`}
                >
                  {a.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

