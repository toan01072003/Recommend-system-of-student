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
  createSurvey,
  fetchAdviceNotes,
  fetchAppData,
  fetchMeetings,
  fetchQuestions,
  fetchSurvey,
  fetchSurveys,
  fetchStudent,
  fetchStudentRecommendation,
  type AdviceNoteRecord,
  type AdvicePriority,
  type MeetingRecord,
  type SurveyAnswerOption,
  type RecommendationResponse,
  type SurveyQuestion,
  type SurveyQuestionType,
  type SurveyRecord,
} from "../../../api/client";
import {
  hasStudentProfileDetail,
  resolveStudentProfile,
  type StudentProfileRecord,
} from "../../../logic/studentProfile";

/* ── Simple feature stubs ── */

export const CounselorFeatureStub = ({
  title,
  icon,
  color,
  items,
}: {
  title: string;
  icon: string;
  color: string;
  items: { label: string; value: string; sub?: string }[];
}) => (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">
      {icon} {title}
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={`rounded-2xl p-5 text-white shadow-sm bg-gradient-to-br ${color}`}
        >
          <p className="text-white/70 text-xs font-semibold mb-1">
            {item.label}
          </p>

          <p className="text-2xl font-black">{item.value}</p>

          {item.sub && (
            <p className="text-white/70 text-xs mt-0.5">{item.sub}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const CounselorLessons = () => {
  const lessons = [
    {
      title: "Giới thiệu hướng nghiệp lớp 9",
      class: "9A, 9B",
      assigned: 72,
      done: 58,
      status: "active",
    },

    {
      title: "Khám phá bản thân",
      class: "Tất cả",
      assigned: 128,
      done: 91,
      status: "active",
    },

    {
      title: "Ngành nghề tương lai",
      class: "9C, 9D",
      assigned: 74,
      done: 30,
      status: "draft",
    },

    {
      title: "Kỹ năng phỏng vấn cơ bản",
      class: "Lớp 10",
      assigned: 45,
      done: 45,
      status: "done",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">📖 Bài học</h1>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700">
          <Plus size={14} />
          Tạo bài học
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {lessons.map((l, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800">{l.title}</h3>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${l.status === "active" ? "bg-blue-100 text-blue-700" : l.status === "done" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
              >
                {l.status === "active"
                  ? "Đang mở"
                  : l.status === "done"
                    ? "Hoàn thành"
                    : "Nháp"}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-3">📚 Lớp: {l.class}</p>

            <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
              <span>Tiến độ hoàn thành</span>

              <span className="font-bold">
                {l.done}/{l.assigned} HS
              </span>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: `${Math.round((l.done / l.assigned) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DEFAULT_COUNSELOR_ID = "COUNSELOR001";

const formatSurveyTime = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toDateTimeLocalValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const surveyStatusLabel: Record<string, string> = {
  draft: "Nháp",
  scheduled: "Sắp mở",
  active: "Đang mở",
  closed: "Đã đóng",
};

const surveyStatusStyle: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  scheduled: "bg-amber-100 text-amber-700",
  active: "bg-emerald-100 text-emerald-700",
  closed: "bg-rose-100 text-rose-700",
};

const defaultSurveyAnswerOptions: SurveyAnswerOption[] = [
  { value: 1, label: "Rất không thích" },
  { value: 2, label: "Không thích" },
  { value: 3, label: "Phân vân" },
  { value: 4, label: "Thích" },
  { value: 5, label: "Rất thích" },
];

const questionTypeOptions: Array<{ value: SurveyQuestionType; label: string }> = [
  { value: "scale", label: "Thang điểm" },
  { value: "single_choice", label: "Trắc nghiệm 1 đáp án" },
  { value: "multiple_choice", label: "Trắc nghiệm nhiều đáp án" },
  { value: "text", label: "Tự luận" },
];

const riasecAreas = ["R", "I", "A", "S", "E", "C"];

type SurveyQuestionDraft = {
  id?: string;
  text: string;
  type: SurveyQuestionType;
  area: string;
  options: SurveyAnswerOption[];
};

const questionTypeLabel = (type: string) =>
  questionTypeOptions.find((item) => item.value === type)?.label || "Thang điểm";

const normalizeQuestionType = (type?: string): SurveyQuestionType => {
  if (type === "single_choice" || type === "multiple_choice" || type === "text") return type;
  return "scale";
};

const normalizeOptionValue = (value: string | number) => {
  if (typeof value === "number") return value;
  const trimmed = value.trim();
  if (trimmed !== "" && Number.isFinite(Number(trimmed))) return Number(trimmed);
  return trimmed;
};

const normalizeQuestionOptions = (options?: SurveyAnswerOption[]) =>
  (options ?? [])
    .map((option) => ({
      value: normalizeOptionValue(option.value),
      label: String(option.label || "").trim(),
    }))
    .filter((option) => option.label);

const defaultChoiceOptions = (): SurveyAnswerOption[] => [
  { value: 1, label: "Lựa chọn 1" },
  { value: 2, label: "Lựa chọn 2" },
];

const ensureQuestionOptions = (
  type: SurveyQuestionType,
  options?: SurveyAnswerOption[],
) => {
  if (type === "text") return [];
  const normalized = normalizeQuestionOptions(options);
  if (normalized.length > 0) return normalized;
  return type === "scale" ? defaultSurveyAnswerOptions : defaultChoiceOptions();
};

const createQuestionDraft = (question?: SurveyQuestion): SurveyQuestionDraft => {
  const type = normalizeQuestionType(question?.type);
  return {
    id: question?.id,
    text: question?.text ?? "",
    type,
    area: question?.area || "R",
    options: ensureQuestionOptions(type, question?.options),
  };
};

const toRiasecArea = (value?: string) => {
  const text = String(value || "").trim().toUpperCase();
  const first = text.slice(0, 1);
  return riasecAreas.includes(first) ? first : "R";
};

const formatSurveyAnswerValue = (
  question: SurveyQuestion | undefined,
  fallbackOptions: SurveyAnswerOption[],
  value: unknown,
) => {
  const options = question?.options?.length ? question.options : fallbackOptions;
  const labelFor = (item: unknown) => {
    const option = options.find((candidate) => String(candidate.value) === String(item));
    return option?.label || String(item);
  };
  if (Array.isArray(value)) return value.map(labelFor).join(", ");
  return labelFor(value);
};

export const CounselorSurveys = () => {
  const { studentsInClass: students } = useAppData();
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyRecord | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null);
  const [mode, setMode] = useState<"list" | "create" | "detail">("list");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "error">("loading");
  const [notice, setNotice] = useState("");
  const [title, setTitle] = useState("Khảo sát sở thích nghề nghiệp");
  const [description, setDescription] = useState("");
  const [openAt, setOpenAt] = useState(toDateTimeLocalValue(new Date()));
  const [closeAt, setCloseAt] = useState(
    toDateTimeLocalValue(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  );
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionDraft, setQuestionDraft] = useState<SurveyQuestionDraft>(createQuestionDraft());
  const [accessMode, setAccessMode] = useState<"class" | "grade" | "student">("class");
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["9A"]);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const classOptions = Array.from(new Set(students.map((student) => student.className))).sort();
  const gradeOptions = Array.from(new Set(students.map((student) => Number(student.grade)))).sort((a, b) => a - b);
  const selectedResult = selectedSurvey?.results?.find((result) => result.id === selectedResultId) ?? null;
  const questionById = new globalThis.Map(
    (selectedSurvey?.questions ?? []).map((question) => [String(question.id), question]),
  );

  const loadSurveys = () => {
    setStatus("loading");
    fetchSurveys({ role: "counselor", counselorId: DEFAULT_COUNSELOR_ID })
      .then((payload) => {
        setSurveys(payload.surveys);
        setStatus("idle");
      })
      .catch((error) => {
        setNotice(error.message || "Không tải được danh sách khảo sát.");
        setStatus("error");
      });
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const openSurveyDetail = (surveyId: number) => {
    setStatus("loading");
    fetchSurvey(surveyId)
      .then((payload) => {
        setSelectedSurvey(payload.survey);
        setSelectedResultId(null);
        setMode("detail");
        setStatus("idle");
      })
      .catch((error) => {
        setNotice(error.message || "Không tải được chi tiết khảo sát.");
        setStatus("error");
      });
  };

  const toggle = <T,>(items: T[], value: T) =>
    items.includes(value)
      ? items.filter((item) => item !== value)
      : [...items, value];

  const openQuestionModal = (question?: SurveyQuestion) => {
    setEditingQuestionId(question?.id ?? null);
    setQuestionDraft(createQuestionDraft(question));
    setQuestionModalOpen(true);
    setNotice("");
  };

  const updateQuestionType = (type: SurveyQuestionType) => {
    setQuestionDraft((current) => ({
      ...current,
      type,
      options: ensureQuestionOptions(type, current.options),
    }));
  };

  const updateQuestionOption = (
    index: number,
    field: keyof SurveyAnswerOption,
    value: string,
  ) => {
    setQuestionDraft((current) => ({
      ...current,
      options: current.options.map((option, optionIndex) =>
        optionIndex === index
          ? field === "value"
            ? { ...option, value: normalizeOptionValue(value) }
            : { ...option, label: value }
          : option,
      ),
    }));
  };

  const addQuestionOption = () => {
    setQuestionDraft((current) => ({
      ...current,
      options: [
        ...current.options,
        {
          value: current.options.length + 1,
          label: `Lựa chọn ${current.options.length + 1}`,
        },
      ],
    }));
  };

  const removeQuestionOption = (index: number) => {
    setQuestionDraft((current) => ({
      ...current,
      options: current.options.filter((_option, optionIndex) => optionIndex !== index),
    }));
  };

  const saveQuestionDraft = () => {
    const text = questionDraft.text.trim();
    if (!text) {
      setNotice("Vui lòng nhập nội dung câu hỏi.");
      return;
    }

    const type = questionDraft.type;
    const options =
      type === "scale" && normalizeQuestionOptions(questionDraft.options).length === 0
        ? defaultSurveyAnswerOptions
        : normalizeQuestionOptions(questionDraft.options);
    if (type !== "text" && options.length < 2) {
      setNotice("Vui lòng nhập ít nhất 2 câu trả lời cho câu hỏi này.");
      return;
    }

    const question: SurveyQuestion = {
      id: editingQuestionId || `question-${Date.now()}`,
      text,
      type,
      area: questionDraft.area,
      options: type === "text" ? [] : options,
    };

    setQuestions((items) =>
      editingQuestionId
        ? items.map((item) => (item.id === editingQuestionId ? question : item))
        : [...items, question],
    );
    setQuestionModalOpen(false);
    setEditingQuestionId(null);
    setQuestionDraft(createQuestionDraft());
    setNotice("");
  };

  const normalizeImportKey = (key: string) =>
    key
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

  const parseImportedType = (value: unknown): SurveyQuestionType => {
    const text = normalizeImportKey(String(value || "scale"));
    if (text.includes("multiple") || text.includes("nhieu") || text.includes("checkbox")) {
      return "multiple_choice";
    }
    if (text.includes("single") || text.includes("trac_nghiem") || text.includes("mot")) {
      return "single_choice";
    }
    if (text.includes("text") || text.includes("tu_luan") || text.includes("essay")) {
      return "text";
    }
    return "scale";
  };

  const parseImportedQuestions = (rows: Record<string, unknown>[]) => {
    const errors: string[] = [];
    const imported = rows
      .map((row, index) => {
        const normalizedRow = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [normalizeImportKey(key), value]),
        );
        const cell = (...keys: string[]) =>
          keys
            .map((key) => normalizedRow[normalizeImportKey(key)])
            .find((value) => String(value ?? "").trim() !== "");

        const text = String(cell("question", "text", "cau_hoi") || "").trim();
        if (!text) {
          errors.push(`Dòng ${index + 2}: thiếu question.`);
          return null;
        }

        const type = parseImportedType(cell("type", "loai"));
        const options: SurveyAnswerOption[] = [];
        for (let optionIndex = 1; optionIndex <= 20; optionIndex += 1) {
          const label = String(
            cell(
              `option${optionIndex}_label`,
              `answer${optionIndex}_label`,
              `option${optionIndex}`,
              `answer${optionIndex}`,
            ) || "",
          ).trim();
          if (!label) continue;
          const rawValue = cell(`option${optionIndex}_value`, `answer${optionIndex}_value`);
          options.push({
            value: normalizeOptionValue(
              rawValue === undefined || rawValue === null || String(rawValue).trim() === ""
                ? optionIndex
                : String(rawValue),
            ),
            label,
          });
        }

        const finalOptions =
          type === "text"
            ? []
            : type === "scale" && options.length === 0
              ? defaultSurveyAnswerOptions
              : normalizeQuestionOptions(options);
        if ((type === "single_choice" || type === "multiple_choice") && finalOptions.length < 2) {
          errors.push(`Dòng ${index + 2}: câu trắc nghiệm cần ít nhất 2 đáp án.`);
          return null;
        }

        return {
          id: `import-${Date.now()}-${index}`,
          text,
          type,
          area: toRiasecArea(String(cell("area", "dimension", "nhom") || "")),
          options: finalOptions,
        } as SurveyQuestion;
      })
      .filter((question): question is SurveyQuestion => Boolean(question));

    if (errors.length > 0) {
      setNotice(`Không import được: ${errors.slice(0, 3).join(" ")}`);
      return;
    }
    if (imported.length === 0) {
      setNotice("File import không có câu hỏi hợp lệ.");
      return;
    }
    setQuestions(imported);
    setNotice(`Đã import ${imported.length} câu hỏi.`);
  };

  const importQuestionFile = (file?: File) => {
    if (!file) return;
    file
      .arrayBuffer()
      .then(async (buffer) => {
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        if (!firstSheet) {
          setNotice("File import không có sheet dữ liệu.");
          return;
        }
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
          workbook.Sheets[firstSheet],
          { defval: "" },
        );
        parseImportedQuestions(rows);
      })
      .catch((error) => setNotice(error.message || "Không đọc được file import."));
  };

  const useOnetQuestions = () => {
    fetchQuestions()
      .then((payload) => {
        const imported = (payload.questions ?? []).map((question) => ({
          id: `onet-${question.id}`,
          text: question.text,
          area: toRiasecArea(question.area),
          type: "scale" as const,
          options: defaultSurveyAnswerOptions,
        }));
        if (imported.length > 0) setQuestions(imported);
      })
      .catch((error) => setNotice(error.message || "Không tải được bộ câu hỏi O*NET."));
  };

  const saveSurvey = () => {
    if (!title.trim()) {
      setNotice("Vui lòng nhập tên khảo sát.");
      return;
    }
    if (questions.length === 0) {
      setNotice("Vui lòng thêm ít nhất một câu hỏi.");
      return;
    }
    const normalizedQuestions = questions.map((question) => {
      const type = normalizeQuestionType(question.type);
      const options = type === "text" ? [] : ensureQuestionOptions(type, question.options);
      return { ...question, type, options };
    });
    const invalidQuestion = normalizedQuestions.find(
      (question) => question.type !== "text" && (question.options?.length ?? 0) < 2,
    );
    if (invalidQuestion) {
      setNotice(`Câu "${invalidQuestion.text}" cần ít nhất 2 câu trả lời.`);
      return;
    }
    const payload = {
      counselorId: DEFAULT_COUNSELOR_ID,
      title: title.trim(),
      description: description.trim(),
      openAt: new Date(openAt).toISOString(),
      closeAt: new Date(closeAt).toISOString(),
      questions: normalizedQuestions,
      answerOptions: defaultSurveyAnswerOptions,
      classNames: accessMode === "class" ? selectedClasses : [],
      grades: accessMode === "grade" ? selectedGrades : [],
      studentIds: accessMode === "student" ? selectedStudents : [],
    };
    if (
      payload.classNames.length === 0 &&
      payload.grades.length === 0 &&
      payload.studentIds.length === 0
    ) {
      setNotice("Vui lòng chọn học sinh, lớp hoặc khối được làm khảo sát.");
      return;
    }
    if (!window.confirm("Xác nhận tạo khảo sát này?")) return;

    setStatus("saving");
    createSurvey(payload)
      .then((response) => {
        setSurveys((items) => [response.survey, ...items]);
        setSelectedSurvey(response.survey);
        setMode("detail");
        setNotice("Đã tạo khảo sát và giao cho học sinh.");
        setStatus("idle");
      })
      .catch((error) => {
        setNotice(error.message || "Không tạo được khảo sát.");
        setStatus("error");
      });
  };

  const renderAccessSelector = () => (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[
          ["class", "Theo lớp"],
          ["grade", "Theo khối"],
          ["student", "Từng học sinh"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setAccessMode(id as "class" | "grade" | "student")}
            className={`px-3 py-2 rounded-lg text-xs font-bold border ${
              accessMode === id
                ? "border-pink-300 bg-pink-50 text-pink-700"
                : "border-gray-200 text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {accessMode === "class" && (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {classOptions.map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClasses((items) => toggle(items, className))}
              className={`py-2 rounded-lg text-xs font-bold border ${
                selectedClasses.includes(className)
                  ? "border-pink-300 bg-pink-50 text-pink-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {className}
            </button>
          ))}
        </div>
      )}

      {accessMode === "grade" && (
        <div className="flex flex-wrap gap-2">
          {gradeOptions.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrades((items) => toggle(items, grade))}
              className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                selectedGrades.includes(grade)
                  ? "border-pink-300 bg-pink-50 text-pink-700"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              Khối {grade}
            </button>
          ))}
        </div>
      )}

      {accessMode === "student" && (
        <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-100">
          {students.map((student) => (
            <label
              key={student.id}
              className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.id)}
                onChange={() => setSelectedStudents((items) => toggle(items, student.id))}
              />
              <span className="font-semibold text-gray-800">{student.name}</span>
              <span className="ml-auto text-xs text-gray-500">{student.className}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  if (mode === "create") {
    return (
      <div className="space-y-5">
        <button
          onClick={() => setMode("list")}
          className="flex items-center gap-1.5 text-sm font-semibold text-pink-600"
        >
          <ArrowRight size={14} className="rotate-180" />
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tạo khảo sát</h1>
            <p className="text-sm text-gray-500 mt-1">
              Thiết lập thông tin, thời gian, câu hỏi và học sinh được làm bài.
            </p>
          </div>

          {notice && <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">{notice}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-gray-600">Tên khảo sát</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-gray-600">Mô tả</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-gray-600">Thời gian mở</span>
              <input
                type="datetime-local"
                value={openAt}
                onChange={(event) => setOpenAt(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-bold text-gray-600">Thời gian đóng</span>
              <input
                type="datetime-local"
                value={closeAt}
                onChange={(event) => setCloseAt(event.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-bold text-gray-900">Danh sách câu hỏi</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => openQuestionModal()} className="px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center gap-1.5">
                  <Plus size={14} />
                  Tạo câu hỏi
                </button>
                <button onClick={useOnetQuestions} className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700">
                  Load O*NET+
                </button>
                <label className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 cursor-pointer">
                  Import Excel/CSV
                  <input
                    type="file"
                    accept=".csv,text/csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(event) => {
                      importQuestionFile(event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-200 p-5 text-sm text-gray-500">
                Chưa có câu hỏi nào. Chọn Load O*NET+ hoặc tạo câu hỏi mới để bắt đầu.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-100">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-3 text-sm">
                    <div className="flex flex-wrap items-start gap-3">
                      <span className="font-mono text-xs text-gray-400 w-8">{index + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-1.5">
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                            {questionTypeLabel(question.type)}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-pink-50 text-xs font-bold text-pink-700">
                            {question.area || "-"}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-900">{question.text}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {question.type === "text" ? (
                            <span className="text-xs font-semibold text-gray-500">Tự luận</span>
                          ) : (
                            (question.options ?? []).map((option) => (
                              <span key={`${question.id}-${option.value}`} className="px-2 py-1 rounded bg-gray-50 text-xs text-gray-600">
                                {String(option.value)}. {option.label}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openQuestionModal(question)}
                          className="text-xs font-bold text-pink-700"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setQuestions((items) => items.filter((item) => item.id !== question.id))}
                          className="text-xs font-bold text-rose-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {questionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white border border-gray-100 shadow-xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {editingQuestionId ? "Sửa câu hỏi" : "Tạo câu hỏi"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Thiết lập nội dung, loại câu hỏi và đáp án.</p>
                  </div>
                  <button
                    onClick={() => setQuestionModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600"
                  >
                    Đóng
                  </button>
                </div>

                <label className="space-y-1.5 block">
                  <span className="text-xs font-bold text-gray-600">Câu hỏi</span>
                  <textarea
                    value={questionDraft.text}
                    onChange={(event) =>
                      setQuestionDraft((current) => ({ ...current, text: event.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-600">Loại câu hỏi</span>
                    <select
                      value={questionDraft.type}
                      onChange={(event) => updateQuestionType(event.target.value as SurveyQuestionType)}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      {questionTypeOptions.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold text-gray-600">Nhóm</span>
                    <select
                      value={questionDraft.area}
                      onChange={(event) =>
                        setQuestionDraft((current) => ({ ...current, area: event.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    >
                      {riasecAreas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </label>
                </div>

                {questionDraft.type !== "text" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-gray-900">Câu trả lời</h3>
                      <button
                        onClick={addQuestionOption}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700"
                      >
                        Thêm đáp án
                      </button>
                    </div>
                    <div className="space-y-2">
                      {questionDraft.options.map((option, index) => (
                        <div key={index} className="grid grid-cols-[90px_1fr_auto] gap-2">
                          <input
                            value={option.value}
                            onChange={(event) => updateQuestionOption(index, "value", event.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            aria-label={`Giá trị đáp án ${index + 1}`}
                          />
                          <input
                            value={option.label}
                            onChange={(event) => updateQuestionOption(index, "label", event.target.value)}
                            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
                            aria-label={`Nhãn đáp án ${index + 1}`}
                          />
                          <button
                            onClick={() => removeQuestionOption(index)}
                            disabled={questionDraft.options.length <= 2}
                            className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-bold text-rose-600 disabled:opacity-40"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setQuestionModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={saveQuestionDraft}
                    className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-bold"
                  >
                    Lưu câu hỏi
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-100 p-4">
            <h2 className="font-bold text-gray-900 mb-3">Access</h2>
            {renderAccessSelector()}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setMode("list")} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700">
              Hủy
            </button>
            <button
              onClick={saveSurvey}
              disabled={status === "saving"}
              className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-bold disabled:opacity-60"
            >
              {status === "saving" ? "Đang lưu" : "Save và xác nhận"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "detail" && selectedSurvey) {
    return (
      <div className="space-y-5">
        <button
          onClick={() => {
            setSelectedSurvey(null);
            setSelectedResultId(null);
            setMode("list");
            loadSurveys();
          }}
          className="flex items-center gap-1.5 text-sm font-semibold text-pink-600"
        >
          <ArrowRight size={14} className="rotate-180" />
          Quay lại danh sách
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedSurvey.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{selectedSurvey.description || "Không có mô tả"}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${surveyStatusStyle[selectedSurvey.status]}`}>
              {surveyStatusLabel[selectedSurvey.status]}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-sm">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Mở</p>
              <p className="font-semibold text-gray-900">{formatSurveyTime(selectedSurvey.openAt)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Đóng</p>
              <p className="font-semibold text-gray-900">{formatSurveyTime(selectedSurvey.closeAt)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Học sinh</p>
              <p className="font-semibold text-gray-900">{selectedSurvey.assignedCount}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Câu hỏi</p>
              <p className="font-semibold text-gray-900">{selectedSurvey.questions.length}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-gray-600 mb-1.5">
              <span>Tiến trình làm bài</span>
              <span className="font-bold">{selectedSurvey.submittedCount}/{selectedSurvey.assignedCount}</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2.5 rounded-full bg-pink-500" style={{ width: `${selectedSurvey.progressPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Danh sách học sinh làm khảo sát</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="text-left px-4 py-3">Học sinh</th>
                    <th className="text-left px-4 py-3">Lớp</th>
                    <th className="text-left px-4 py-3">Kết quả</th>
                    <th className="text-left px-4 py-3">Thời gian làm</th>
                    <th className="text-right px-4 py-3">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(selectedSurvey.assignees ?? []).map((student) => {
                    const result = selectedSurvey.results?.find((item) => item.studentId === student.studentId);
                    return (
                      <tr key={student.studentId}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{student.studentName}</td>
                        <td className="px-4 py-3 text-gray-600">{student.className}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {student.result?.summary || (student.status === "completed" ? "Đã làm" : "Chưa làm")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{student.submittedAt ? formatSurveyTime(student.submittedAt) : "-"}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            disabled={!result}
                            onClick={() => result && setSelectedResultId(result.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-50 text-pink-700 disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            Xem bài
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h2 className="font-bold text-gray-900 mb-3">Chi tiết bài làm</h2>
            {!selectedResult ? (
              <p className="text-sm text-gray-500">Chọn một học sinh đã hoàn thành để xem danh sách câu trả lời.</p>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-pink-50 p-3">
                  <p className="text-sm font-bold text-pink-800">{selectedResult.studentName}</p>
                  <p className="text-xs text-pink-700 mt-1">
                    {selectedResult.result.summary || "Đã hoàn thành"} · {formatSurveyTime(selectedResult.submittedAt)}
                  </p>
                </div>
                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {selectedResult.answers.map((answer, index) => {
                    const question = questionById.get(String(answer.questionId));
                    return (
                      <div key={`${answer.questionId}-${index}`} className="rounded-lg border border-gray-100 p-3">
                        <p className="text-xs font-bold text-gray-400 mb-1">Câu {index + 1}</p>
                        <p className="text-sm font-semibold text-gray-800">{question?.text || answer.questionId}</p>
                        <p className="text-sm text-pink-700 font-bold mt-2">
                          Trả lời: {formatSurveyAnswerValue(question, selectedSurvey.answerOptions, answer.value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Khảo sát</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý khảo sát, tiến trình và kết quả làm bài.</p>
        </div>
        <button
          onClick={() => setMode("create")}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-pink-700"
        >
          <Plus size={14} />
          Tạo khảo sát
        </button>
      </div>

      {notice && <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">{notice}</div>}

      {status === "loading" && surveys.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-500">Đang tải khảo sát...</div>
      ) : surveys.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-500">Chưa có khảo sát nào.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {surveys.map((survey) => (
            <button
              key={survey.id}
              onClick={() => openSurveyDetail(survey.id)}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm text-left hover:border-pink-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{survey.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatSurveyTime(survey.openAt)} - {formatSurveyTime(survey.closeAt)}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${surveyStatusStyle[survey.status]}`}>
                  {surveyStatusLabel[survey.status]}
                </span>
              </div>

              <div className="flex items-center justify-between mb-1.5 text-xs text-gray-600">
                <span>Tiến trình</span>
                <span className="font-bold">{survey.submittedCount}/{survey.assignedCount}</span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div className="h-2.5 rounded-full bg-pink-500" style={{ width: `${survey.progressPercent}%` }} />
              </div>
              <p className="text-xs text-gray-500">
                {survey.questions.length} câu hỏi · {survey.assignedCount} học sinh được giao
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

