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
  Trash2,
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
  createAdviceNote,
  createMeeting,
  createMessage,
  deleteAdviceNote,
  fetchAdviceNotes,
  fetchMeetings,
  fetchMessages,
  markMessagesSeen,
  updateMeeting,
  type AdviceNoteRecord,
  type AdvicePriority,
  type MeetingRecord,
  type MeetingType,
  type MessageRecord,
  type MessageRole,
} from "../../../api/client";

type MeetingViewMode = "day" | "week" | "month";

const STUDENT_PORTAL_FALLBACK_ID = "STU006";
const DEFAULT_COUNSELOR_ID = "COUNSELOR001";
const DEFAULT_COUNSELOR_NAME = "Nguyễn Văn Minh";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateTimeInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const defaultMeetingDateTime = () => {
  const next = new Date();
  next.setDate(next.getDate() + 1);
  next.setHours(9, 0, 0, 0);
  return formatDateTimeInput(next);
};

const dateTimeInputToIso = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const formatMeetingDateTime = (value: string) => {
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

const meetingDate = (meeting: MeetingRecord) => new Date(meeting.scheduledAt);

const meetingHasPassed = (meeting: MeetingRecord) =>
  meetingDate(meeting).getTime() < Date.now();

const meetingsForDate = (meetings: MeetingRecord[], date: Date) =>
  meetings.filter((meeting) => sameDay(meetingDate(meeting), date));

const buildCalendarDates = (selectedDate: Date, mode: MeetingViewMode) => {
  if (mode === "day") return [startOfDay(selectedDate)];

  if (mode === "week") {
    const mondayOffset = (selectedDate.getDay() + 6) % 7;
    const monday = addDays(startOfDay(selectedDate), -mondayOffset);
    return Array.from({ length: 7 }, (_, index) => addDays(monday, index));
  }

  const firstOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1,
  );
  const mondayOffset = (firstOfMonth.getDay() + 6) % 7;
  const firstCell = addDays(firstOfMonth, -mondayOffset);

  return Array.from({ length: 42 }, (_, index) => addDays(firstCell, index));
};

const meetingHref = (url?: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const formatMessageTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const messageSeenByRecipient = (
  message: MessageRecord,
  currentRole: MessageRole,
) =>
  currentRole === "student"
    ? Boolean(message.counselorSeenAt)
    : Boolean(message.studentSeenAt);

type MessageContact = ChatContact & {
  studentId: string;
  className?: string;
};

export const MessengerView = ({
  role,
  initialStudentId,
}: {
  role: string;
  initialStudentId?: string;
}) => {
  const currentRole: MessageRole = role === "student" ? "student" : "counselor";
  const { studentsInClass: appStudents } = useAppData();
  const [studentPortalId] = useState(() =>
    window.localStorage.getItem("studentPortalMeetingStudentId") ||
    STUDENT_PORTAL_FALLBACK_ID,
  );
  const [activeStudentId, setActiveStudentId] = useState(
    currentRole === "student" ? studentPortalId : initialStudentId || "",
  );
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const reloadMessages = (signal?: AbortSignal) =>
    fetchMessages(
      {
        role: currentRole,
        studentId: currentRole === "student" ? studentPortalId : undefined,
        counselorId: DEFAULT_COUNSELOR_ID,
      },
      signal,
    ).then((payload) => {
      setMessages(payload.messages);
      setStatus("ready");
      return payload.messages;
    });

  React.useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError("");
    reloadMessages(controller.signal).catch((err) => {
      if (err.name === "AbortError") return;
      setError(err.message || "Không tải được tin nhắn.");
      setStatus("error");
    });

    const timer = window.setInterval(() => {
      reloadMessages().catch(() => undefined);
    }, 6000);

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [currentRole, studentPortalId]);

  const studentsById = new globalThis.Map(
    appStudents.map((student) => [student.id, student]),
  );
  const messageStudentIds = Array.from(
    new Set(messages.map((message) => message.studentId)),
  );
  const counselorContacts: MessageContact[] = [
    ...appStudents.map((student) => {
      const conversation = messages.filter(
        (message) => message.studentId === student.id,
      );
      const last = conversation[conversation.length - 1];
      const unread = conversation.filter(
        (message) =>
          message.senderRole === "student" && !message.counselorSeenAt,
      ).length;

      return {
        id: student.id,
        studentId: student.id,
        name: student.name,
        role: `Học sinh lớp ${student.className}`,
        className: student.className,
        avatar: student.name.charAt(student.name.lastIndexOf(" ") + 1),
        lastMsg: last?.text || "Chưa có tin nhắn",
        time: last ? formatMessageTime(last.sentAt) : "",
        unread,
      };
    }),
    ...messageStudentIds
      .filter((studentId) => !studentsById.has(studentId))
      .map((studentId) => {
        const conversation = messages.filter(
          (message) => message.studentId === studentId,
        );
        const last = conversation[conversation.length - 1];

        return {
          id: studentId,
          studentId,
          name: last?.studentName || studentId,
          role: `Học sinh ${last?.className || ""}`,
          className: last?.className,
          avatar: (last?.studentName || studentId).charAt(0),
          lastMsg: last?.text || "Chưa có tin nhắn",
          time: last ? formatMessageTime(last.sentAt) : "",
          unread: conversation.filter(
            (message) =>
              message.senderRole === "student" && !message.counselorSeenAt,
          ).length,
        };
      }),
  ];

  const studentMessages = messages.filter(
    (message) => message.studentId === studentPortalId,
  );
  const studentLastMessage = studentMessages[studentMessages.length - 1];
  const studentUnread = studentMessages.filter(
    (message) => message.senderRole === "counselor" && !message.studentSeenAt,
  ).length;
  const studentContact: MessageContact = {
    id: DEFAULT_COUNSELOR_ID,
    studentId: studentPortalId,
    name: DEFAULT_COUNSELOR_NAME,
    role: "Cố vấn hướng nghiệp",
    avatar: "M",
    lastMsg: studentLastMessage?.text || "Bắt đầu nhắn tin với cố vấn",
    time: studentLastMessage ? formatMessageTime(studentLastMessage.sentAt) : "",
    unread: studentUnread,
  };

  const contacts =
    currentRole === "student" ? [studentContact] : counselorContacts;

  React.useEffect(() => {
    if (currentRole === "student") return;
    if (initialStudentId && activeStudentId !== initialStudentId) {
      setActiveStudentId(initialStudentId);
      return;
    }
    if (!activeStudentId && contacts.length > 0) {
      setActiveStudentId(contacts[0].studentId);
    }
  }, [activeStudentId, contacts, currentRole, initialStudentId]);

  const activeContact =
    contacts.find((contact) => contact.studentId === activeStudentId) ||
    contacts[0] ||
    studentContact;

  const filteredContacts = contacts.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeMessages = messages.filter(
    (message) => message.studentId === activeContact.studentId,
  );
  const totalUnread = contacts.reduce((sum, contact) => sum + contact.unread, 0);

  const markActiveSeen = (studentId: string) => {
    markMessagesSeen({
      role: currentRole,
      studentId,
      counselorId: DEFAULT_COUNSELOR_ID,
    })
      .then((payload) => {
        setMessages((items) => [
          ...items.filter((message) => message.studentId !== studentId),
          ...payload.messages,
        ].sort(
          (a, b) =>
            new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime() ||
            a.id - b.id,
        ));
      })
      .catch(() => undefined);
  };

  React.useEffect(() => {
    if (!activeContact?.studentId) return;
    markActiveSeen(activeContact.studentId);
  }, [activeContact?.studentId, activeMessages.length, currentRole]);

  const send = () => {
    const text = input.trim();
    if (!text || !activeContact?.studentId) return;
    setInput("");
    createMessage({
      studentId: activeContact.studentId,
      counselorId: DEFAULT_COUNSELOR_ID,
      counselorName: DEFAULT_COUNSELOR_NAME,
      senderRole: currentRole,
      text,
    })
      .then((payload) => {
        setMessages((items) => [...items, payload.message]);
      })
      .catch((err) => {
        setError(err.message || "Không gửi được tin nhắn.");
        setStatus("error");
        setInput(text);
      });
  };

  const avatarGrad =
    role === "student"
      ? "from-orange-400 to-pink-500"
      : "from-blue-500 to-indigo-600";

  return (
    <div className="h-[calc(100vh-7.5rem)] flex gap-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Contact list */}
      <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-bold text-gray-900">Tin nhắn</h2>
            {totalUnread > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {totalUnread} mới
              </span>
            )}
          </div>
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        {status === "error" && (
          <div className="mx-3 mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveStudentId(c.studentId);
                markActiveSeen(c.studentId);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-50 ${activeContact.studentId === c.studentId ? "bg-orange-50 border-l-4 border-l-orange-500" : "hover:bg-gray-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
              >
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-gray-800 truncate">
                    {c.name}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                    {c.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 truncate">{c.lastMsg}</p>
                  {c.unread > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
          {status === "loading" && (
            <div className="p-4 text-sm text-gray-500">Đang tải tin nhắn...</div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-bold flex-shrink-0`}
          >
            {activeContact.avatar}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">
              {activeContact.name}
            </p>
            <p className="text-xs text-gray-500">{activeContact.role}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-gray-500">Đang hoạt động</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
          {activeMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.
            </div>
          ) : (
            activeMessages.map((msg) => {
              const mine = msg.senderRole === currentRole;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}
                >
                  {!mine && (
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1`}
                    >
                      {activeContact.avatar}
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md ${mine ? "items-end" : "items-start"} flex flex-col gap-1`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${mine ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 px-1">
                      {formatMessageTime(msg.sentAt)}
                      {mine && (
                        <>
                          {" · "}
                          {messageSeenByRecipient(msg, currentRole)
                            ? "Đã xem"
                            : "Đã gửi"}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity flex-shrink-0"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MeetingCenter = ({
  role,
}: {
  role: "student" | "counselor";
}) => {
  const { studentsInClass: appStudents } = useAppData();
  const [viewMode, setViewMode] = useState<MeetingViewMode>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [studentId] = useState(() =>
    window.localStorage.getItem("studentPortalMeetingStudentId") ||
    STUDENT_PORTAL_FALLBACK_ID,
  );
  const students = appStudents.length > 0 ? appStudents : studentsInClass;
  const initialCounselorStudentId = students[0]?.id || studentId;
  const [formStudentId, setFormStudentId] = useState(initialCounselorStudentId);
  const [studentSearch, setStudentSearch] = useState("");
  const [meetingTopic, setMeetingTopic] = useState("");
  const [meetingType, setMeetingType] = useState<MeetingType>("offline");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [meetingDateTime, setMeetingDateTime] = useState(defaultMeetingDateTime);
  const [formStatus, setFormStatus] = useState<"idle" | "saving">("idle");
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(
    null,
  );
  const [editMode, setEditMode] = useState(false);
  const [detailTopic, setDetailTopic] = useState("");
  const [detailType, setDetailType] = useState<MeetingType>("offline");
  const [detailUrl, setDetailUrl] = useState("");
  const [detailDateTime, setDetailDateTime] = useState("");
  const [detailNote, setDetailNote] = useState("");
  const [detailStatus, setDetailStatus] = useState<"idle" | "saving">("idle");

  React.useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError("");
    fetchMeetings(
      {
        role,
        studentId: role === "student" ? studentId : undefined,
      },
      controller.signal,
    )
      .then((payload) => {
        setMeetings(payload.meetings);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được lịch meeting.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [role, studentId]);

  React.useEffect(() => {
    if (role === "counselor" && !students.some((student) => student.id === formStudentId)) {
      setFormStudentId(initialCounselorStudentId);
    }
  }, [role, students, formStudentId, initialCounselorStudentId]);

  const selectedFormStudent =
    students.find((student) => student.id === formStudentId) ?? students[0];
  const filteredStudents = students.filter((student) => {
    const q = studentSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      student.name.toLowerCase().includes(q) ||
      student.id.toLowerCase().includes(q) ||
      student.className.toLowerCase().includes(q)
    );
  });
  const calendarDates = buildCalendarDates(selectedDate, viewMode);
  const today = startOfDay(new Date());
  const upcoming = [...meetings]
    .filter((meeting) => !meetingHasPassed(meeting))
    .sort(
      (a, b) => meetingDate(a).getTime() - meetingDate(b).getTime(),
    );
  const history = [...meetings].sort(
    (a, b) => meetingDate(b).getTime() - meetingDate(a).getTime(),
  );
  const newMeetings = meetings.filter((meeting) => !meeting.studentSeenAt);
  const calendarCols =
    viewMode === "day" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-7";

  const accent =
    role === "student"
      ? "from-orange-500 to-pink-500"
      : "from-blue-600 to-indigo-600";
  const softTone =
    role === "student"
      ? "bg-orange-50 border-orange-100 text-orange-700"
      : "bg-blue-50 border-blue-100 text-blue-700";
  const replaceMeeting = (meeting: MeetingRecord) =>
    setMeetings((items) =>
      items.map((item) => (item.id === meeting.id ? meeting : item)),
    );
  const appendMeeting = (meeting: MeetingRecord) =>
    setMeetings((items) =>
      [...items, meeting].sort(
        (a, b) => meetingDate(a).getTime() - meetingDate(b).getTime(),
      ),
    );
  const openMeeting = (meeting: MeetingRecord) => {
    setSelectedMeeting(meeting);
    setEditMode(false);
    setDetailTopic(meeting.topic);
    setDetailType(meeting.meetingType);
    setDetailUrl(meeting.meetingUrl || "");
    setDetailDateTime(formatDateTimeInput(meetingDate(meeting)));
    setDetailNote(meeting.meetingNote || "");
    setError("");
  };
  const saveMeeting = () => {
    const targetStudentId = role === "student" ? studentId : formStudentId;
    const topic = meetingTopic.trim();
    const url = meetingUrl.trim();
    if (!targetStudentId) {
      setError("Vui lòng chọn học sinh.");
      return;
    }
    if (!topic) {
      setError("Vui lòng nhập chủ đề meeting.");
      return;
    }
    if (!meetingDateTime) {
      setError("Vui lòng chọn thời gian meeting.");
      return;
    }
    if (meetingType === "online" && !url) {
      setError("Vui lòng nhập link meeting online.");
      return;
    }

    setFormStatus("saving");
    setError("");
    createMeeting({
      studentId: targetStudentId,
      counselorId: DEFAULT_COUNSELOR_ID,
      counselorName: DEFAULT_COUNSELOR_NAME,
      topic,
      meetingType,
      meetingUrl: meetingType === "online" ? url : undefined,
      scheduledAt: dateTimeInputToIso(meetingDateTime),
    })
      .then((payload) => {
        appendMeeting(payload.meeting);
        window.localStorage.setItem("studentPortalMeetingStudentId", targetStudentId);
        setMeetingTopic("");
        setMeetingUrl("");
        setMeetingType("offline");
        setMeetingDateTime(defaultMeetingDateTime());
      })
      .catch((err) => setError(err.message || "Không tạo được lịch meeting."))
      .finally(() => setFormStatus("idle"));
  };
  const saveMeetingEdit = () => {
    if (!selectedMeeting) return;
    const topic = detailTopic.trim();
    const url = detailUrl.trim();
    if (!topic) {
      setError("Vui lòng nhập chủ đề meeting.");
      return;
    }
    if (!detailDateTime) {
      setError("Vui lòng chọn thời gian meeting.");
      return;
    }
    if (detailType === "online" && !url) {
      setError("Vui lòng nhập link meeting online.");
      return;
    }

    setDetailStatus("saving");
    setError("");
    updateMeeting(selectedMeeting.id, {
      topic,
      meetingType: detailType,
      meetingUrl: detailType === "online" ? url : "",
      scheduledAt: dateTimeInputToIso(detailDateTime),
    })
      .then((payload) => {
        replaceMeeting(payload.meeting);
        setSelectedMeeting(payload.meeting);
        setEditMode(false);
      })
      .catch((err) => setError(err.message || "Không cập nhật được meeting."))
      .finally(() => setDetailStatus("idle"));
  };
  const saveMeetingNote = () => {
    if (!selectedMeeting) return;
    setDetailStatus("saving");
    setError("");
    updateMeeting(selectedMeeting.id, { meetingNote: detailNote })
      .then((payload) => {
        replaceMeeting(payload.meeting);
        setSelectedMeeting(payload.meeting);
        setDetailNote(payload.meeting.meetingNote || "");
      })
      .catch((err) => setError(err.message || "Không lưu được note meeting."))
      .finally(() => setDetailStatus("idle"));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meeting</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {role === "student"
              ? "Lịch hẹn hỗ trợ từ cố vấn hướng nghiệp"
              : "Lịch hẹn hỗ trợ đã tạo cho học sinh"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={formatDateInput(selectedDate)}
            onChange={(event) => setSelectedDate(new Date(event.target.value))}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
          <div className="inline-flex rounded-xl bg-white border border-gray-200 p-1">
            {[
              ["day", "Ngày"],
              ["week", "Tuần"],
              ["month", "Tháng"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setViewMode(id as MeetingViewMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  viewMode === id
                    ? `bg-gradient-to-r ${accent} text-white shadow-sm`
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {role === "student" && newMeetings.length > 0 && (
        <div className={`rounded-2xl border p-4 ${softTone}`}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-sm font-bold">
                Bạn có {newMeetings.length} lịch hẹn mới từ cố vấn.
              </p>
              <p className="text-xs mt-0.5 opacity-80">
                Xem chi tiết trong calendar và danh sách lịch sắp tới bên dưới.
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}
      {error && status !== "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-gray-900">Tạo lịch meeting</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {role === "student"
                ? `Tạo lịch cho học sinh ${studentId}`
                : "Chọn học sinh và điền thông tin lịch hẹn"}
            </p>
          </div>
          {role === "counselor" && selectedFormStudent && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
              {selectedFormStudent.name} · {selectedFormStudent.className}
            </span>
          )}
        </div>

        {role === "counselor" && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Tìm học sinh
              </label>
              <input
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Tên, mã học sinh hoặc lớp"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Chọn học sinh
              </label>
              <select
                value={formStudentId}
                onChange={(event) => setFormStudentId(event.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {filteredStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} · {student.className} · {student.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              Thời gian
            </label>
            <input
              type="datetime-local"
              value={meetingDateTime}
              onChange={(event) => setMeetingDateTime(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              Chủ đề meeting
            </label>
            <input
              value={meetingTopic}
              onChange={(event) => setMeetingTopic(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
              placeholder="VD: Tư vấn định hướng nghề nghiệp"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              Loại hẹn gặp
            </label>
            <select
              value={meetingType}
              onChange={(event) => setMeetingType(event.target.value as MeetingType)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>
          {meetingType === "online" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                Link meeting online
              </label>
              <input
                value={meetingUrl}
                onChange={(event) => setMeetingUrl(event.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="https://meet.google.com/..."
              />
            </div>
          )}
        </div>
        <button
          onClick={saveMeeting}
          disabled={formStatus === "saving"}
          className={`w-full lg:w-fit px-5 py-2.5 rounded-xl bg-gradient-to-r ${accent} text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60`}
        >
          <Save size={15} />
          {formStatus === "saving" ? "Đang lưu..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-900">Calendar</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {meetings.length} lịch hẹn
              </p>
            </div>
            {status === "loading" && (
              <span className="text-xs font-semibold text-gray-400">
                Đang tải...
              </span>
            )}
          </div>

          <div className={`grid ${calendarCols} border-t border-l border-gray-100`}>
            {calendarDates.map((date) => {
              const dateMeetings = meetingsForDate(meetings, date);
              const inCurrentMonth =
                date.getMonth() === selectedDate.getMonth() ||
                viewMode !== "month";

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-36 border-r border-b border-gray-100 p-3 ${
                    inCurrentMonth ? "bg-white" : "bg-gray-50/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-xs font-bold ${
                        sameDay(date, today)
                          ? role === "student"
                            ? "text-orange-600"
                            : "text-blue-600"
                          : inCurrentMonth
                            ? "text-gray-700"
                            : "text-gray-400"
                      }`}
                    >
                      {date.toLocaleDateString("vi-VN", {
                        weekday: viewMode === "month" ? undefined : "short",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                    {dateMeetings.length > 0 && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {dateMeetings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {dateMeetings.slice(0, viewMode === "month" ? 2 : 5).map(
                      (meeting) => (
                        <button
                          key={meeting.id}
                          onClick={() => openMeeting(meeting)}
                          className={`w-full rounded-xl border p-2 text-left ${softTone}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold truncate">
                              {meeting.topic}
                            </p>
                            {meetingHasPassed(meeting) && !meeting.meetingNote && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 flex-shrink-0">
                                Chưa note
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            {meetingDate(meeting).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" · "}
                            {role === "student"
                              ? meeting.counselorName
                              : meeting.studentName}
                          </p>
                        </button>
                      ),
                    )}
                    {dateMeetings.length > (viewMode === "month" ? 2 : 5) && (
                      <p className="text-[11px] text-gray-400 font-semibold">
                        +{dateMeetings.length - (viewMode === "month" ? 2 : 5)}{" "}
                        lịch khác
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Lịch sắp tới</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {upcoming.length} lịch chưa diễn ra
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {status === "loading" ? (
              <div className="p-5 text-sm text-gray-500">Đang tải lịch...</div>
            ) : upcoming.length === 0 ? (
              <div className="p-5 text-sm text-gray-500">
                Chưa có lịch hẹn sắp tới.
              </div>
            ) : (
              upcoming.slice(0, 12).map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => openMeeting(meeting)}
                  className="w-full p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-900">
                          {meeting.topic}
                        </p>
                        {role === "student" && !meeting.studentSeenAt && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Mới
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatMeetingDateTime(meeting.scheduledAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {role === "student"
                          ? `Cố vấn: ${meeting.counselorName}`
                          : `${meeting.studentName} · ${meeting.className}`}
                      </p>
                      {meeting.meetingType === "online" && meeting.meetingUrl && (
                        <p className="text-xs font-semibold text-blue-600 mt-1 truncate">
                          {meeting.meetingUrl}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        meeting.meetingType === "online"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {meeting.meetingType === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Lịch sử meeting</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {history.length} lịch hẹn đã ghi nhận
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {history.length === 0 ? (
            <div className="p-5 text-sm text-gray-500">Chưa có meeting nào.</div>
          ) : (
            history.map((meeting) => {
              const passed = meetingHasPassed(meeting);
              return (
                <button
                  key={meeting.id}
                  onClick={() => openMeeting(meeting)}
                  className="w-full p-4 text-left hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-900">
                          {meeting.topic}
                        </p>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            passed
                              ? "bg-gray-100 text-gray-600"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {passed ? "Đã diễn ra" : "Chưa diễn ra"}
                        </span>
                        {passed && !meeting.meetingNote && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Chưa có note
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatMeetingDateTime(meeting.scheduledAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {role === "student"
                          ? `Cố vấn: ${meeting.counselorName}`
                          : `${meeting.studentName} · ${meeting.className}`}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        meeting.meetingType === "online"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {meeting.meetingType === "online" ? "Online" : "Offline"}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Chi tiết meeting
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  ID lịch hẹn #{selectedMeeting.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedMeeting(null)}
                className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                ×
              </button>
            </div>
            <div className="p-5 space-y-4">
              {meetingHasPassed(selectedMeeting) && !selectedMeeting.meetingNote && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  Meeting này đã diễn ra nhưng chưa có note cuộc họp.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Học sinh
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedMeeting.studentName} · {selectedMeeting.className}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    Cố vấn
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedMeeting.counselorName}
                  </p>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      Chủ đề meeting
                    </label>
                    <input
                      value={detailTopic}
                      onChange={(event) => setDetailTopic(event.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Thời gian
                      </label>
                      <input
                        type="datetime-local"
                        value={detailDateTime}
                        onChange={(event) => setDetailDateTime(event.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Loại hẹn gặp
                      </label>
                      <select
                        value={detailType}
                        onChange={(event) =>
                          setDetailType(event.target.value as MeetingType)
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="offline">Offline</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>
                  {detailType === "online" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Link meeting online
                      </label>
                      <input
                        value={detailUrl}
                        onChange={(event) => setDetailUrl(event.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                  <p className="font-bold text-gray-900">{selectedMeeting.topic}</p>
                  <p className="text-sm text-gray-600">
                    {formatMeetingDateTime(selectedMeeting.scheduledAt)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedMeeting.meetingType === "online" ? "Online" : "Offline"}
                  </p>
                  {selectedMeeting.meetingType === "online" &&
                    selectedMeeting.meetingUrl && (
                      <a
                        href={meetingHref(selectedMeeting.meetingUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {selectedMeeting.meetingUrl}
                      </a>
                    )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Note cuộc họp
                </label>
                {role === "counselor" && meetingHasPassed(selectedMeeting) ? (
                  <textarea
                    rows={4}
                    value={detailNote}
                    onChange={(event) => setDetailNote(event.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    placeholder="Ghi lại điểm chính của cuộc họp..."
                  />
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedMeeting.meetingNote || "Chưa có note cuộc họp."}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 flex-wrap">
                {role === "counselor" && !meetingHasPassed(selectedMeeting) && !editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-bold hover:bg-blue-100"
                  >
                    <Edit2 size={14} className="inline mr-1" />
                    Edit
                  </button>
                )}
                {role === "counselor" && !meetingHasPassed(selectedMeeting) && editMode && (
                  <>
                    <button
                      onClick={() => openMeeting(selectedMeeting)}
                      disabled={detailStatus === "saving"}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-60"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={saveMeetingEdit}
                      disabled={detailStatus === "saving"}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {detailStatus === "saving" ? "Đang lưu..." : "Lưu chỉnh sửa"}
                    </button>
                  </>
                )}
                {role === "counselor" && meetingHasPassed(selectedMeeting) && (
                  <button
                    onClick={saveMeetingNote}
                    disabled={detailStatus === "saving"}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {detailStatus === "saving" ? "Đang lưu..." : "Lưu note"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdvisementNotesStudent = () => {
  const [notes, setNotes] = useState<AdviceNote[]>(SAMPLE_NOTES);
  const [selected, setSelected] = useState<AdviceNote | null>(null);

  const markRead = (id: number) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notes.filter((n) => !n.read).length;
  const priorityCls: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const priorityLabel: Record<string, string> = {
    high: "Quan trọng",
    medium: "Lưu ý",
    low: "Thông tin",
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Lời khuyên từ Giáo viên 📬
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? (
              <span className="text-orange-600 font-semibold">
                {unreadCount} lời khuyên chưa đọc
              </span>
            ) : (
              "Tất cả đã đọc ✓"
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {selected ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-800"
          >
            <ArrowRight size={13} className="rotate-180" /> Quay lại
          </button>
          <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-pink-500" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[selected.priority]} mb-2 inline-block`}
                  >
                    {priorityLabel[selected.priority]}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selected.subject}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-5 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selected.from.charAt(selected.from.lastIndexOf(" ") + 1)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {selected.from}
                  </p>
                  <p className="text-xs text-gray-500">{selected.date}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {selected.body}
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    markRead(selected.id);
                    setSelected(null);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl text-sm font-bold hover:opacity-90"
                >
                  ✓ Đã đọc & Hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                setSelected(note);
                markRead(note.id);
              }}
              className={`bg-white rounded-2xl p-5 border-2 text-left shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${!note.read ? "border-orange-300" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[note.priority]}`}
                >
                  {priorityLabel[note.priority]}
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!note.read && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                  <span className="text-xs text-gray-400 font-mono">
                    {note.date}
                  </span>
                </div>
              </div>
              <h3
                className={`text-sm font-bold mb-1 ${!note.read ? "text-gray-900" : "text-gray-700"}`}
              >
                {note.subject}
              </h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {note.body}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {note.from.charAt(note.from.lastIndexOf(" ") + 1)}
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  {note.from}
                </span>
                {!note.read && (
                  <span className="ml-auto text-xs font-bold text-orange-600">
                    Chưa đọc →
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdvisementNotesCounselor = () => {
  const { studentsInClass } = useAppData();
  const [notes, setNotes] = useState<AdviceNoteRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState<
    "newest" | "oldest" | "priority" | "student"
  >("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "ready" | "saving" | "deleting" | "error"
  >("loading");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    body: "",
    priority: "medium" as AdvicePriority,
  });

  const loadNotes = (signal?: AbortSignal) => {
    setStatus("loading");
    setError("");
    fetchAdviceNotes(
      {
        counselorId: DEFAULT_COUNSELOR_ID,
        sort,
        page,
        pageSize,
      },
      signal,
    )
      .then((payload) => {
        setNotes(payload.notes);
        setTotal(payload.total);
        setHasMore(payload.hasMore);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được advice notes.");
        setStatus("error");
      });
  };

  React.useEffect(() => {
    const controller = new AbortController();
    loadNotes(controller.signal);
    return () => controller.abort();
  }, [sort, page, pageSize]);

  const formatAdviceDate = (value: string) => {
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

  const send = () => {
    if (!form.studentId || !form.subject.trim() || !form.body.trim()) return;

    setStatus("saving");
    createAdviceNote({
      studentId: form.studentId,
      counselorId: DEFAULT_COUNSELOR_ID,
      counselorName: DEFAULT_COUNSELOR_NAME,
      title: form.subject.trim(),
      body: form.body.trim(),
      priority: form.priority,
    })
      .then(() => {
        setForm({
          studentId: "",
          subject: "",
          body: "",
          priority: "medium",
        });
        setShowForm(false);
        setPage(1);
        loadNotes();
      })
      .catch((err) => {
        setError(err.message || "Không gửi được advice note.");
        setStatus("error");
      });
  };

  const removeNote = (noteId: number) => {
    setStatus("deleting");
    deleteAdviceNote(noteId, { counselorId: DEFAULT_COUNSELOR_ID })
      .then(() => {
        setNotes((items) => items.filter((note) => note.id !== noteId));
        setTotal((value) => Math.max(0, value - 1));
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message || "Không xóa được advice note.");
        setStatus("error");
      });
  };

  const priorityCls: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const priorityLabel: Record<string, string> = {
    high: "Quan trọng",
    medium: "Lưu ý",
    low: "Thông tin",
  };
  const sortLabels: Record<string, string> = {
    newest: "Mới nhất",
    oldest: "Cũ nhất",
    priority: "Ưu tiên",
    student: "Tên học sinh",
  };
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(total, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Lời khuyên cho Học sinh
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} advice note đã tạo bởi {DEFAULT_COUNSELOR_NAME}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setPage(1);
            }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                Sắp xếp: {label}
              </option>
            ))}
          </select>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value={20}>20 / trang</option>
            <option value={25}>25 / trang</option>
            <option value={30}>30 / trang</option>
          </select>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90"
          >
            <Plus size={15} /> Tạo note mới
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={16} className="text-blue-600" /> Soạn lời khuyên mới
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Gửi đến học sinh
              </label>
              <select
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn học sinh --</option>
                {studentsInClass.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} · {student.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Mức độ ưu tiên
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority: e.target.value as AdvicePriority,
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="high">🔴 Quan trọng</option>
                <option value="medium">🟡 Lưu ý</option>
                <option value="low">⚪ Thông tin</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Tiêu đề
            </label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="VD: Lộ trình học tập học kỳ 2..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Nội dung lời khuyên
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={5}
              placeholder="Nhập lời khuyên chi tiết dành cho học sinh..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1 border-t border-gray-100">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Huỷ
            </button>
            <button
              onClick={send}
              disabled={!form.studentId || !form.subject || !form.body}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowRight size={14} /> Gửi lời khuyên
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900">Lịch sử advice note</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {firstItem}-{lastItem} / {total} · {sortLabels[sort]}
            </p>
          </div>
          {(status === "loading" || status === "deleting") && (
            <span className="text-xs font-semibold text-gray-400">
              {status === "deleting" ? "Đang xóa..." : "Đang tải..."}
            </span>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {status === "loading" && notes.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              Đang tải advice notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              Chưa có advice note nào.
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[note.priority]}`}
                      >
                        {priorityLabel[note.priority]}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {formatAdviceDate(note.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {note.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {note.body}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        {note.studentName.charAt(
                          note.studentName.lastIndexOf(" ") + 1,
                        )}
                      </div>
                      <span className="text-xs text-gray-600 font-semibold">
                        {note.studentName} · {note.className}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          note.studentSeenAt
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {note.studentSeenAt ? "Đã đọc" : "Chưa đọc"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeNote(note.id)}
                    disabled={status === "deleting"}
                    className="w-9 h-9 rounded-xl border border-red-100 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 disabled:opacity-50 flex-shrink-0"
                    title="Xóa advice note"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-gray-500">
          Trang {page} · Hiển thị {pageSize} note mỗi trang
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Trước
          </button>
          <button
            onClick={() => setPage((value) => value + 1)}
            disabled={!hasMore}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};
