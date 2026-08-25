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
import { useT } from "../../../i18n";

export const CounselorReportBase = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const t = useT();

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">{t(title)}</h1>

      {children}
    </div>
  );
};

export const CounselorReportLessonProgress = () => {
  const t = useT();
  const { studentsInClass } = useAppData();
  const totalStudents = studentsInClass.length;
  const averageProgress = totalStudents
    ? Math.round(
        studentsInClass.reduce((sum, student) => sum + student.progress, 0) /
          totalStudents,
      )
    : 0;
  const onTrackCount = studentsInClass.filter(
    (student) => student.progress >= 90,
  ).length;
  const needsAttentionCount = totalStudents - onTrackCount;
  const classProgress = Array.from(
    studentsInClass
      .reduce(
        (classes, student) => {
          const current = classes.get(student.className) ?? {
            name: student.className,
            students: 0,
            totalProgress: 0,
            onTrack: 0,
          };

          current.students += 1;
          current.totalProgress += student.progress;
          if (student.progress >= 90) current.onTrack += 1;
          classes.set(student.className, current);
          return classes;
        },
        new Map<
          string,
          {
            name: string;
            students: number;
            totalProgress: number;
            onTrack: number;
          }
        >(),
      )
      .values(),
  )
    .map((item) => ({
      ...item,
      average: Math.round(item.totalProgress / item.students),
      needsAttention: item.students - item.onTrack,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const summaryCards = [
    {
      label: "Học sinh",
      value: totalStudents.toString(),
      sub: "Tổng trong database",
      icon: Users,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Tiến độ trung bình",
      value: `${averageProgress}%`,
      sub: "Theo dữ liệu học sinh",
      icon: TrendingUp,
      iconClass: "bg-orange-50 text-orange-600",
    },
    {
      label: "Đạt từ 90%",
      value: onTrackCount.toString(),
      sub: totalStudents
        ? `${Math.round((onTrackCount / totalStudents) * 100)}% học sinh`
        : "0% học sinh",
      icon: CheckCircle,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Cần theo dõi",
      value: needsAttentionCount.toString(),
      sub: "Tiến độ dưới 90%",
      icon: AlertTriangle,
      iconClass: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <CounselorReportBase title="Tiến độ bài học">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-3"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconClass}`}
            >
              <card.icon size={19} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">
                {t(card.label)}
              </p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t(card.sub)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">{t("Tiến độ theo lớp")}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="text-left font-semibold px-5 py-3">{t("Lớp")}</th>
                <th className="text-center font-semibold px-5 py-3">
                  {t("Học sinh")}
                </th>
                <th className="text-left font-semibold px-5 py-3 min-w-52">
                  {t("Tiến độ trung bình")}
                </th>
                <th className="text-center font-semibold px-5 py-3">
                  {t("Đạt từ 90%")}
                </th>
                <th className="text-center font-semibold px-5 py-3">
                  {t("Cần theo dõi")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {classProgress.length ? (
                classProgress.map((item) => (
                  <tr key={item.name} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3 font-bold text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-5 py-3 text-center text-gray-600">
                      {item.students}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${item.average}%` }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono font-bold text-gray-700">
                          {item.average}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-emerald-700">
                      {item.onTrack}
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-amber-700">
                      {item.needsAttention}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-gray-500"
                  >
                    {t("Chưa có dữ liệu học sinh")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CounselorReportBase>
  );
};

export const CounselorReportStudentWork = () => {
  const t = useT();

  return (
  <CounselorReportBase title="📋 Bài làm học sinh">
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
          <p className="text-white/70 text-xs">{t(l)}</p>
          <p className="text-3xl font-black">{v}</p>
          <p className="text-white/70 text-xs">{t(s)}</p>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4">
        {t("Tiến độ nộp bài theo tuần")}
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
};

export const CounselorReportEngagement = () => {
  const t = useT();
  const { studentsInClass } = useAppData();

  return (
    <CounselorReportBase title="📊 Tương tác">
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
            <p className="text-white/70 text-xs">{t(l)}</p>
            <p className="text-2xl font-black">{v}</p>
            <p className="text-white/70 text-xs">{t(s)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">
          {t("Học sinh ít tương tác nhất")}
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
                    {t("Hồ sơ")} {s.progress}% · {t(s.testStatus)}
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

