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
  fetchSurveys,
  submitSurveyResult,
  type SurveyQuestion,
  type SurveyRecord,
  type SurveyResultRecord,
} from "../../../api/client";

export const StudentSurveys = () => {
  const [step, setStep] = useState<"list" | "quiz" | "detail">("list");
  const [surveys, setSurveys] = useState<SurveyRecord[]>([]);
  const [activeSurvey, setActiveSurvey] = useState<SurveyRecord | null>(null);
  const [activeResult, setActiveResult] = useState<SurveyResultRecord | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [status, setStatus] = useState<"loading" | "idle" | "saving" | "error">("loading");
  const [notice, setNotice] = useState("");
  const studentId =
    window.localStorage.getItem("studentPortalSurveyStudentId") ||
    window.localStorage.getItem("studentPortalMeetingStudentId") ||
    "STU006";

  const loadSurveys = () => {
    setStatus("loading");
    fetchSurveys({ role: "student", studentId })
      .then((payload) => {
        setSurveys(payload.surveys);
        setStatus("idle");
      })
      .catch((error) => {
        setNotice(error.message || "Không tải được khảo sát.");
        setStatus("error");
      });
  };

  useEffect(() => {
    loadSurveys();
  }, [studentId]);

  const formatTime = (value: string) => {
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

  const answerLabel = (
    survey: SurveyRecord,
    question: SurveyQuestion,
    value: string | number,
  ) => {
    const option = question.options?.find((item) =>
      typeof item === "object" ? item.value === value : item === value,
    );
    if (typeof option === "object") return option.label;
    if (typeof option === "string") return option;
    return survey.answerOptions.find((item) => item.value === value)?.label || String(value);
  };

  const startSurvey = (survey: SurveyRecord) => {
    setActiveSurvey(survey);
    setActiveResult(null);
    setAnswers({});
    setQIdx(0);
    setNotice("");
    setStep("quiz");
  };

  const openResult = (survey: SurveyRecord) => {
    setActiveSurvey(survey);
    setActiveResult(survey.studentResult ?? null);
    setStep("detail");
  };

  const submitActiveSurvey = () => {
    if (!activeSurvey) return;
    const missing = activeSurvey.questions.some(
      (question) => answers[String(question.id)] === undefined,
    );
    if (missing) {
      setNotice("Bạn cần trả lời đủ các câu hỏi trước khi nộp.");
      return;
    }
    setStatus("saving");
    submitSurveyResult(activeSurvey.id, {
      studentId,
      answers: activeSurvey.questions.map((question) => ({
        questionId: String(question.id),
        value: answers[String(question.id)],
      })),
    })
      .then((payload) => {
        const updatedSurvey = {
          ...activeSurvey,
          studentCompleted: true,
          studentResult: payload.result,
        };
        setActiveSurvey(updatedSurvey);
        setActiveResult(payload.result);
        setSurveys((items) =>
          items.map((item) => (item.id === activeSurvey.id ? updatedSurvey : item)),
        );
        setNotice("Đã nộp khảo sát.");
        setStatus("idle");
        setStep("detail");
      })
      .catch((error) => {
        setNotice(error.message || "Không nộp được khảo sát.");
        setStatus("error");
      });
  };

  if (step === "quiz" && activeSurvey) {
    const question = activeSurvey.questions[qIdx];
    const selected = answers[String(question.id)];
    const options =
      question.options && question.options.length > 0
        ? question.options.map((item) =>
            typeof item === "object" ? item : { value: item, label: item },
          )
        : activeSurvey.answerOptions;

    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <button
          onClick={() => setStep("list")}
          className="flex items-center gap-1.5 text-sm font-semibold text-pink-600"
        >
          <ArrowRight size={14} className="rotate-180" />
          Quay lại
        </button>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-bold text-pink-600">
              Câu {qIdx + 1} / {activeSurvey.questions.length}
            </span>
            <span className="text-gray-500">
              {Math.round(((qIdx + 1) / activeSurvey.questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2.5 rounded-full bg-pink-500"
              style={{ width: `${((qIdx + 1) / activeSurvey.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {notice && (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            {notice}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-lg font-bold text-gray-900">{question.text}</p>
          {question.area && (
            <p className="text-xs font-bold text-pink-700 mt-2">Nhóm: {question.area}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-5">
            {options.map((option) => (
              <button
                key={String(option.value)}
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [String(question.id)]: option.value,
                  }))
                }
                className={`px-3 py-3 rounded-lg border text-sm font-bold ${
                  selected === option.value
                    ? "border-pink-400 bg-pink-50 text-pink-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-pink-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <button
            onClick={() => setQIdx((index) => Math.max(0, index - 1))}
            disabled={qIdx === 0}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 disabled:opacity-40"
          >
            Câu trước
          </button>
          {qIdx < activeSurvey.questions.length - 1 ? (
            <button
              onClick={() => setQIdx((index) => Math.min(activeSurvey.questions.length - 1, index + 1))}
              className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-bold"
            >
              Câu tiếp
            </button>
          ) : (
            <button
              onClick={submitActiveSurvey}
              disabled={status === "saving"}
              className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-bold disabled:opacity-60"
            >
              {status === "saving" ? "Đang nộp" : "Nộp bài"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === "detail" && activeSurvey && activeResult) {
    const answersByQuestion = new globalThis.Map(
      activeResult.answers.map((answer) => [String(answer.questionId), answer.value]),
    );
    return (
      <div className="space-y-5">
        <button
          onClick={() => setStep("list")}
          className="flex items-center gap-1.5 text-sm font-semibold text-pink-600"
        >
          <ArrowRight size={14} className="rotate-180" />
          Quay lại
        </button>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-bold text-pink-700">Kết quả khảo sát</p>
          <h1 className="text-xl font-bold text-gray-900 mt-1">{activeSurvey.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hoàn thành lúc {formatTime(activeResult.submittedAt)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Số câu</p>
              <p className="text-lg font-black text-gray-900">
                {activeResult.result.answeredCount}/{activeResult.result.totalQuestions}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Điểm TB</p>
              <p className="text-lg font-black text-gray-900">
                {activeResult.result.averageScore ?? "-"}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-bold text-gray-500">Nhóm nổi bật</p>
              <p className="text-sm font-black text-gray-900">
                {activeResult.result.summary || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {activeSurvey.questions.map((question, index) => {
            const value = answersByQuestion.get(String(question.id));
            return (
              <div key={question.id} className="p-4">
                <p className="text-xs font-bold text-gray-400">Câu {index + 1}</p>
                <p className="font-semibold text-gray-900 mt-1">{question.text}</p>
                <p className="text-sm font-bold text-pink-700 mt-2">
                  Trả lời: {value !== undefined ? answerLabel(activeSurvey, question, value) : "-"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const completedCount = surveys.filter((survey) => survey.studentCompleted).length;
  const pendingSurveys = surveys.filter((survey) => !survey.studentCompleted);
  const openPendingCount = pendingSurveys.filter((survey) => survey.status === "active").length;
  const completionPct = surveys.length ? Math.round((completedCount / surveys.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Khảo sát</h1>
          <p className="text-sm text-gray-500 mt-1">
            {completedCount} / {surveys.length} khảo sát đã hoàn thành
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-2.5 rounded-full bg-pink-500" style={{ width: `${completionPct}%` }} />
          </div>
          <span className="text-sm font-black text-pink-700">{completionPct}%</span>
        </div>
      </div>

      {openPendingCount > 0 && (
        <div className="rounded-xl border border-pink-100 bg-pink-50 px-4 py-3">
          <p className="text-sm font-bold text-pink-800">
            Bạn có {openPendingCount} khảo sát mới cần hoàn thành.
          </p>
        </div>
      )}

      {notice && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
          {notice}
        </div>
      )}

      {status === "loading" && surveys.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-500">Đang tải khảo sát...</div>
      ) : surveys.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5 text-sm text-gray-500">Hiện chưa có khảo sát nào được giao.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {surveys.map((survey) => {
            const isDone = Boolean(survey.studentCompleted && survey.studentResult);
            const canStart = survey.status === "active" && !isDone;
            return (
              <div key={survey.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{survey.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(survey.openAt)} - {formatTime(survey.closeAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    isDone
                      ? "bg-emerald-100 text-emerald-700"
                      : survey.status === "active"
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-600"
                  }`}>
                    {isDone ? "Đã làm" : survey.status === "active" ? "Đang mở" : survey.status === "scheduled" ? "Sắp mở" : "Đã đóng"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  {survey.description || `${survey.questions.length} câu hỏi`}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-500">{survey.questions.length} câu hỏi</span>
                  {isDone ? (
                    <button
                      onClick={() => openResult(survey)}
                      className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold"
                    >
                      Xem kết quả
                    </button>
                  ) : (
                    <button
                      onClick={() => canStart && startSurvey(survey)}
                      disabled={!canStart}
                      className="px-3 py-2 rounded-lg bg-pink-600 text-white text-xs font-bold disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      {survey.status === "scheduled" ? "Chưa mở" : survey.status === "closed" ? "Đã đóng" : "Bắt đầu"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};