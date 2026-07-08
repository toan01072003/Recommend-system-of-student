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

export const MessengerView = ({ role }: { role: string }) => {
  const contacts =
    role === "student" ? CONTACTS_FOR_STUDENT : CONTACTS_FOR_COUNSELOR;
  const [activeContact, setActiveContact] = useState<ChatContact>(contacts[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: "me",
        text: input.trim(),
        time: new Date().toLocaleTimeString("vi", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInput("");
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
          <h2 className="font-bold text-gray-900 mb-3">Tin nhắn 💬</h2>
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
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-50 ${activeContact.id === c.id ? "bg-orange-50 border-l-4 border-l-orange-500" : "hover:bg-gray-50"}`}
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.from === "me" ? "flex-row-reverse" : ""}`}
            >
              {msg.from === "them" && (
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1`}
                >
                  {activeContact.avatar}
                </div>
              )}
              <div
                className={`max-w-xs lg:max-w-md ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === "me" ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
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
  const [notes, setNotes] = useState<(AdviceNote & { to: string })[]>([
    {
      id: 1,
      from: "Thầy Nguyễn Văn Minh",
      to: "Nguyễn Minh Anh",
      subject: "Lộ trình học tập học kỳ 2",
      body: "Minh Anh ơi, dựa trên kết quả test MBTI và Holland của em, thầy khuyên em nên chọn tổ hợp A01...",
      date: "20/06/2025",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      from: "Thầy Nguyễn Văn Minh",
      to: "Trần Đức Huy",
      subject: "Định hướng nghề nghiệp phù hợp",
      body: "Dựa trên kết quả khảo sát, em phù hợp với nhóm ngành Kinh tế và Quản trị...",
      date: "18/06/2025",
      read: true,
      priority: "medium",
    },
    {
      id: 3,
      from: "Thầy Nguyễn Văn Minh",
      to: "Hoàng Thị Mai",
      subject: "Chuẩn bị hồ sơ Y khoa",
      body: "Hồ sơ y khoa cần điểm Sinh-Hóa rất cao. Em cần tập trung ôn luyện...",
      date: "15/06/2025",
      read: true,
      priority: "high",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    to: "",
    subject: "",
    body: "",
    priority: "medium" as "high" | "medium" | "low",
  });

  const send = () => {
    if (!form.to || !form.subject || !form.body) return;
    const newNote = {
      id: Date.now(),
      from: "Thầy Nguyễn Văn Minh",
      to: form.to,
      subject: form.subject,
      body: form.body,
      date: new Date().toLocaleDateString("vi"),
      read: false,
      priority: form.priority,
    };
    setNotes((prev) => [newNote, ...prev]);
    setForm({ to: "", subject: "", body: "", priority: "medium" });
    setShowForm(false);
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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Lời khuyên cho Học sinh 📝
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {notes.length} lời khuyên đã gửi
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={15} /> Tạo lời khuyên mới
        </button>
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
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn học sinh --</option>
                {CONTACTS_FOR_COUNSELOR.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
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
                  setForm({ ...form, priority: e.target.value as any })
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
              disabled={!form.to || !form.subject || !form.body}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowRight size={14} /> Gửi lời khuyên
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityCls[note.priority]}`}
              >
                {priorityLabel[note.priority]}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {note.date}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              {note.subject}
            </h3>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              {note.body}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {note.to.split(" ").pop()?.charAt(0)}
                </div>
                <span className="text-xs text-gray-600 font-semibold">
                  → {note.to}
                </span>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${note.read ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}
              >
                {note.read ? "Đã đọc ✓" : "Chưa đọc"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
