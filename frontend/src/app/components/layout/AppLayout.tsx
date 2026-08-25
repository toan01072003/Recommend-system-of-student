import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BarChart2,
  Bell,
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Compass,
  Edit2,
  FileText,
  FolderOpen,
  GraduationCap,
  Heart,
  Home,
  Layers,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  PieChart,
  Search,
  Shield,
  Target,
  TrendingUp,
  Trophy,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { LanguageSwitcher, useLanguage, useT } from "../../i18n";

type NavItem = { id: string; label: string; icon: any; enLabel?: string };
type NavGroup = {
  group: string;
  icon: any;
  items: NavItem[];
  enGroup?: string;
};

const counselorNavGroups: NavGroup[] = [
  {
    group: "Bảng điều khiển",
    icon: LayoutDashboard,
    items: [{ id: "co-dashboard", label: "Tổng quan", icon: LayoutDashboard }],
  },
  {
    group: "Học sinh",
    enGroup: "Students",
    icon: Users,
    items: [
      { id: "co-students-list", label: "Danh sách học sinh", icon: UserCheck },
      { id: "co-student-groups", label: "Nhóm học sinh", icon: Layers },
    ],
  },
  {
    group: "Gia đình",
    icon: Heart,
    items: [{ id: "co-families", label: "Gia đình", icon: Heart }],
  },
  {
    group: "Chức năng",
    icon: Lightbulb,
    items: [
      { id: "co-lessons", label: "Bài học", icon: BookOpen },
      { id: "co-assignments", label: "Bài tập", icon: ClipboardList },
      { id: "co-surveys", label: "Khảo sát", icon: FileText },
    ],
  },
  {
    group: "Báo cáo",
    icon: PieChart,
    items: [
      { id: "co-report-work", label: "Bài làm học sinh", icon: Trophy },
      { id: "co-report-lessons", label: "Tiến độ bài học", icon: TrendingUp },
      { id: "co-report-engagement", label: "Tương tác", icon: Activity },
    ],
  },
  {
    group: "Kết nối",
    enGroup: "Connector",
    icon: MessageSquare,
    items: [
      { id: "co-messenger", label: "Tin nhắn", icon: MessageSquare },
      { id: "co-advice", label: "Ghi chú tư vấn", icon: BookMarked },
      { id: "co-meeting", label: "Lịch hẹn", icon: CalendarDays },
    ],
  },
];

const studentNavGroups: NavGroup[] = [
  {
    group: "Trang chủ",
    icon: Home,
    items: [
      { id: "st-dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
      { id: "st-references", label: "Tham chiếu", icon: BookOpen },
      { id: "st-lessons", label: "Bài học", icon: BookMarked },
      { id: "st-surveys", label: "Khảo sát", icon: ClipboardList },
      { id: "st-assignment", label: "Bài tập", icon: FileText },
    ],
  },
  {
    group: "Khám phá",
    icon: Compass,
    items: [
      { id: "st-explore", label: "Khám phá ngành nghề", icon: MapPin },
      { id: "st-universities", label: "Khám phá Đại học", icon: GraduationCap },
    ],
  },
  {
    group: "Về tôi",
    icon: User,
    items: [
      { id: "st-personal", label: "Thông tin cá nhân", icon: User },
      { id: "st-portfolio", label: "Hồ sơ năng lực", icon: FolderOpen },
      { id: "st-resume", label: "CV", icon: FileText },
      { id: "st-applications", label: "Kết quả ứng tuyển", icon: Trophy },
    ],
  },
  {
    group: "Kế hoạch",
    icon: Map,
    items: [
      { id: "st-plan-grade", label: "Kế hoạch theo lớp", icon: BookOpen },
      { id: "st-plan-pathways", label: "Kế hoạch lộ trình", icon: Target },
    ],
  },
  {
    group: "Kết nối",
    icon: MessageSquare,
    items: [
      { id: "st-messenger", label: "Tin nhắn", icon: MessageSquare },
      { id: "st-advice", label: "Ghi chú tư vấn", icon: BookMarked },
      { id: "st-meeting", label: "Lịch hẹn", icon: CalendarDays },
    ],
  },
];

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { id: "school-overview", label: "Tổng quan trường", icon: LayoutDashboard },
    { id: "grade-dashboard", label: "Dashboard khối", icon: BarChart2 },
    { id: "class-dashboard", label: "Dashboard lớp", icon: Users },
    { id: "student-profile", label: "Hồ sơ học sinh", icon: UserCheck },
    { id: "data-quality", label: "Dữ liệu & Bảo mật", icon: Shield },
  ],
  teacher: [
    { id: "class-dashboard", label: "Lớp của tôi", icon: Users },
    { id: "student-profile", label: "Hồ sơ học sinh", icon: UserCheck },
    { id: "teacher-entry", label: "Nhập dữ liệu", icon: Edit2 },
  ],
  counselor: [],
  parent: [
    { id: "parent-portal", label: "Tiến độ của con", icon: Heart },
    { id: "parent-messenger", label: "Messenger", icon: MessageSquare },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Quản trị viên",
  teacher: "GV Trần Thị Lan",
  counselor: "CV Nguyễn Văn Minh",
  student: "Nguyễn Minh Anh",
  parent: "PH Nguyễn Văn Bình",
};

const GroupedSidebar = ({
  view,
  setView,
  onLogout,
  navGroups,
  brand,
  accentGrad,
  activeCls,
  userLabel,
  userSub,
  userGrad,
}: {
  view: string;
  setView: (v: string) => void;
  onLogout: () => void;
  navGroups: NavGroup[];
  brand: string;
  accentGrad: string;
  activeCls: string;
  userLabel: string;
  userSub: string;
  userGrad: string;
}) => {
  const { language, t } = useLanguage();
  const labelText = (label: string, english?: string) =>
    language === "en" ? english ?? t(label) : label;
  const defaultOpen =
    navGroups.find((g) => g.items.some((i) => i.id === view))?.group ??
    navGroups[0]?.group;
  const homeGroup = navGroups.find((g) => g.group === "Trang chủ")?.group;
  const [openGroups, setOpenGroups] = useState<string[]>(
    Array.from(new Set([defaultOpen, homeGroup].filter(Boolean) as string[])),
  );
  const toggle = (g: string) =>
    setOpenGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  return (
    <aside
      className="w-56 flex flex-col flex-shrink-0 h-screen"
      style={{ background: accentGrad }}
    >
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#F97316,#EC4899)" }}
        >
          <GraduationCap size={15} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-none">EduPath</p>
          <p className="text-white/50 text-xs mt-0.5">{t(brand)}</p>
        </div>
      </div>
      <div className="mx-4 mt-4 mb-2 flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/10">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0 bg-gradient-to-br ${userGrad}`}
        >
          {userLabel.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-white text-xs font-bold leading-none truncate">
            {userLabel}
          </p>
          <p className="text-white/50 text-xs mt-0.5">{t(userSub)}</p>
        </div>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto px-2">
        {navGroups.map((group) => {
          const isOpen = openGroups.includes(group.group);
          const isActiveGroup = group.items.some((i) => i.id === view);
          return (
            <div key={group.group} className="mb-1">
              <button
                onClick={() => toggle(group.group)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors ${isActiveGroup ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
              >
                <group.icon size={15} className="flex-shrink-0" />
                <span className="text-sm font-bold flex-1">
                  {labelText(group.group, group.enGroup)}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="ml-3 mt-0.5 border-l-2 border-white/10 pl-2 space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all text-xs ${view === item.id ? activeCls + " font-bold shadow-sm" : "text-white/60 hover:bg-white/10 hover:text-white font-medium"}`}
                    >
                      <item.icon size={13} className="flex-shrink-0" />
                      {labelText(item.label, item.enLabel)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={14} />
          <span className="text-xs font-medium">{t("Đăng xuất")}</span>
        </button>
      </div>
    </aside>
  );
};

export const CounselorSidebar = ({
  view,
  setView,
  onLogout,
}: {
  view: string;
  setView: (v: string) => void;
  onLogout: () => void;
}) => (
  <GroupedSidebar
    view={view}
    setView={setView}
    onLogout={onLogout}
    navGroups={counselorNavGroups}
    brand="Cố vấn hướng nghiệp"
    accentGrad="linear-gradient(180deg, #0F2744 0%, #1E3A5F 55%, #1E40AF 100%)"
    activeCls="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
    userLabel="Nguyễn Văn Minh"
    userSub="Cố vấn · 128 HS"
    userGrad="from-blue-400 to-indigo-600"
  />
);

export const StudentSidebar = ({
  view,
  setView,
  onLogout,
}: {
  view: string;
  setView: (v: string) => void;
  onLogout: () => void;
}) => (
  <GroupedSidebar
    view={view}
    setView={setView}
    onLogout={onLogout}
    navGroups={studentNavGroups}
    brand="Học sinh"
    accentGrad="linear-gradient(180deg, #1C1347 0%, #2D1B69 60%, #4C1D95 100%)"
    activeCls="bg-gradient-to-r from-orange-500 to-pink-500 text-white"
    userLabel="Nguyễn Minh Anh"
    userSub="Lớp 9A · 62% hồ sơ"
    userGrad="from-orange-400 to-pink-500"
  />
);

export const Sidebar = ({
  role,
  view,
  setView,
  onLogout,
}: {
  role: string;
  view: string;
  setView: (v: string) => void;
  onLogout: () => void;
}) => {
  const nav = navByRole[role] ?? [];
  const t = useT();
  const roleLabel = roleLabels[role] ?? "";
  const roleHeader =
    role === "admin" ? t(roleLabel) : roleLabel;
  return (
    <aside className="w-52 bg-[#1C2B4A] flex flex-col flex-shrink-0 h-screen">
      <div className="p-4 border-b border-white/10 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap size={15} className="text-white" />
        </div>
        <div>
          <p className="text-white text-sm font-bold leading-none">EduPath</p>
          <p className="text-blue-300 text-xs mt-0.5">{t("Hướng nghiệp")}</p>
        </div>
      </div>
      <nav className="flex-1 py-3 overflow-y-auto">
        <p className="px-4 pb-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
          {roleHeader}
        </p>
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors mb-0.5 ${
              view === item.id
                ? "bg-[#EA580C] text-white"
                : "text-blue-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <item.icon size={15} className="flex-shrink-0" />
            <span className="text-sm font-medium leading-none">
              {t(item.label)}
            </span>
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-blue-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut size={15} />
          <span className="text-sm font-medium">{t("Đăng xuất")}</span>
        </button>
      </div>
    </aside>
  );
};

export const TopNav = ({ role }: { role: string }) => {
  const t = useT();
  const roleLabel = roleLabels[role] ?? "";
  const displayRoleLabel = role === "admin" ? t(roleLabel) : roleLabel;

  return (
    <header
      className={`h-14 border-b flex items-center px-5 gap-4 flex-shrink-0 ${role === "student" ? "border-orange-100 bg-white" : "border-gray-100 bg-white"}`}
    >
      <div className="relative flex-1 max-w-64">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          className={`w-full pl-8 pr-3 py-2 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${role === "student" ? "border-orange-200 focus:ring-orange-400" : "border-gray-200 focus:ring-orange-400"}`}
          placeholder={
            role === "student"
              ? t("Tìm bài học, ngành nghề...")
              : t("Tìm học sinh, lớp...")
          }
        />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <LanguageSwitcher />
        <button
          className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label={t("Thông báo")}
          title={t("Thông báo")}
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${role === "student" ? "bg-gradient-to-br from-orange-400 to-pink-500" : "bg-gradient-to-br from-orange-400 to-amber-500"}`}
          >
            {roleLabel.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block">
            {displayRoleLabel}
          </span>
        </div>
      </div>
    </header>
  );
};

type BotMsg = {
  id: number;
  from: "bot" | "user";
  text: string;
  preserveText?: boolean;
};

const BOT_QUICK = [
  "Tôi nên chọn ngành nào?",
  "Điểm chuẩn vào HUST là bao nhiêu?",
  "Làm thế nào để hoàn thiện hồ sơ?",
  "Tôi có thể làm bài test hướng nghiệp ở đâu?",
];

const BOT_REPLIES: Record<string, string> = {
  "Tôi nên chọn ngành nào?":
    "Dựa trên kết quả MBTI và Holland của bạn (INTJ / I-C-R), bạn phù hợp nhất với nhóm **Khoa học & Công nghệ** — đặc biệt là Kỹ thuật Phần mềm (92%) và Khoa học Dữ liệu (87%). Bạn có muốn tìm hiểu chi tiết không? 🎯",
  "Điểm chuẩn vào HUST là bao nhiêu?":
    "Năm 2024, ĐH Bách Khoa Hà Nội có điểm chuẩn dao động **26.75 – 27.55 điểm** tùy ngành (tổ hợp A00/A01). Ngành Khoa học Máy tính là cao nhất: 27.55 điểm. Bạn muốn xem thêm các trường khác không? 📚",
  "Làm thế nào để hoàn thiện hồ sơ?":
    "Hồ sơ của bạn hiện đạt **62%**. Để hoàn thiện, bạn cần: ✅ Hoàn thành bài test MBTI · ✅ Cập nhật thông tin cá nhân · ✅ Thêm thành tích vào Portfolio. Tôi có thể dẫn bạn đến từng mục nhé! 💪",
  "Tôi có thể làm bài test hướng nghiệp ở đâu?":
    "Bạn có thể làm bài test tại mục **Surveys** trong thanh điều hướng bên trái. Hiện có 4 bài test: Holland Code ✅, MBTI 🧠, Kỹ năng mềm ⚡, và Năng lực học tập 📚. Bạn chưa làm MBTI nhé! 😊",
};

const BOT_DEFAULT =
  "Cảm ơn bạn đã hỏi! Tôi đang tìm câu trả lời phù hợp nhất cho bạn. Trong thời gian chờ, bạn có thể liên hệ trực tiếp cố vấn hướng nghiệp qua mục **Messenger** nhé 💬";

export const SupportChatbot = ({ role }: { role: string }) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<BotMsg[]>([
    {
      id: 0,
      from: "bot",
      text: "Xin chào! Tôi là EduBot 🤖 — trợ lý hướng nghiệp của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    const trimmed = text.trim();
    const userMsg: BotMsg = {
      id: Date.now(),
      from: "user",
      text: trimmed,
      preserveText: !BOT_REPLIES[trimmed],
    };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_REPLIES[trimmed] ?? BOT_DEFAULT;
      setMsgs((p) => [...p, { id: Date.now() + 1, from: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  };

  const unread =
    !open && msgs.length > 1 && msgs[msgs.length - 1].from === "bot";

  return (
    <>
      {open && (
        <div
          className="fixed bottom-20 right-5 z-50 w-80 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
          style={{ height: 480, background: "#fff" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#EA580C,#F59E0B)" }}
          >
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none">
                EduBot
              </p>
              <p className="text-white/75 text-xs mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                {typing ? t("Đang nhập...") : t("Trợ lý hướng nghiệp")}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
            >
              <span className="text-lg leading-none font-light">×</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/60">
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.from === "bot" && (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                    style={{
                      background: "linear-gradient(135deg,#EA580C,#F59E0B)",
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === "user" ? "text-white rounded-br-sm" : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"}`}
                  style={
                    msg.from === "user"
                      ? {
                          background: "linear-gradient(135deg,#EA580C,#F59E0B)",
                        }
                      : {}
                  }
                  dangerouslySetInnerHTML={{
                    __html: (msg.preserveText ? msg.text : t(msg.text)).replace(
                      /\*\*(.*?)\*\*/g,
                      "<strong>$1</strong>",
                    ),
                  }}
                />
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                  style={{
                    background: "linear-gradient(135deg,#EA580C,#F59E0B)",
                  }}
                >
                  🤖
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {msgs.length <= 2 && !typing && (
            <div className="px-3 py-2 border-t border-gray-100 bg-white flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-xs text-gray-400 font-medium px-1">
                {t("Câu hỏi gợi ý")}
              </p>
              <div className="flex flex-col gap-1">
                {BOT_QUICK.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left text-xs px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors font-medium"
                  >
                    {t(q)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-3 py-3 border-t border-gray-100 bg-white flex items-center gap-2 flex-shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder={t("Nhập câu hỏi...")}
              className="flex-1 px-3.5 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#EA580C,#F59E0B)" }}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          background: open
            ? "#6b7280"
            : "linear-gradient(135deg,#EA580C,#F59E0B)",
        }}
        title={t("EduBot — Trợ lý hướng nghiệp")}
      >
        {open ? (
          <span className="text-white text-2xl font-light leading-none">×</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
        {unread && (
          <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-500 border-2 border-white" />
        )}
      </button>
    </>
  );
};
