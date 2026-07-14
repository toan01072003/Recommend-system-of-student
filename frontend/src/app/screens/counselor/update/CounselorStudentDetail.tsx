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
  fetchStudentCommonReferences,
  fetchStudent,
  fetchStudentRecommendation,
  syncReferenceActions,
  type AdviceNoteRecord,
  type AdvicePriority,
  type MeetingRecord,
  type RecommendationResponse,
  type StudentCommonReferenceItem,
} from "../../../api/client";
import {
  careerReferenceActions,
  referenceEmotionMeta,
} from "../../../logic/referenceActions";
import {
  hasStudentProfileDetail,
  resolveStudentProfile,
  type StudentProfileRecord,
} from "../../../logic/studentProfile";

/* ── Student Detail ── */

export const CounselorStudentDetail = ({
  student,
  onBack,
}: {
  student: StudentProfileRecord;
  onBack: () => void;
}) => {
  const [tab, setTab] = useState("academic");
  const [alumniRecommendation, setAlumniRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [alumniStatus, setAlumniStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [alumniError, setAlumniError] = useState("");
  const [alumniConfirming, setAlumniConfirming] = useState(false);
  const [supportAction, setSupportAction] = useState<
    "schedule" | "message" | "advice"
  >("schedule");
  const [supportSchedule, setSupportSchedule] = useState("");
  const [supportTopic, setSupportTopic] = useState("Định hướng nghề nghiệp");
  const [supportMeetingType, setSupportMeetingType] = useState<
    "offline" | "online"
  >("offline");
  const [supportMeetingUrl, setSupportMeetingUrl] = useState("");
  const [supportAppointments, setSupportAppointments] = useState<
    MeetingRecord[]
  >([]);
  const [supportMeetingsStatus, setSupportMeetingsStatus] = useState<
    "idle" | "loading" | "saving" | "error"
  >("idle");
  const [messageDraft, setMessageDraft] = useState("");
  const [advisorMessages, setAdvisorMessages] = useState<
    { from: "counselor" | "student"; body: string; time: string }[]
  >([
    {
      from: "student",
      body: "Em muốn trao đổi thêm về ngành phù hợp với điểm mạnh của mình.",
      time: "09:10",
    },
  ]);
  const [adviceSubject, setAdviceSubject] = useState("Gợi ý bước tiếp theo");
  const [adviceNote, setAdviceNote] = useState("");
  const [advicePriority, setAdvicePriority] =
    useState<AdvicePriority>("medium");
  const [adviceHistory, setAdviceHistory] = useState<AdviceNoteRecord[]>([]);
  const [adviceStatus, setAdviceStatus] = useState<
    "idle" | "loading" | "saving" | "error"
  >("idle");
  const [actionNotice, setActionNotice] = useState("");
  const [referenceItems, setReferenceItems] = useState<
    StudentCommonReferenceItem[]
  >([]);
  const [unmappedReferenceCount, setUnmappedReferenceCount] = useState(0);
  const [referenceStatus, setReferenceStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [referenceError, setReferenceError] = useState("");

  useEffect(() => {
    setAlumniRecommendation(null);
    setAlumniStatus("idle");
    setAlumniError("");
    setAlumniConfirming(false);
    setSupportAction("schedule");
    setSupportSchedule("");
    setSupportTopic("Định hướng nghề nghiệp");
    setSupportMeetingType("offline");
    setSupportMeetingUrl("");
    setSupportAppointments([]);
    setSupportMeetingsStatus("idle");
    setMessageDraft("");
    setAdvisorMessages([
      {
        from: "student",
        body: "Em muốn trao đổi thêm về ngành phù hợp với điểm mạnh của mình.",
        time: "09:10",
      },
    ]);
    setAdviceSubject("Gợi ý bước tiếp theo");
    setAdviceNote("");
    setAdvicePriority("medium");
    setAdviceHistory([]);
    setAdviceStatus("idle");
    setActionNotice("");
    setReferenceItems([]);
    setUnmappedReferenceCount(0);
    setReferenceStatus("idle");
    setReferenceError("");
  }, [student.id]);

  useEffect(() => {
    const controller = new AbortController();
    const actions = careerReferenceActions();

    setReferenceStatus("loading");
    setReferenceError("");
    syncReferenceActions(actions, controller.signal)
      .then(() => fetchStudentCommonReferences(student.id, controller.signal))
      .then((payload) => {
        setReferenceItems(payload.references);
        setUnmappedReferenceCount(payload.unmappedActionIds.length);
        setReferenceStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setReferenceStatus("error");
        setReferenceError(error.message || "Không tải được References.");
      });

    return () => controller.abort();
  }, [student.id]);

  useEffect(() => {
    const controller = new AbortController();

    setSupportMeetingsStatus("loading");
    fetchMeetings(
      { role: "counselor", studentId: student.id },
      controller.signal,
    )
      .then((payload) => {
        setSupportAppointments(payload.meetings);
        setSupportMeetingsStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setSupportMeetingsStatus("error");
        showActionNotice(error.message || "Không tải được lịch hỗ trợ.");
      });

    return () => controller.abort();
  }, [student.id]);

  useEffect(() => {
    const controller = new AbortController();

    setAdviceStatus("loading");
    fetchAdviceNotes(
      {
        studentId: student.id,
        counselorId: "COUNSELOR001",
        sort: "newest",
        page: 1,
        pageSize: 30,
      },
      controller.signal,
    )
      .then((payload) => {
        setAdviceHistory(payload.notes);
        setAdviceStatus("idle");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setAdviceStatus("error");
        showActionNotice(error.message || "Không tải được lịch sử advice note.");
      });

    return () => controller.abort();
  }, [student.id]);

  const cachedRecommendation = alumniRecommendation ?? (
    student.recommendHistory?.[0]
      ? {
          student_vector: student.recommendHistory[0].studentVector,
          results: student.recommendHistory[0].results,
          recommendHistory: student.recommendHistory,
          latestRecommendCareer: student.latestRecommendCareer,
        }
      : null
  );

  const handleReloadRecommendation = () => {
    const controller = new AbortController();

    setAlumniStatus("loading");
    setAlumniError("");
    setAlumniConfirming(false);
    fetchStudentRecommendation(student, controller.signal, { persist: true })
      .then((payload) => {
        setAlumniRecommendation(payload);
        setAlumniStatus("success");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setAlumniError(
          error.message || "Không lấy được kết quả recommendation.",
        );
        setAlumniStatus("error");
      });
  };

  const showActionNotice = (message: string) => {
    setActionNotice(message);
    window.setTimeout(() => setActionNotice(""), 2400);
  };

  const handleSaveSupportSchedule = () => {
    if (!supportSchedule) {
      showActionNotice("Vui lòng chọn thời gian hỗ trợ.");
      return;
    }

    const meetingUrl = supportMeetingUrl.trim();

    if (supportMeetingType === "online" && !meetingUrl) {
      showActionNotice("Vui lòng nhập link meeting online.");
      return;
    }

    setSupportMeetingsStatus("saving");
    createMeeting({
      studentId: student.id,
      topic: supportTopic,
      meetingType: supportMeetingType,
      meetingUrl: supportMeetingType === "online" ? meetingUrl : undefined,
      scheduledAt: supportSchedule,
      counselorName: "Nguyễn Văn Minh",
    })
      .then((payload) => {
        setSupportAppointments((items) => [payload.meeting, ...items]);
        setSupportSchedule("");
        setSupportMeetingUrl("");
        window.localStorage.setItem("studentPortalMeetingStudentId", student.id);
        setSupportMeetingsStatus("idle");
        showActionNotice(`Đã lên lịch hỗ trợ cho ${student.name}.`);
      })
      .catch((error) => {
        setSupportMeetingsStatus("error");
        showActionNotice(error.message || "Không tạo được lịch hỗ trợ.");
      });
  };

  const formatSupportSchedule = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleSendMessage = () => {
    const body = messageDraft.trim();
    if (!body) return;
    setAdvisorMessages((items) => [
      ...items,
      {
        from: "counselor",
        body,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMessageDraft("");
    showActionNotice(`Đã gửi tin nhắn cho ${student.name}.`);
  };

  const handleSendAdviceNote = () => {
    const title = adviceSubject.trim();
    const body = adviceNote.trim();

    if (!title) {
      showActionNotice("Vui lòng nhập tiêu đề note advice.");
      return;
    }

    if (!body) {
      showActionNotice("Vui lòng nhập nội dung note advice.");
      return;
    }

    setAdviceStatus("saving");
    createAdviceNote({
      studentId: student.id,
      counselorId: "COUNSELOR001",
      counselorName: "Nguyễn Văn Minh",
      title,
      body,
      priority: advicePriority,
    })
      .then((payload) => {
        setAdviceHistory((items) => [payload.note, ...items]);
        setAdviceNote("");
        setAdviceSubject("Gợi ý bước tiếp theo");
        setAdvicePriority("medium");
        setAdviceStatus("idle");
        showActionNotice(`Đã gửi note advice cho ${student.name}.`);
      })
      .catch((error) => {
        setAdviceStatus("error");
        showActionNotice(error.message || "Không gửi được note advice.");
      });
  };

  const referenceGroups = Object.values(
    referenceItems.reduce<
      Record<
        string,
        {
          groupName: string;
          items: StudentCommonReferenceItem[];
        }
      >
    >((groups, item) => {
      if (!groups[item.groupName]) {
        groups[item.groupName] = {
          groupName: item.groupName,
          items: [],
        };
      }
      groups[item.groupName].items.push(item);
      return groups;
    }, {}),
  );
  const selectedReferenceCount = referenceItems.filter(
    (item) => item.emotion,
  ).length;

  const tabs = [
    { id: "academic", label: "Academic Profile" },

    { id: "personal", label: "Personal Statement" },

    { id: "career", label: "Career Profile" },

    { id: "references", label: "References" },

    { id: "recommendation", label: "Gợi ý & Đánh giá" },

    { id: "wellbeing", label: "Wellbeing" },

    { id: "parent", label: "Kỳ vọng PH" },

    { id: "alumni", label: "Alumni" },
  ];

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
      >
        <ArrowRight size={13} className="rotate-180" /> Quay lại danh sách
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

        <div className="p-5 flex items-start gap-4 flex-wrap">
          <Avatar name={student.name} size="lg" />

          <div className="flex-1 min-w-48">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {student.name}
                </h2>

                <p className="text-sm text-gray-500 mt-0.5">
                  Mã HS: <span className="font-mono">{student.id}</span> · Lớp{" "}
                  {student.className} · {student.typeClass} · {student.province}
                </p>
              </div>

              <RiskBadge level={student.risk} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              {[
                {
                  label: "Học lực",
                  value:
                    student.avg >= 8
                      ? "Giỏi"
                      : student.avg >= 6.5
                        ? "Khá"
                        : "Trung bình",
                  cls: student.avg >= 8 ? "text-green-600" : "text-blue-600",
                },

                {
                  label: "Career Fit",
                  value: student.careerFit,
                  cls: "text-indigo-600",
                },

                {
                  label: "Hồ sơ",
                  value: `${student.progress}%`,
                  cls: "text-orange-600",
                },

                {
                  label: "RIASEC",
                  value: student.riasecTop3,
                  cls: "text-emerald-600",
                },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>

                  <p className={`text-sm font-bold mt-0.5 ${item.cls}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 border-t border-gray-100">
          <div className="flex gap-0 overflow-x-auto -mb-px">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}

                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "academic" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Xu hướng học tập</h3>

            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={student.academicTrend}>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />

                <XAxis
                  key="x"
                  dataKey="term"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  key="y"
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[6, 10]}
                />

                <Tooltip key="tip" />

                <Line
                  key="l"
                  type="monotone"
                  dataKey="score"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="ĐTB"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Điểm số theo môn</h3>

            <div className="space-y-2.5">
              {student.scores.map((score) => {
                const tone = scoreTone(score.score);

                return (
                  <div key={score.subject} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-20 flex-shrink-0">
                      {score.subject}
                    </span>

                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${tone === "strong" ? "bg-emerald-500" : tone === "weak" ? "bg-red-400" : "bg-blue-400"}`}
                        style={{ width: `${(score.score / 10) * 100}%` }}
                      />
                    </div>

                    <span
                      className={`text-xs font-mono font-bold w-8 text-right ${tone === "strong" ? "text-emerald-600" : tone === "weak" ? "text-red-500" : "text-blue-600"}`}
                    >
                      {score.score.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-700">
              <strong>Thành tích:</strong> {student.achievements} ·{" "}
              {student.awards} · {student.certificates}
            </div>
          </div>
        </div>
      )}

      {tab === "personal" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">Personal Statement</h3>

          {[
            {
              label: "Nghề quan tâm",
              value: student.favoriteCareer,
            },

            {
              label: "Nhóm ngành phù hợp",
              value: student.careerFit,
            },

            {
              label: "Phong cách nghề nghiệp mong muốn",
              value: student.desiredCareerStyle,
            },

            {
              label: "Môn yêu thích",
              value: student.favoriteSubject,
            },

            {
              label: "Môn ít thích hơn",
              value: student.leastFavoriteSubject,
            },

            { label: "Hoạt động ưa thích", value: student.preferredActivities },

            { label: "Chủ đề tò mò", value: student.curiosityTopics },

            {
              label: "Tính cách học tập",
              value: `${student.introExtro} · ${student.workStyle} · MBTI ${student.mbti} · DISC ${student.disc}`,
            },

            { label: "Nghề không thích", value: student.dislikedCareer },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                {f.label}
              </p>

              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "career" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Bản đồ kỹ năng</h3>

            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={buildStudentSkillRadar(student)}>
                <PolarGrid key="pg" stroke="#e5e7eb" />

                <PolarAngleAxis
                  key="pa"
                  dataKey="skill"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                />

                <PolarRadiusAxis
                  key="pr"
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />

                <Radar
                  key="r"
                  name="Điểm"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-800 mb-2">
              Career Profile từ database
            </h3>

            {[
              ["MBTI", student.mbti],

              ["DISC", student.disc],

              ["Holland Code", student.riasecTop3],

              ["Career Match Top 1", student.favoriteCareer],

              ["Nhóm ngành", student.careerFit],

              ["Kiểu nghề mong muốn", student.desiredCareerStyle],

              ["Lương kỳ vọng", `${student.expectedSalary} triệu/tháng`],

              ["IQ / EQ", `${student.iq} / ${student.eq}`],
            ].map(([k, v]) => (
              <div
                key={k as string}
                className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl"
              >
                <span className="text-xs text-gray-500 font-medium">
                  {k as string}
                </span>

                <span className="text-xs font-bold text-blue-700">
                  {v as string}
                </span>
              </div>
            ))}

            <div className="space-y-2 pt-1">
              {buildStudentCareerMatches(student).map((item, idx) => (
                <div key={item.career} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400 w-4">
                    {idx + 1}
                  </span>

                  <span className="text-xs text-gray-700 flex-1">
                    {item.career}
                  </span>

                  <div className="w-20 h-1.5 rounded-full bg-gray-100">
                    <div
                      className="h-1.5 rounded-full bg-[#0F766E]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-indigo-700 w-8 text-right">
                    {item.score}%
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 mt-2">
              <strong>Nghề đã khám phá:</strong>{" "}
              {student.exploredCareers.join(", ")}
            </div>
          </div>
        </div>
      )}

      {tab === "references" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-bold text-gray-800">References</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Cảm xúc tổng hợp của {student.name} với các hành động chung.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-orange-600">
                {selectedReferenceCount}/{referenceItems.length}
              </p>
              <p className="text-xs text-gray-400 font-semibold">
                common actions có dữ liệu
              </p>
              {unmappedReferenceCount > 0 && (
                <p className="text-xs text-amber-600 font-semibold mt-0.5">
                  {unmappedReferenceCount} phản hồi chưa map
                </p>
              )}
            </div>
          </div>

          {referenceStatus === "loading" && (
            <div className="p-5 text-sm text-gray-500">
              Đang tải References...
            </div>
          )}

          {referenceStatus === "error" && (
            <div className="m-5 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
              {referenceError}
            </div>
          )}

          {referenceStatus !== "loading" && referenceGroups.length === 0 && (
            <div className="p-5 text-sm text-gray-500">
              Chưa có danh sách hành động chung.
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {referenceGroups.map((group) => (
              <div key={group.groupName} className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {group.groupName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {group.items.filter((item) => item.emotion).length}/
                      {group.items.length} hành động đã có cảm xúc
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                    {group.items.filter((item) => item.emotion).length} đã chọn
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {group.items.map((item) => {
                    const emotion = referenceEmotionMeta(item.emotion);

                    return (
                      <div
                        key={item.commonActionId}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.description || "Hành động chung"} ·{" "}
                            {item.evidenceCount ?? 0} bằng chứng
                            {item.score ? ` · Điểm ${item.score.toFixed(2)}` : ""}
                          </p>
                        </div>
                        {emotion ? (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${emotion.color}`}
                          >
                            <span>{emotion.icon}</span>
                            {emotion.label}
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-400 flex-shrink-0">
                            Chưa chọn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "recommendation" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "schedule",
                label: "Lên lịch hỗ trợ",
                sub: student.className,
                icon: Clock,
                cls: "bg-blue-50 text-blue-700 border-blue-100",
              },
              {
                id: "message",
                label: "Bắt đầu nhắn tin",
                sub: "Mở cửa sổ tin nhắn",
                icon: MessageSquare,
                cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
              },
              {
                id: "advice",
                label: "Gửi note advice",
                sub: "Advice Notes",
                icon: BookMarked,
                cls: "bg-amber-50 text-amber-700 border-amber-100",
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = supportAction === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setSupportAction(
                      item.id as "schedule" | "message" | "advice",
                    )
                  }
                  className={`text-left rounded-2xl border p-4 transition-all ${
                    active
                      ? `${item.cls} shadow-sm ring-2 ring-offset-1 ring-blue-100`
                      : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        active ? "bg-white/70" : "bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs opacity-75 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {actionNotice && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
              {actionNotice}
            </div>
          )}

          {supportAction === "schedule" && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-800">Lên lịch hỗ trợ</h3>
                <span className="text-xs font-mono text-gray-400">
                  {student.id}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500">
                    Thời gian
                  </span>
                  <input
                    type="datetime-local"
                    value={supportSchedule}
                    onChange={(event) =>
                      setSupportSchedule(event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500">
                    Chủ đề
                  </span>
                  <select
                    value={supportTopic}
                    onChange={(event) => setSupportTopic(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  >
                    <option>Định hướng nghề nghiệp</option>
                    <option>Review wellbeing</option>
                    <option>Trao đổi với phụ huynh</option>
                    <option>Điều chỉnh kế hoạch học tập</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-500">
                    Loại hẹn gặp
                  </span>
                  <select
                    value={supportMeetingType}
                    onChange={(event) =>
                      setSupportMeetingType(
                        event.target.value as "offline" | "online",
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </label>

                {supportMeetingType === "online" && (
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-500">
                      Link meeting online
                    </span>
                    <input
                      type="url"
                      value={supportMeetingUrl}
                      onChange={(event) =>
                        setSupportMeetingUrl(event.target.value)
                      }
                      placeholder="https://meet.google.com/..."
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                    />
                  </label>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-gray-50 p-3">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {supportTopic} · {student.className} ·{" "}
                    {supportMeetingType === "online" ? "Online" : "Offline"}
                  </p>
                </div>
                <button
                  onClick={handleSaveSupportSchedule}
                  disabled={supportMeetingsStatus === "saving"}
                  className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save size={13} />{" "}
                  {supportMeetingsStatus === "saving"
                    ? "Đang tạo"
                    : "Xác nhận tạo lịch"}
                </button>
              </div>

              <div className="mt-5 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-gray-800 mb-3">
                  Lịch hỗ trợ đã tạo
                </h4>

                {supportMeetingsStatus === "loading" ? (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-500">
                    Đang tải lịch hỗ trợ...
                  </div>
                ) : supportAppointments.length === 0 ? (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-500">
                    Chưa có lịch hỗ trợ nào.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {supportAppointments.map((appointment) => {
                      const href = appointment.meetingUrl?.startsWith("http")
                        ? appointment.meetingUrl
                        : `https://${appointment.meetingUrl}`;

                      return (
                        <div
                          key={appointment.id}
                          className="rounded-xl border border-gray-100 bg-gray-50 p-3 flex items-start justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-bold text-gray-800">
                                {appointment.topic}
                              </p>
                              <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  appointment.meetingType === "online"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {appointment.meetingType === "online"
                                  ? "Online"
                                  : "Offline"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatSupportSchedule(appointment.scheduledAt)} ·{" "}
                              {student.name}
                            </p>
                            {appointment.meetingUrl && (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-600 font-semibold hover:text-blue-800 truncate block mt-1"
                              >
                                {appointment.meetingUrl}
                              </a>
                            )}
                          </div>

                          <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Clock size={15} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {supportAction === "message" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={student.name} size="sm" />
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Tin nhắn với {student.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {student.className} · {student.id}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Đang mở
                </span>
              </div>

              <div className="p-5 space-y-3 bg-gray-50 min-h-56">
                {advisorMessages.map((message, index) => {
                  const isCounselor = message.from === "counselor";

                  return (
                    <div
                      key={`${message.time}-${index}`}
                      className={`flex ${isCounselor ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2 shadow-sm ${
                          isCounselor
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 border border-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                        <p
                          className={`text-[11px] mt-1 ${
                            isCounselor ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <MessageSquare size={13} /> Gửi
                </button>
              </div>
            </div>
          )}

          {supportAction === "advice" && (
            <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-800">Gửi note advice</h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                  {student.name}
                </span>
              </div>

              <div className="space-y-3">
                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-gray-500">
                    Tiêu đề
                  </span>
                  <input
                    value={adviceSubject}
                    onChange={(event) => setAdviceSubject(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400"
                  />
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-gray-500">
                    Mức độ ưu tiên
                  </span>
                  <select
                    value={advicePriority}
                    onChange={(event) =>
                      setAdvicePriority(event.target.value as AdvicePriority)
                    }
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400"
                  >
                    <option value="high">Quan trọng</option>
                    <option value="medium">Lưu ý</option>
                    <option value="low">Thông tin</option>
                  </select>
                </label>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-gray-500">
                    Nội dung
                  </span>
                  <textarea
                    value={adviceNote}
                    onChange={(event) => setAdviceNote(event.target.value)}
                    rows={6}
                    placeholder="Nhập lời khuyên gửi cho học sinh..."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-400"
                  />
                </label>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-amber-50 border border-amber-100 p-3">
                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      {adviceSubject || "Note advice"}
                    </p>
                    <p className="text-xs text-amber-700">
                      Gửi tới {student.name} · {student.className} ·{" "}
                      {advicePriority === "high"
                        ? "Quan trọng"
                        : advicePriority === "medium"
                          ? "Lưu ý"
                          : "Thông tin"}
                    </p>
                  </div>
                  <button
                    onClick={handleSendAdviceNote}
                    disabled={adviceStatus === "saving"}
                    className="px-3 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <BookMarked size={13} />{" "}
                    {adviceStatus === "saving" ? "Đang gửi" : "Gửi note"}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-gray-800">
                    Lịch sử advice note
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {adviceHistory.length} note đã gửi cho {student.name}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-50">
                {adviceStatus === "loading" ? (
                  <div className="p-5 text-sm text-gray-500">
                    Đang tải lịch sử advice note...
                  </div>
                ) : adviceHistory.length === 0 ? (
                  <div className="p-5 text-sm text-gray-500">
                    Chưa có advice note nào cho học sinh này.
                  </div>
                ) : (
                  adviceHistory.map((note) => (
                    <div key={note.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">
                              {note.title}
                            </p>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                note.priority === "high"
                                  ? "bg-red-100 text-red-700"
                                  : note.priority === "medium"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {note.priority === "high"
                                ? "Quan trọng"
                                : note.priority === "medium"
                                  ? "Lưu ý"
                                  : "Thông tin"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatSupportSchedule(note.createdAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                            {note.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
          )}
        </div>
      )}

      {tab === "wellbeing" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-gray-800">Wellbeing</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Dữ liệu sức khỏe/tâm lý từ hồ sơ database
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs border border-blue-100 font-bold">
              <Shield size={13} /> Cố vấn được phép xem
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ["Mức stress/burnout", student.stressLevel],
              ["Áp lực học tập", student.academicPressureLevel],
              ["Mức tự tin", student.confidenceLevel],
              ["Ghi chú sức khỏe", student.medicalHistory],
            ].map(([k, v]) => (
              <div
                key={k as string}
                className="p-3 bg-red-50 rounded-xl border border-red-100"
              >
                <p className="text-xs font-bold text-red-700 mb-0.5">
                  {k as string}
                </p>

                <p className="text-sm text-gray-700">{v as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "parent" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800">
            Kỳ vọng & Tài chính Phụ huynh
          </h3>

          {[
            [
              "Phụ huynh",
              `${student.fatherName} (${student.fatherOccupation}) · ${student.motherName} (${student.motherOccupation})`,
            ],

            [
              "Trình độ phụ huynh",
              `Bố: ${student.fatherEducation} · Mẹ: ${student.motherEducation}`,
            ],

            ["Định hướng kỳ vọng", student.parentExpectation],

            ["Mức tài chính", student.parentFinanceLevel],

            ["Tỉnh/thành", student.province],

            ["Nhóm nghề học sinh thích", student.favoriteCareer],
          ].map(([k, v]) => (
            <div
              key={k as string}
              className="flex gap-4 p-3 bg-gray-50 rounded-xl"
            >
              <span className="text-xs font-bold text-gray-500 w-32 flex-shrink-0">
                {k as string}
              </span>

              <span className="text-sm text-gray-700">{v as string}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "alumni" && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-gray-800">
                Recommendation từ mô hình
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Hiển thị kết quả recommend gần nhất đã lưu trong database.
              </p>
            </div>

            <button
              onClick={() => setAlumniConfirming(true)}
              disabled={alumniStatus === "loading"}
              className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5"
            >
              <RefreshCw size={13} /> Reload recommend
            </button>
          </div>

          {alumniConfirming && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 mb-4">
              <p className="text-sm font-bold text-amber-900">
                Chạy lại recommendation engine cho {student.name}?
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Kết quả mới sẽ được lưu vào database và thêm vào lịch sử.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleReloadRecommendation}
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => setAlumniConfirming(false)}
                  className="px-3 py-2 rounded-lg bg-white border border-amber-200 text-amber-800 text-xs font-bold hover:bg-amber-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {alumniStatus === "loading" && (
            <div className="p-8 text-center">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">
                Đang gửi hồ sơ học sinh vào recommendation engine...
              </p>
            </div>
          )}

          {alumniStatus === "error" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="text-red-600 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="font-bold text-gray-800">
                    Không lấy được kết quả model
                  </p>
                  <p className="text-sm text-red-600 mt-1">{alumniError}</p>
                </div>
              </div>
            </div>
          )}

          {!cachedRecommendation && alumniStatus !== "loading" && (
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-500">
              Chưa có kết quả recommend đã lưu. Bấm Reload recommend để chạy
              engine và lưu kết quả vào database.
            </div>
          )}

          {cachedRecommendation && alumniStatus !== "loading" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                {cachedRecommendation.results.slice(0, 6).map((career) => (
                  <div
                    key={career.soc_code}
                    className="p-3.5 rounded-xl border border-gray-100 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black flex-shrink-0">
                        {career.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-800 leading-snug">
                              {career.title}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              {career.soc_code}
                            </p>
                          </div>
                          <span className="text-sm font-black text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                            {Math.round(career.score * 100)}%
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-6 gap-1.5">
                          {Object.entries(career.vector).map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-white border border-gray-100 rounded-lg px-2 py-1.5 text-center"
                            >
                              <p
                                className="text-xs font-bold"
                                style={{ color: RIASEC_META[key]?.color }}
                              >
                                {key}
                              </p>
                              <p className="text-xs font-mono text-gray-600">
                                {Number(value).toFixed(1)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-3">
                    Profile gửi vào model
                  </h4>
                  {[
                    ["Học sinh", `${student.name} · ${student.id}`],
                    ["Nhóm ngành", student.careerFit],
                    ["Nghề quan tâm", student.favoriteCareer],
                    ["RIASEC", student.riasecTop3],
                    ["MBTI / DISC", `${student.mbti} / ${student.disc}`],
                  ].map(([label, value]) => (
                    <div
                      key={label as string}
                      className="flex justify-between gap-3 py-1.5 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-xs text-gray-500 font-medium">
                        {label as string}
                      </span>
                      <span className="text-xs text-gray-800 font-bold text-right">
                        {value as string}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-3">
                    Vector học sinh
                  </h4>
                  <div className="space-y-2.5">
                    {Object.entries(cachedRecommendation.student_vector).map(
                      ([key, value]) => {
                        const maxValue = Math.max(
                          ...Object.values(
                            cachedRecommendation.student_vector,
                          ),
                        );

                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-blue-900">
                                {key} · {RIASEC_META[key]?.label}
                              </span>
                              <span className="text-xs font-mono font-bold text-blue-900">
                                {value}
                              </span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  width: `${Math.max(8, (value / maxValue) * 100)}%`,
                                  backgroundColor: RIASEC_META[key]?.color,
                                }}
                              />
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

