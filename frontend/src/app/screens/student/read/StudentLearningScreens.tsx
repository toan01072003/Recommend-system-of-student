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
  ImagePlus,
  LoaderCircle,
  Send,
  Sparkles,
  X,
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
  fetchHomeworkChatAi,
  type HomeworkChatAiResponse,
} from "../../../api/client";
import { currentStudentReferenceId } from "../../../logic/referenceActions";
import { useT } from "../../../i18n";

export const StudentLessons = () => {
  const t = useT();
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
        <h1 className="text-xl font-bold text-gray-900">
          {t("Bài học")} 📖
        </h1>{" "}
        <p className="text-sm text-gray-500 mt-0.5">
          2 / 6 {t("bài đã hoàn thành")}
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
                ? t("Xem lại")
                : l.progress > 0
                  ? t("Tiếp tục")
                  : t("Bắt đầu")}{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
};

type HomeworkChatMessage = {
  role: "student" | "assistant";
  text: string;
  imageName?: string;
  imagePreview?: string;
  result?: HomeworkChatAiResponse;
};

const HOMEWORK_CHAT_SUGGESTIONS = [
  "Bài này thuộc môn nào, lớp mấy và phần nào trong SGK?",
  "Hãy hướng dẫn em cách làm từng bước, đừng chỉ đưa đáp án.",
  "Em cần xem lại công thức hoặc bài học nào trước khi giải?",
  "Kiểm tra giúp em lời giải này sai ở bước nào.",
];

const cleanHomeworkChatText = (text: string) =>
  text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/^\s*[*-]\s+/gm, "")
    .replace(/\\\*/g, "")
    .trim();

const readHomeworkImage = (
  file: File,
): Promise<{ mimeType: string; data: string; name: string; preview: string }> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const preview = String(reader.result || "");
      const data = preview.includes(",") ? preview.split(",", 2)[1] : preview;
      resolve({
        mimeType: file.type || "image/jpeg",
        data,
        name: file.name,
        preview,
      });
    };
    reader.onerror = () => reject(new Error("Không đọc được ảnh bài tập."));
    reader.readAsDataURL(file);
  });

export const StudentAssignment = () => {
  const t = useT();
  const studentId = currentStudentReferenceId();
  const [homeworkInput, setHomeworkInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [messages, setMessages] = useState<HomeworkChatMessage[]>([
    {
      role: "assistant",
      text:
        "Gửi đề bài bằng chữ hoặc ảnh. Mình sẽ đọc đề, đoán môn/lớp/phần SGK liên quan, rồi hướng dẫn em xem lại bài nào và giải theo từng bước.",
    },
  ]);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");

  const askHomeworkQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if ((!question && !selectedImage) || status === "loading") return;

    setError("");
    setStatus("loading");
    setHomeworkInput("");

    const imageForMessage = selectedImage;
    setSelectedImage(null);
    setMessages((current) => [
      ...current,
      {
        role: "student",
        text: question || "Em gửi ảnh bài tập, nhờ thầy/cô hướng dẫn giúp em.",
        imageName: imageForMessage?.file.name,
        imagePreview: imageForMessage?.preview,
      },
    ]);

    try {
      const imagePayload = imageForMessage
        ? await readHomeworkImage(imageForMessage.file)
        : null;
      const payload = await fetchHomeworkChatAi({
        studentId,
        question,
        image: imagePayload
          ? {
              mimeType: imagePayload.mimeType,
              data: imagePayload.data,
              name: imagePayload.name,
            }
          : undefined,
        locale: "vi",
      });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: cleanHomeworkChatText(payload.detectedProblem),
          result: {
            ...payload,
            detectedProblem: cleanHomeworkChatText(payload.detectedProblem),
            subject: cleanHomeworkChatText(payload.subject),
            grade: cleanHomeworkChatText(payload.grade),
            textbookArea: cleanHomeworkChatText(payload.textbookArea),
            recommendedLessons: payload.recommendedLessons.map(cleanHomeworkChatText).filter(Boolean),
            solutionGuide: payload.solutionGuide.map(cleanHomeworkChatText).filter(Boolean),
            commonMistakes: payload.commonMistakes.map(cleanHomeworkChatText).filter(Boolean),
            nextQuestion: cleanHomeworkChatText(payload.nextQuestion),
          },
        },
      ]);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Chưa gọi được Gemini. Hãy kiểm tra backend và GEMINI_API_KEY.";
      setError(message);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: message,
        },
      ]);
    } finally {
      setStatus("idle");
    }
  };

  const handleImageChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("File này không phải ảnh. Hãy chọn ảnh JPG, PNG hoặc ảnh chụp màn hình.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Ảnh hơi lớn. Hãy chọn ảnh dưới 4MB để gửi nhanh hơn.");
      return;
    }
    setError("");
    setSelectedImage({ file, preview: URL.createObjectURL(file) });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("Bài tập")} cùng trợ lý AI
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Nhập đề bài hoặc gửi ảnh. Trợ lý sẽ chỉ ra bài thuộc phần nào và hướng dẫn cách tự làm.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          <Sparkles size={15} />
          Gemini tutor
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <MessageSquare size={16} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Chat hướng dẫn giải bài tập</h2>
              <p className="text-xs text-gray-500">Có thể gửi văn bản, ảnh chụp đề hoặc cả hai.</p>
            </div>
          </div>

          <div className="h-[520px] overflow-y-auto bg-slate-50/70 p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "student"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "mr-auto bg-white text-gray-700 border border-gray-100"
                }`}
              >
                {message.imagePreview && (
                  <div className="mb-2 overflow-hidden rounded-xl border border-white/40 bg-white/10">
                    <img
                      src={message.imagePreview}
                      alt={message.imageName || "Ảnh bài tập"}
                      className="max-h-56 w-full object-contain"
                    />
                  </div>
                )}
                {!message.result && (
                  <p className="whitespace-pre-line">{cleanHomeworkChatText(message.text)}</p>
                )}
                {message.result && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-wide text-emerald-600">
                        Đề bài trợ lý hiểu được
                      </p>
                      <p className="mt-1 text-gray-800">{message.result.detectedProblem}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[message.result.subject, message.result.grade, message.result.textbookArea].map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Nên xem lại</p>
                      <ul className="mt-1.5 space-y-1.5">
                        {message.result.recommendedLessons.map((item, itemIndex) => (
                          <li key={`${index}-lesson-${itemIndex}`} className="flex gap-2 text-sm">
                            <BookOpen size={15} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Cách làm</p>
                      <ol className="mt-1.5 space-y-2">
                        {message.result.solutionGuide.map((item, itemIndex) => (
                          <li key={`${index}-step-${itemIndex}`} className="flex gap-2 text-sm">
                            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-700">
                              {itemIndex + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="rounded-xl bg-amber-50 px-3 py-2 text-amber-800">
                      <p className="font-bold">Lỗi dễ gặp</p>
                      <ul className="mt-1 space-y-1">
                        {message.result.commonMistakes.map((item, itemIndex) => (
                          <li key={`${index}-mistake-${itemIndex}`}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-emerald-800">
                      <span className="font-bold">Em thử tiếp: </span>
                      {message.result.nextQuestion}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {status === "loading" && (
              <div className="mr-auto flex max-w-[92%] items-center gap-2 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-500 shadow-sm">
                <LoaderCircle size={16} className="animate-spin text-emerald-600" />
                Gemini đang đọc đề và soạn hướng dẫn...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Gửi bài tập</h3>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                askHomeworkQuestion(homeworkInput);
              }}
            >
              <textarea
                value={homeworkInput}
                onChange={(event) => setHomeworkInput(event.target.value)}
                disabled={status === "loading"}
                rows={7}
                placeholder="Ví dụ: Giải phương trình 2x + 3 = 11. Bài này thuộc phần nào và em nên làm từng bước ra sao?"
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />

              {selectedImage ? (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2">
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <span className="truncate text-xs font-bold text-emerald-800">
                      {selectedImage.file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="h-7 w-7 rounded-lg bg-white text-gray-500 flex items-center justify-center hover:text-red-600"
                      title="Bỏ ảnh"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <img
                    src={selectedImage.preview}
                    alt={selectedImage.file.name}
                    className="max-h-44 w-full rounded-xl object-contain bg-white"
                  />
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-3 py-4 text-sm font-bold text-gray-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                  <ImagePlus size={17} />
                  Tải ảnh đề bài
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageChange(event.target.files?.[0])}
                    disabled={status === "loading"}
                  />
                </label>
              )}

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || (!homeworkInput.trim() && !selectedImage)}
                className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50"
              >
                {status === "loading" ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
                Gửi cho trợ lý
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Câu hỏi gợi ý</h3>
            <div className="space-y-2">
              {HOMEWORK_CHAT_SUGGESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => {
                    if (!homeworkInput.trim() && !selectedImage) {
                      setHomeworkInput(question);
                    } else {
                      askHomeworkQuestion(question);
                    }
                  }}
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export const StudentGames = () => {
  const t = useT();
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
        <h1 className="text-xl font-bold text-gray-900">
          {t("Trò chơi thực tế")} 🎮
        </h1>{" "}
        <p className="text-sm text-gray-500 mt-0.5">
          {t("Khám phá nghề nghiệp qua trò chơi thực tế")}
        </p>{" "}
      </div>{" "}
      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl p-4 flex items-center gap-4 text-white shadow-md">
        {" "}
        <span className="text-4xl">🏆</span>{" "}
        <div>
          {" "}
          <p className="text-xs text-white/80 font-semibold">
            {t("Điểm XP của bạn")}
          </p>{" "}
          <p className="text-3xl font-black">150 XP</p>{" "}
          <p className="text-xs text-white/70">
            {t("Hạng 12 trong lớp 9A")}
          </p>{" "}
        </div>{" "}
        <div className="ml-auto text-right">
          {" "}
          <p className="text-xs text-white/80">{t("Huy hiệu đạt được")}</p>{" "}
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
              {g.played ? t("Chơi lại") : t("Chơi ngay")}{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
    </div>
  );
}; // Career detail view
