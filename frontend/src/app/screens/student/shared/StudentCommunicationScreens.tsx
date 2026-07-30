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
  fetchFamilies,
  fetchMeetings,
  fetchMessages,
  markMessagesSeen,
  updateMeeting,
  type AdviceNoteRecord,
  type AdvicePriority,
  type ConversationType,
  type FamilyRecord,
  type MeetingRecord,
  type MeetingType,
  type MessageRecord,
  type MessageRole,
} from "../../../api/client";
import { useLanguage } from "../../../i18n";

type MeetingViewMode = "day" | "week" | "month";

const STUDENT_PORTAL_FALLBACK_ID = "STU006";
const PARENT_PORTAL_FALLBACK_ID = "PARENT_STU006_F";
const PARENT_PORTAL_FALLBACK_STUDENT_ID = "STU006";
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
  currentRole === "counselor"
    ? message.conversationType === "parent"
      ? Boolean(message.parentSeenAt)
      : Boolean(message.studentSeenAt)
    : Boolean(message.counselorSeenAt);

type MessageContact = ChatContact & {
  contactKey: string;
  conversationType: ConversationType;
  studentId: string;
  parentId?: string;
  className?: string;
  kind: "student" | "parent" | "counselor";
};

export const MessengerView = ({
  role,
  initialStudentId,
  initialParentId,
}: {
  role: string;
  initialStudentId?: string;
  initialParentId?: string;
}) => {
  const { t } = useLanguage();
  const currentRole: MessageRole =
    role === "student" ? "student" : role === "parent" ? "parent" : "counselor";
  const { studentsInClass: appStudents } = useAppData();
  const [studentPortalId] = useState(() =>
    window.localStorage.getItem("studentPortalMeetingStudentId") ||
    STUDENT_PORTAL_FALLBACK_ID,
  );
  const [parentPortalId] = useState(() =>
    window.localStorage.getItem("parentPortalParentId") ||
    PARENT_PORTAL_FALLBACK_ID,
  );
  const [parentPortalStudentId] = useState(() =>
    window.localStorage.getItem("parentPortalStudentId") ||
    PARENT_PORTAL_FALLBACK_STUDENT_ID,
  );
  const [activeContactKey, setActiveContactKey] = useState(() =>
    currentRole === "student"
      ? `student:${studentPortalId}`
      : currentRole === "parent"
        ? `parent:${parentPortalId}:${parentPortalStudentId}`
        : initialParentId && initialStudentId
          ? `parent:${initialParentId}:${initialStudentId}`
          : initialStudentId
            ? `student:${initialStudentId}`
            : "",
  );
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [families, setFamilies] = useState<FamilyRecord[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const messageContactKey = (message: MessageRecord) =>
    message.conversationType === "parent"
      ? `parent:${message.parentId || ""}:${message.studentId}`
      : `student:${message.studentId}`;

  const contactMatchesMessage = (
    contact: Pick<
      MessageContact,
      "conversationType" | "studentId" | "parentId"
    >,
    message: MessageRecord,
  ) =>
    message.conversationType === contact.conversationType &&
    message.studentId === contact.studentId &&
    (contact.conversationType === "student" ||
      message.parentId === contact.parentId);

  const reloadMessages = (signal?: AbortSignal) =>
    fetchMessages(
      {
        role: currentRole,
        conversationType:
          currentRole === "student"
            ? "student"
            : currentRole === "parent"
              ? "parent"
              : undefined,
        studentId:
          currentRole === "student"
            ? studentPortalId
            : currentRole === "parent"
              ? parentPortalStudentId
              : undefined,
        parentId: currentRole === "parent" ? parentPortalId : undefined,
        counselorId: DEFAULT_COUNSELOR_ID,
      },
      signal,
    ).then((payload) => {
      setMessages(payload.messages);
      setStatus("ready");
      return payload.messages;
    });

  const reloadFamilies = (signal?: AbortSignal) =>
    fetchFamilies({ counselorId: DEFAULT_COUNSELOR_ID }, signal).then(
      (payload) => {
        setFamilies(payload.families);
        return payload.families;
      },
    );

  React.useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError("");
    Promise.all([
      reloadMessages(controller.signal),
      currentRole === "student"
        ? Promise.resolve([])
        : reloadFamilies(controller.signal),
    ]).catch((err) => {
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
  }, [currentRole, parentPortalId, parentPortalStudentId, studentPortalId]);

  const studentsById = new globalThis.Map(
    appStudents.map((student) => [student.id, student]),
  );
  const familyByParentStudent = new globalThis.Map(
    families.map((family) => [
      `${family.parentId}:${family.studentId}`,
      family,
    ]),
  );
  const studentMessageIds = Array.from(
    new Set(
      messages
        .filter((message) => message.conversationType === "student")
        .map((message) => message.studentId),
    ),
  );
  const parentMessageKeys = Array.from(
    new Set(
      messages
        .filter((message) => message.conversationType === "parent")
        .map((message) => `${message.parentId || ""}:${message.studentId}`),
    ),
  );

  const counselorContacts: MessageContact[] = [
    ...appStudents.map((student) => {
      const conversation = messages.filter(
        (message) =>
          message.conversationType === "student" &&
          message.studentId === student.id,
      );
      const last = conversation[conversation.length - 1];
      const unread = conversation.filter(
        (message) =>
          message.senderRole === "student" && !message.counselorSeenAt,
      ).length;

      return {
        id: `student:${student.id}`,
        contactKey: `student:${student.id}`,
        conversationType: "student",
        studentId: student.id,
        kind: "student",
        name: student.name,
        role: `${t("Học sinh lớp")} ${student.className}`,
        className: student.className,
        avatar: student.name.charAt(student.name.lastIndexOf(" ") + 1),
        lastMsg: last?.text || t("Chưa có tin nhắn"),
        time: last ? formatMessageTime(last.sentAt) : "",
        unread,
      };
    }),
    ...studentMessageIds
      .filter((studentId) => !studentsById.has(studentId))
      .map((studentId) => {
        const conversation = messages.filter(
          (message) =>
            message.conversationType === "student" &&
            message.studentId === studentId,
        );
        const last = conversation[conversation.length - 1];

        return {
          id: `student:${studentId}`,
          contactKey: `student:${studentId}`,
          conversationType: "student" as ConversationType,
          studentId,
          kind: "student" as const,
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
    ...families.map((family) => {
      const contactKey = `parent:${family.parentId}:${family.studentId}`;
      const conversation = messages.filter(
        (message) => messageContactKey(message) === contactKey,
      );
      const last = conversation[conversation.length - 1];
      const unread = conversation.filter(
        (message) =>
          message.senderRole === "parent" && !message.counselorSeenAt,
      ).length;

      return {
        id: contactKey,
        contactKey,
        conversationType: "parent" as ConversationType,
        studentId: family.studentId,
        parentId: family.parentId,
        kind: "parent" as const,
        name: family.parentName,
        role: `${t("Phụ huynh của")} ${family.studentName} · ${family.className || t("Chưa có lớp")}`,
        className: family.className || undefined,
        avatar: family.parentName.charAt(family.parentName.lastIndexOf(" ") + 1),
        lastMsg: last?.text || t("Chưa có tin nhắn"),
        time: last ? formatMessageTime(last.sentAt) : "",
        unread,
      };
    }),
    ...parentMessageKeys
      .filter((key) => !familyByParentStudent.has(key))
      .map((key) => {
        const [parentId, studentId] = key.split(":");
        const contactKey = `parent:${parentId}:${studentId}`;
        const conversation = messages.filter(
          (message) => messageContactKey(message) === contactKey,
        );
        const last = conversation[conversation.length - 1];
        const name = last?.parentName || parentId || t("Phụ huynh");

        return {
          id: contactKey,
          contactKey,
          conversationType: "parent" as ConversationType,
          studentId,
          parentId,
          kind: "parent" as const,
          name,
          role: `${t("Phụ huynh của")} ${last?.studentName || studentId}`,
          className: last?.className,
          avatar: name.charAt(name.lastIndexOf(" ") + 1),
          lastMsg: last?.text || t("Chưa có tin nhắn"),
          time: last ? formatMessageTime(last.sentAt) : "",
          unread: conversation.filter(
            (message) =>
              message.senderRole === "parent" && !message.counselorSeenAt,
          ).length,
        };
      }),
  ];

  const studentMessages = messages.filter(
    (message) =>
      message.conversationType === "student" &&
      message.studentId === studentPortalId,
  );
  const studentLastMessage = studentMessages[studentMessages.length - 1];
  const studentUnread = studentMessages.filter(
    (message) => message.senderRole === "counselor" && !message.studentSeenAt,
  ).length;
  const studentContact: MessageContact = {
    id: DEFAULT_COUNSELOR_ID,
    contactKey: `student:${studentPortalId}`,
    conversationType: "student",
    studentId: studentPortalId,
    kind: "counselor",
    name: DEFAULT_COUNSELOR_NAME,
    role: "Cố vấn hướng nghiệp",
    avatar: "M",
    lastMsg: studentLastMessage?.text || "Bắt đầu nhắn tin với cố vấn",
    time: studentLastMessage ? formatMessageTime(studentLastMessage.sentAt) : "",
    unread: studentUnread,
  };
  const parentFamily =
    families.find(
      (family) =>
        family.parentId === parentPortalId &&
        family.studentId === parentPortalStudentId,
    ) || null;
  const parentMessages = messages.filter(
    (message) =>
      message.conversationType === "parent" &&
      message.parentId === parentPortalId &&
      message.studentId === parentPortalStudentId,
  );
  const parentLastMessage = parentMessages[parentMessages.length - 1];
  const parentUnread = parentMessages.filter(
    (message) => message.senderRole === "counselor" && !message.parentSeenAt,
  ).length;
  const parentContact: MessageContact = {
    id: DEFAULT_COUNSELOR_ID,
    contactKey: `parent:${parentPortalId}:${parentPortalStudentId}`,
    conversationType: "parent",
    studentId: parentPortalStudentId,
    parentId: parentPortalId,
    kind: "counselor",
    name: DEFAULT_COUNSELOR_NAME,
    role: parentFamily
      ? `${t("Cố vấn của")} ${parentFamily.studentName}`
      : "Cố vấn hướng nghiệp",
    avatar: "M",
    lastMsg: parentLastMessage?.text || "Bắt đầu nhắn tin với cố vấn",
    time: parentLastMessage ? formatMessageTime(parentLastMessage.sentAt) : "",
    unread: parentUnread,
  };

  const contacts =
    currentRole === "student"
      ? [studentContact]
      : currentRole === "parent"
        ? [parentContact]
        : counselorContacts;

  React.useEffect(() => {
    const requestedContactKey =
      initialParentId && initialStudentId
        ? `parent:${initialParentId}:${initialStudentId}`
        : initialStudentId
          ? `student:${initialStudentId}`
          : "";

    if (
      currentRole === "counselor" &&
      requestedContactKey &&
      activeContactKey !== requestedContactKey
    ) {
      setActiveContactKey(requestedContactKey);
      return;
    }

    if (
      contacts.length > 0 &&
      (!activeContactKey ||
        !contacts.some((contact) => contact.contactKey === activeContactKey))
    ) {
      setActiveContactKey(contacts[0].contactKey);
    }
  }, [
    activeContactKey,
    contacts,
    currentRole,
    initialParentId,
    initialStudentId,
  ]);

  const activeContact =
    contacts.find((contact) => contact.contactKey === activeContactKey) ||
    contacts[0] ||
    (currentRole === "parent" ? parentContact : studentContact);

  const filteredContacts = contacts.filter(
    (c) =>
      !search ||
      [c.name, c.role, c.className]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
  );

  const activeMessages = messages.filter(
    (message) => contactMatchesMessage(activeContact, message),
  );
  const totalUnread = contacts.reduce((sum, contact) => sum + contact.unread, 0);

  const markActiveSeen = (contact: MessageContact) => {
    markMessagesSeen({
      role: currentRole,
      conversationType: contact.conversationType,
      studentId: contact.studentId,
      parentId: contact.parentId,
      counselorId: DEFAULT_COUNSELOR_ID,
    })
      .then((payload) => {
        setMessages((items) => [
          ...items.filter((message) => !contactMatchesMessage(contact, message)),
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
    markActiveSeen(activeContact);
  }, [activeContact?.contactKey, activeMessages.length, currentRole]);

  const send = () => {
    const text = input.trim();
    if (!text || !activeContact?.studentId) return;
    setInput("");
    createMessage({
      conversationType: activeContact.conversationType,
      studentId: activeContact.studentId,
      parentId: activeContact.parentId,
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

  const contactGrad = (contact: MessageContact) =>
    contact.conversationType === "parent"
      ? "from-rose-500 to-orange-500"
      : currentRole === "student"
        ? "from-orange-400 to-pink-500"
        : "from-blue-500 to-indigo-600";
  const activeContactCls =
    activeContact.conversationType === "parent"
      ? "bg-rose-50 border-l-4 border-l-rose-500"
      : "bg-orange-50 border-l-4 border-l-orange-500";
  const inputFocusCls =
    activeContact.conversationType === "parent"
      ? "focus:ring-rose-400"
      : "focus:ring-orange-400";
  const sendButtonCls =
    currentRole === "parent"
      ? "from-rose-500 to-orange-500"
      : currentRole === "student"
        ? "from-orange-500 to-pink-500"
        : "from-blue-600 to-indigo-600";
  const bubbleClass = (message: MessageRecord, mine: boolean) => {
    if (mine) {
      return currentRole === "parent"
        ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-br-sm"
        : currentRole === "student"
          ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-br-sm"
          : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm";
    }

    if (message.senderRole === "parent") {
      return "bg-rose-50 text-rose-950 border border-rose-100 rounded-bl-sm";
    }
    if (message.senderRole === "student") {
      return "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm";
    }
    return "bg-blue-50 text-blue-950 border border-blue-100 rounded-bl-sm";
  };
  const senderLabel = (message: MessageRecord) => {
    if (message.senderRole === "parent") return t("Phụ huynh");
    if (message.senderRole === "student") return t("Học sinh");
    return t("Cố vấn");
  };

  return (
    <div className="h-[calc(100vh-7.5rem)] flex gap-0 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Contact list */}
      <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="font-bold text-gray-900">{t("Tin nhắn")}</h2>
            {totalUnread > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                {totalUnread} {t("mới")}
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
              placeholder={t("Tìm kiếm...")}
              className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        {status === "error" && (
          <div className="mx-3 mt-3 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs font-semibold text-red-700">
            {t(error)}
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveContactKey(c.contactKey);
                markActiveSeen(c);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-50 ${activeContact.contactKey === c.contactKey ? activeContactCls : "hover:bg-gray-50"}`}
            >
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${contactGrad(c)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
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
                    <span className={`ml-1 w-5 h-5 rounded-full ${c.conversationType === "parent" ? "bg-rose-500" : "bg-orange-500"} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                      {c.unread}
                    </span>
                  )}
                </div>
                {currentRole === "counselor" && (
                  <span
                    className={`mt-1 inline-flex text-[11px] font-bold px-2 py-0.5 rounded-full ${c.conversationType === "parent" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {c.conversationType === "parent"
                      ? t("Phụ huynh")
                      : t("Học sinh")}
                  </span>
                )}
              </div>
            </button>
          ))}
          {status === "loading" && (
            <div className="p-4 text-sm text-gray-500">
              {t("Đang tải tin nhắn...")}
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${contactGrad(activeContact)} flex items-center justify-center text-white font-bold flex-shrink-0`}
          >
            {activeContact.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-gray-900 text-sm">
                {activeContact.name}
              </p>
              {currentRole === "counselor" && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeContact.conversationType === "parent" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"}`}
                >
                  {activeContact.conversationType === "parent"
                    ? t("Phụ huynh")
                    : t("Học sinh")}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{activeContact.role}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs text-gray-500">{t("Đang hoạt động")}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50/50">
          {activeMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              {t("Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện.")}
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
                      className={`w-7 h-7 rounded-full bg-gradient-to-br ${contactGrad(activeContact)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1`}
                    >
                      {activeContact.avatar}
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md ${mine ? "items-end" : "items-start"} flex flex-col gap-1`}
                  >
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${bubbleClass(msg, mine)}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-400 px-1">
                      {senderLabel(msg)} ·{" "}
                      {formatMessageTime(msg.sentAt)}
                      {mine && (
                        <>
                          {" · "}
                          {messageSeenByRecipient(msg, currentRole)
                            ? t("Đã xem")
                            : t("Đã gửi")}
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
            placeholder={t("Nhập tin nhắn...")}
            className={`flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 ${inputFocusCls} focus:bg-white transition-colors`}
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sendButtonCls} text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity flex-shrink-0`}
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
  const { t, formatDate, formatTime, formatDateTime } = useLanguage();
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
          <h1 className="text-xl font-bold text-gray-900">{t("Lịch hẹn")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {role === "student"
              ? t("Lịch hẹn hỗ trợ từ cố vấn hướng nghiệp")
              : t("Lịch hẹn hỗ trợ đã tạo cho học sinh")}
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
                {t(label)}
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
                {t("Bạn có")} {newMeetings.length} {t("lịch hẹn mới từ cố vấn.")}
              </p>
              <p className="text-xs mt-0.5 opacity-80">
                {t("Xem chi tiết trong calendar và danh sách lịch sắp tới bên dưới.")}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {t(error)}
        </div>
      )}
      {error && status !== "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {t(error)}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-gray-900">{t("Tạo lịch meeting")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {role === "student"
                ? `${t("Tạo lịch cho học sinh")} ${studentId}`
                : t("Chọn học sinh và điền thông tin lịch hẹn")}
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
                {t("Tìm học sinh")}
              </label>
              <input
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder={t("Tên, mã học sinh hoặc lớp")}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                {t("Chọn học sinh")}
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
              {t("Thời gian")}
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
              {t("Chủ đề meeting")}
            </label>
            <input
              value={meetingTopic}
              onChange={(event) => setMeetingTopic(event.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100"
              placeholder={t("VD: Tư vấn định hướng nghề nghiệp")}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
              {t("Loại hẹn gặp")}
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
                {t("Link meeting online")}
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
          {formStatus === "saving" ? t("Đang lưu...") : t("Lưu")}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-gray-900">{t("Calendar")}</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {meetings.length} {t("lịch hẹn")}
              </p>
            </div>
            {status === "loading" && (
              <span className="text-xs font-semibold text-gray-400">
                {t("Đang tải...")}
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
                      {formatDate(date, {
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
                                {t("Chưa note")}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] opacity-80 mt-0.5">
                            {formatTime(meetingDate(meeting), {
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
                        {t("lịch khác")}
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
            <h2 className="font-bold text-gray-900">{t("Lịch sắp tới")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {upcoming.length} {t("lịch chưa diễn ra")}
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {status === "loading" ? (
              <div className="p-5 text-sm text-gray-500">{t("Đang tải lịch...")}</div>
            ) : upcoming.length === 0 ? (
              <div className="p-5 text-sm text-gray-500">
                {t("Chưa có lịch hẹn sắp tới.")}
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
                            {t("Mới")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(meeting.scheduledAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {role === "student"
                          ? `${t("Cố vấn")}: ${meeting.counselorName}`
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
          <h2 className="font-bold text-gray-900">{t("Lịch sử meeting")}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {history.length} {t("lịch hẹn đã ghi nhận")}
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {history.length === 0 ? (
            <div className="p-5 text-sm text-gray-500">{t("Chưa có meeting nào.")}</div>
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
                        {passed ? t("Đã diễn ra") : t("Chưa diễn ra")}
                        </span>
                        {passed && !meeting.meetingNote && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            {t("Chưa có note")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDateTime(meeting.scheduledAt)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {role === "student"
                          ? `${t("Cố vấn")}: ${meeting.counselorName}`
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
                  {t("Chi tiết meeting")}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {t("ID lịch hẹn")} #{selectedMeeting.id}
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
                  {t("Meeting này đã diễn ra nhưng chưa có note cuộc họp.")}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    {t("Học sinh")}
                  </p>
                  <p className="font-semibold text-gray-800">
                    {selectedMeeting.studentName} · {selectedMeeting.className}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">
                    {t("Cố vấn")}
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
                      {t("Chủ đề meeting")}
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
                        {t("Thời gian")}
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
                        {t("Loại hẹn gặp")}
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
                        {t("Link meeting online")}
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
                    {formatDateTime(selectedMeeting.scheduledAt)}
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
                  {t("Note cuộc họp")}
                </label>
                {role === "counselor" && meetingHasPassed(selectedMeeting) ? (
                  <textarea
                    rows={4}
                    value={detailNote}
                    onChange={(event) => setDetailNote(event.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    placeholder={t("Ghi lại điểm chính của cuộc họp...")}
                  />
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedMeeting.meetingNote || t("Chưa có note cuộc họp.")}
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
                    {t("Chỉnh sửa")}
                  </button>
                )}
                {role === "counselor" && !meetingHasPassed(selectedMeeting) && editMode && (
                  <>
                    <button
                      onClick={() => openMeeting(selectedMeeting)}
                      disabled={detailStatus === "saving"}
                      className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 disabled:opacity-60"
                    >
                      {t("Hủy")}
                    </button>
                    <button
                      onClick={saveMeetingEdit}
                      disabled={detailStatus === "saving"}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {detailStatus === "saving" ? t("Đang lưu...") : t("Lưu chỉnh sửa")}
                    </button>
                  </>
                )}
                {role === "counselor" && meetingHasPassed(selectedMeeting) && (
                  <button
                    onClick={saveMeetingNote}
                    disabled={detailStatus === "saving"}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                  >
                    {detailStatus === "saving" ? t("Đang lưu...") : t("Lưu note")}
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
  const { t } = useLanguage();
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
            {t("Lời khuyên từ Giáo viên")} 📬
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? (
              <span className="text-orange-600 font-semibold">
                {unreadCount} {t("lời khuyên chưa đọc")}
              </span>
            ) : (
              `${t("Tất cả đã đọc")} ✓`
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
            <ArrowRight size={13} className="rotate-180" /> {t("Quay lại")}
          </button>
          <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-orange-400 to-pink-500" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[selected.priority]} mb-2 inline-block`}
                  >
                    {t(priorityLabel[selected.priority])}
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
                  ✓ {t("Đã đọc & Hiểu")}
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
                  {t(priorityLabel[note.priority])}
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
                    {t("Chưa đọc")} →
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
  const { t, formatDateTime } = useLanguage();
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

    return formatDateTime(date, {
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
            {t("Lời khuyên cho Học sinh")}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} {t("advice note đã tạo bởi")} {DEFAULT_COUNSELOR_NAME}
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
                {t("Sắp xếp")}: {t(label)}
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
            <option value={20}>20 / {t("trang")}</option>
            <option value={25}>25 / {t("trang")}</option>
            <option value={30}>30 / {t("trang")}</option>
          </select>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90"
          >
            <Plus size={15} /> {t("Tạo note mới")}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <FileText size={16} className="text-blue-600" /> {t("Soạn lời khuyên mới")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                {t("Gửi đến học sinh")}
              </label>
              <select
                value={form.studentId}
                onChange={(e) =>
                  setForm({ ...form, studentId: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- {t("Chọn học sinh")} --</option>
                {studentsInClass.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} · {student.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                {t("Mức độ ưu tiên")}
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
                <option value="high">🔴 {t("Quan trọng")}</option>
                <option value="medium">🟡 {t("Lưu ý")}</option>
                <option value="low">⚪ {t("Thông tin")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              {t("Tiêu đề")}
            </label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder={t("VD: Lộ trình học tập học kỳ 2...")}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              {t("Nội dung lời khuyên")}
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={5}
              placeholder={t("Nhập lời khuyên chi tiết dành cho học sinh...")}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1 border-t border-gray-100">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {t("Huỷ")}
            </button>
            <button
              onClick={send}
              disabled={!form.studentId || !form.subject || !form.body}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowRight size={14} /> {t("Gửi lời khuyên")}
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {t(error)}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-gray-900">{t("Lịch sử advice note")}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {firstItem}-{lastItem} / {total} · {t(sortLabels[sort])}
            </p>
          </div>
          {(status === "loading" || status === "deleting") && (
            <span className="text-xs font-semibold text-gray-400">
              {status === "deleting" ? t("Đang xóa...") : t("Đang tải...")}
            </span>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {status === "loading" && notes.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              {t("Đang tải advice notes...")}
            </div>
          ) : notes.length === 0 ? (
            <div className="p-6 text-sm text-gray-500">
              {t("Chưa có advice note nào.")}
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
                        {t(priorityLabel[note.priority])}
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
                        {note.studentSeenAt ? t("Đã đọc") : t("Chưa đọc")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeNote(note.id)}
                    disabled={status === "deleting"}
                    className="w-9 h-9 rounded-xl border border-red-100 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 disabled:opacity-50 flex-shrink-0"
                    title={t("Xóa advice note")}
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
          {t("Trang")} {page} · {t("Hiển thị")} {pageSize} {t("note mỗi trang")}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            {t("Trước")}
          </button>
          <button
            onClick={() => setPage((value) => value + 1)}
            disabled={!hasMore}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
          >
            {t("Sau")}
          </button>
        </div>
      </div>
    </div>
  );
};
