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
import { updateStudent } from "../../../api/client";
import { currentStudentReferenceId } from "../../../logic/referenceActions";
import { useT } from "../../../i18n";

type PersonalInfoUpdateResponse = {
  student: {
    personalStatement?: string;
    favoriteCareer?: string;
    favoriteCareers?: string[];
    targetUniversityId?: string;
    targetUniversityName?: string;
    targetUniversityProgram?: string;
    targetUniversities?: TargetUniversitySelection[];
  };
};

type TargetUniversitySelection = {
  id: string;
  name: string;
  program?: string;
};

type PersonalStudentRecord = (typeof studentsInClass)[number] & {
  personalStatement?: string;
  favoriteCareers?: string[];
  targetUniversityId?: string;
  targetUniversityName?: string;
  targetUniversityProgram?: string;
  targetUniversities?: TargetUniversitySelection[];
};

type SearchOption = {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
  program?: string;
};

const normalizeSearchText = (value: string) =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const splitProfileList = (value?: string) =>
  String(value || "")
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const uniqueStrings = (items: string[]) =>
  Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const favoriteCareersFromStudent = (student?: PersonalStudentRecord) =>
  uniqueStrings([
    ...((student?.favoriteCareers ?? []).filter(Boolean)),
    ...(student?.favoriteCareer ? [student.favoriteCareer] : []),
  ]);

const targetUniversitiesFromStudent = (
  student?: PersonalStudentRecord,
): TargetUniversitySelection[] => {
  const direct = (student?.targetUniversities ?? []).filter(
    (item) => item?.id || item?.name,
  );
  if (direct.length > 0) return direct;
  if (!student?.targetUniversityId && !student?.targetUniversityName) return [];
  return [
    {
      id: student.targetUniversityId ?? "",
      name: student.targetUniversityName ?? "",
      program: student.targetUniversityProgram ?? "",
    },
  ].filter((item) => item.id || item.name);
};

const MultiSearchableSelect = ({
  label,
  selected,
  options,
  placeholder,
  emptyText,
  disabled,
  onAdd,
  onRemove,
}: {
  label: string;
  selected: SearchOption[];
  options: SearchOption[];
  placeholder: string;
  emptyText: string;
  disabled: boolean;
  onAdd: (option: SearchOption) => void;
  onRemove: (value: string) => void;
}) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearchText(query);
  const selectedValues = new Set(selected.map((option) => option.value));
  const availableOptions = options.filter((option) => !selectedValues.has(option.value));
  const filteredOptions = (normalizedQuery
    ? availableOptions.filter((option) =>
        normalizeSearchText(
          `${option.label} ${option.subtitle ?? ""} ${option.badge ?? ""}`,
        ).includes(normalizedQuery),
      )
    : availableOptions
  ).slice(0, 12);

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div
        className={`min-h-[46px] rounded-xl border px-2.5 py-2 ${
          disabled ? "border-gray-200 bg-gray-100" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex flex-wrap gap-1.5">
          {selected.length > 0 ? (
            selected.map((option) => (
              <span
                key={option.value}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800"
              >
                <span className="truncate">{option.label}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemove(option.value)}
                    className="rounded-full text-orange-700 hover:bg-orange-200 hover:text-orange-900"
                    aria-label={`${t("Xóa")} ${option.label}`}
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="px-1 py-1 text-sm text-gray-400">{emptyText}</span>
          )}
        </div>
        {!disabled && (
          <div className="relative mt-2">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={query}
              placeholder={placeholder}
              onFocus={() => setOpen(true)}
              onChange={(event) => {
                setOpen(true);
                setQuery(event.target.value);
              }}
              onBlur={() => window.setTimeout(() => setOpen(false), 120)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        )}
      </div>
      {!disabled && open && (
        <div className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onAdd(option);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full px-3 py-2.5 text-left transition-colors hover:bg-orange-50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-gray-800">
                    {option.label}
                  </span>
                  {option.badge && (
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.subtitle && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {option.subtitle}
                  </p>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-gray-400">
              {t("Không tìm thấy lựa chọn phù hợp")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const StudentPersonalInfo = () => {
  const t = useT();
  const [tab, setTab] = useState<"info" | "academic">("info");
  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 1]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [personalStatement, setPersonalStatement] = useState("");
  const [favoriteCareers, setFavoriteCareers] = useState<string[]>([]);
  const [targetUniversities, setTargetUniversities] = useState<
    TargetUniversitySelection[]
  >([]);
  const { studentsInClass: appStudents, updateStudentInAppData } = useAppData();
  const studentId = currentStudentReferenceId();
  const student = (
    appStudents.find((item) => item.id === studentId) ??
    studentsInClass.find((item) => item.id === studentId) ??
    appStudents[0] ??
    studentsInClass[0]
  ) as PersonalStudentRecord | undefined;
  const resolvedStudentId = student?.id ?? studentId;
  const yearData = ACADEMIC_HISTORY[selectedYear];
  const studentAverage = Number(student?.avg ?? 0);
  const studentRank =
    studentAverage >= 8
      ? "Giỏi"
      : studentAverage >= 6.5
        ? "Khá"
        : studentAverage > 0
          ? "Cần cố gắng"
          : "Chưa cập nhật";
  const achievementItems = [
    ...splitProfileList(student?.achievements),
    ...splitProfileList(student?.awards),
    ...splitProfileList(student?.certificates),
  ];
  const careerOptions = EXPLORE_CAREERS.map((career) => ({
    value: career.name,
    label: career.name,
    subtitle: career.field,
    badge: career.education,
  }));
  const selectedCareerOptions = favoriteCareers.map(
    (careerName) =>
      careerOptions.find((option) => option.value === careerName) ?? {
        value: careerName,
        label: careerName,
      },
  );
  const universityOptions = React.useMemo(() => {
    const careerUniversities = EXPLORE_CAREERS.filter((career) =>
      favoriteCareers.includes(career.name),
    ).flatMap((career) => career.universities);
    const findCareerUniversity = (uni: University) =>
      careerUniversities.find(
        (item) => item.uniId === uni.id || item.name === uni.name,
      );

    return UNIVERSITIES.map((uni) => {
      const matched = findCareerUniversity(uni);
      return {
        rank: matched ? 0 : 1,
        option: {
          value: uni.id,
          label: uni.name,
          subtitle: matched
            ? `${matched.program} · ${uni.location}`
            : `${uni.topMajor} · ${uni.location}`,
          badge: matched ? "Phù hợp ngành" : uni.type,
          program: matched?.program ?? uni.topMajor,
        } satisfies SearchOption,
      };
    })
      .sort((a, b) => a.rank - b.rank || a.option.label.localeCompare(b.option.label))
      .map((item) => item.option);
  }, [favoriteCareers]);
  const selectedUniversityOptions = targetUniversities.map((item) => {
    const value = item.id || item.name;
    return (
      universityOptions.find((option) => option.value === value) ?? {
        value,
        label: item.name || item.id,
        subtitle: item.program,
        program: item.program,
      }
    );
  });

  React.useEffect(() => {
    if (!student) return;
    setPersonalStatement(student.personalStatement ?? "");
    setFavoriteCareers(favoriteCareersFromStudent(student));
    setTargetUniversities(targetUniversitiesFromStudent(student));
    setIsEditingGoals(false);
    setSaved(false);
    setNotice("");
  }, [
    student?.id,
    student?.personalStatement,
    student?.favoriteCareer,
    (student?.favoriteCareers ?? []).join("|"),
    student?.targetUniversityId,
    student?.targetUniversityName,
    student?.targetUniversityProgram,
    (student?.targetUniversities ?? [])
      .map((item) => `${item.id}:${item.name}:${item.program ?? ""}`)
      .join("|"),
  ]);

  const markDirty = () => {
    setSaved(false);
    setNotice("");
  };

  const resetGoalDraft = () => {
    setPersonalStatement(student?.personalStatement ?? "");
    setFavoriteCareers(favoriteCareersFromStudent(student));
    setTargetUniversities(targetUniversitiesFromStudent(student));
    setSaved(false);
    setNotice("");
  };

  const beginEditGoals = () => {
    if (!window.confirm(t("Bạn có muốn chỉnh sửa mục Định hướng & Mục tiêu không?"))) {
      return;
    }
    setIsEditingGoals(true);
    setSaved(false);
    setNotice("");
  };

  const cancelEditGoals = () => {
    resetGoalDraft();
    setIsEditingGoals(false);
  };

  const handleSavePersonalInfo = () => {
    if (!window.confirm(t("Xác nhận lưu thay đổi mục Định hướng & Mục tiêu?"))) {
      return;
    }
    const primaryUniversity = targetUniversities[0];
    const payload = {
      personalStatement,
      favoriteCareers,
      favoriteCareer: favoriteCareers[0] ?? "",
      targetUniversities,
      targetUniversityId: primaryUniversity?.id ?? "",
      targetUniversityName: primaryUniversity?.name ?? "",
      targetUniversityProgram: primaryUniversity?.program ?? "",
    };

    setSaving(true);
    setNotice("");
    updateStudent<PersonalInfoUpdateResponse>(resolvedStudentId, payload)
      .then((response) => {
        const updated = response.student ?? payload;
        const updatedFavoriteCareers =
          updated.favoriteCareers ?? favoriteCareers;
        const updatedTargetUniversities =
          updated.targetUniversities ?? targetUniversities;
        const updatedPrimaryUniversity = updatedTargetUniversities[0];
        const nextUpdates = {
          personalStatement: updated.personalStatement ?? personalStatement,
          favoriteCareers: updatedFavoriteCareers,
          favoriteCareer:
            updated.favoriteCareer ?? updatedFavoriteCareers[0] ?? "",
          targetUniversities: updatedTargetUniversities,
          targetUniversityId:
            updated.targetUniversityId ?? updatedPrimaryUniversity?.id ?? "",
          targetUniversityName:
            updated.targetUniversityName ?? updatedPrimaryUniversity?.name ?? "",
          targetUniversityProgram:
            updated.targetUniversityProgram ??
            updatedPrimaryUniversity?.program ??
            "",
        };
        setPersonalStatement(nextUpdates.personalStatement);
        setFavoriteCareers(nextUpdates.favoriteCareers);
        setTargetUniversities(nextUpdates.targetUniversities);
        updateStudentInAppData(resolvedStudentId, nextUpdates);
        setIsEditingGoals(false);
        setSaved(true);
        setNotice("Đã lưu thông tin định hướng.");
      })
      .catch((error) => {
        setNotice(error.message || "Không lưu được thông tin định hướng.");
      })
      .finally(() => setSaving(false));
  };

  // GPA trend for chart
  const gpaData = YEARS.map((y) => {
    const d = ACADEMIC_HISTORY[y];
    return {
      year: y.split(" ")[0],
      hk1: parseFloat(avg(d.hk1)),
      hk2: parseFloat(avg(d.hk2)),
    };
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">
        {t("Thông tin cá nhân")} 👤
      </h1>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
        {[
          { id: "info", icon: "👤", label: "Hồ sơ cá nhân" },
          { id: "academic", icon: "📊", label: "Lịch sử điểm số" },
        ].map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id as any)}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tab === tabItem.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tabItem.icon} {t(tabItem.label)}
          </button>
        ))}
      </div>

      {/* ── Personal Info Tab ── */}
      {tab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Avatar + bio */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
              <div className="relative">
                <Avatar name={student?.name ?? resolvedStudentId} size="lg" />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-md">
                  <Lock size={11} />
                </span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-base">
                  {student?.name ?? t("Học sinh")}
                </h2>
                <p className="text-sm text-gray-500">
                  {student?.className ?? t("Chưa cập nhật lớp")} · {resolvedStudentId}
                </p>
                <p className="text-xs text-orange-600 font-semibold mt-1">
                  {t("Hồ sơ học sinh")}
                </p>
              </div>
              <div className="w-full pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "Khối", value: String(student?.grade ?? "--") },
                  { label: "ĐTB", value: studentAverage ? studentAverage.toFixed(1) : "--" },
                  { label: "Xếp loại", value: studentRank },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-sm font-black text-orange-600">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400">{t(s.label)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">
                🏆 {t("Thành tích nổi bật")}
              </h3>
              <div className="space-y-2">
                {(achievementItems.length > 0
                  ? achievementItems.slice(0, 5)
                  : [t("Chưa cập nhật thành tích nổi bật")]
                ).map((text, index) => (
                  <div
                    key={`${text}-${index}`}
                    className="flex items-start gap-2.5 text-xs text-gray-600"
                  >
                    <span className="text-base flex-shrink-0">
                      {index === 0 ? "⭐" : "🏅"}
                    </span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm border-b border-gray-100 pb-3">
                {t("Thông tin cơ bản")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Họ và tên", value: student?.name },
                  { label: "Mã học sinh", value: resolvedStudentId },
                  { label: "Giới tính", value: student?.gender },
                  { label: "Lớp hiện tại", value: student?.className },
                  { label: "Khối", value: student?.grade ? `Khối ${student.grade}` : "" },
                  { label: "Tỉnh/Thành phố", value: student?.province },
                  { label: "Dân tộc", value: student?.ethnicGroup },
                  { label: "Mức rủi ro", value: student?.risk },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                      {t(f.label)}
                    </label>
                    <div className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-700 flex items-center justify-between gap-2">
                      <span>{f.value || t("Chưa cập nhật")}</span>
                      <Lock size={13} className="text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <h3 className="font-semibold text-gray-800 text-sm">
                  {t("Định hướng & Mục tiêu")}
                </h3>
                {!isEditingGoals ? (
                  <button
                    type="button"
                    onClick={beginEditGoals}
                    className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 flex items-center justify-center"
                    title={t("Chỉnh sửa")}
                  >
                    <Edit2 size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={cancelEditGoals}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {t("Hủy")}
                  </button>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                  {t("Giới thiệu bản thân")}
                </label>
                <textarea
                  rows={3}
                  value={personalStatement}
                  placeholder={t("Viết ngắn về sở thích, mục tiêu học tập hoặc định hướng nghề nghiệp của bạn.")}
                  disabled={!isEditingGoals || saving}
                  onChange={(event) => {
                    setPersonalStatement(event.target.value);
                    markDirty();
                  }}
                  className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${
                    isEditingGoals
                      ? "bg-gray-50"
                      : "bg-gray-100 text-gray-600"
                  }`}
                />
              </div>
              <MultiSearchableSelect
                label={t("Nghề nghiệp mơ ước")}
                selected={selectedCareerOptions}
                options={careerOptions}
                placeholder={t("Tìm và thêm nghề nghiệp")}
                emptyText={t("Chưa chọn nghề nghiệp mơ ước")}
                disabled={!isEditingGoals || saving}
                onAdd={(option) => {
                  setFavoriteCareers((current) =>
                    uniqueStrings([...current, option.value]),
                  );
                  markDirty();
                }}
                onRemove={(value) => {
                  setFavoriteCareers((current) =>
                    current.filter((item) => item !== value),
                  );
                  markDirty();
                }}
              />
              <MultiSearchableSelect
                label={t("Trường ĐH mục tiêu")}
                selected={selectedUniversityOptions}
                options={universityOptions}
                placeholder={t("Tìm và thêm trường đại học")}
                emptyText={t("Chưa chọn trường đại học mục tiêu")}
                disabled={!isEditingGoals || saving}
                onAdd={(option) => {
                  setTargetUniversities((current) => [
                    ...current.filter(
                      (item) => (item.id || item.name) !== option.value,
                    ),
                    {
                      id: option.value,
                      name: option.label,
                      program: option.program ?? "",
                    },
                  ]);
                  markDirty();
                }}
                onRemove={(value) => {
                  setTargetUniversities((current) =>
                    current.filter((item) => (item.id || item.name) !== value),
                  );
                  markDirty();
                }}
              />
              {targetUniversities.some((item) => item.program) && (
                <div className="rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs text-orange-700 space-y-1">
                  {targetUniversities
                    .filter((item) => item.program)
                    .map((item) => (
                      <p key={`${item.id}-${item.name}-${item.program}`}>
                        {item.name}:{" "}
                        <span className="font-bold">{item.program}</span>
                      </p>
                    ))}
                </div>
              )}
            </div>

            {notice && (
              <div
                className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                  notice.startsWith("Không")
                    ? "border-red-100 bg-red-50 text-red-700"
                    : "border-emerald-100 bg-emerald-50 text-emerald-700"
                }`}
              >
                {t(notice)}
              </div>
            )}
            {isEditingGoals && (
              <button
                onClick={handleSavePersonalInfo}
                disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={15} /> {saving ? t("Đang lưu...") : t("Lưu thay đổi")}
              </button>
            )}
            {!isEditingGoals && saved && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {t("Đã lưu")} ✓
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Academic History Tab ── */}
      {tab === "academic" && (
        <div className="space-y-5">
          {/* GPA trend chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">
              📈 {t("Xu hướng điểm trung bình qua các năm")}
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={gpaData}>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  key="x"
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  key="y"
                  tick={{ fontSize: 11, fontFamily: "DM Mono" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[6, 10]}
                />
                <Tooltip
                  key="tip"
                  formatter={(v: number) => [v.toFixed(2), ""]}
                />
                <Line
                  key="hk1"
                  type="monotone"
                  dataKey="hk1"
                  stroke="#F97316"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#F97316", strokeWidth: 0 }}
                  name="HK1"
                />
                <Line
                  key="hk2"
                  type="monotone"
                  dataKey="hk2"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }}
                  name="HK2"
                  strokeDasharray="5 3"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-5 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-4 h-0.5 bg-orange-500 rounded" />
                {t("Học kỳ 1")}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <div
                  className="w-4 h-0.5 bg-violet-500 rounded"
                  style={{ borderTop: "2px dashed #8B5CF6" }}
                />
                {t("Học kỳ 2")}
              </div>
            </div>
          </div>

          {/* Year selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-bold text-gray-700">{t("Năm học")}:</span>
            <div className="flex gap-2 flex-wrap">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedYear === y ? "border-orange-500 bg-orange-500 text-white shadow-sm" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}
                >
                  {y.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Selected year detail */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* HK scores - left */}
            <div className="lg:col-span-3 space-y-4">
              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "ĐTB Học kỳ 1",
                    value: avg(yearData.hk1),
                    color: "from-orange-500 to-amber-400",
                  },
                  {
                    label: "ĐTB Học kỳ 2",
                    value: avg(yearData.hk2),
                    color: "from-violet-500 to-indigo-500",
                  },
                  {
                    label: "ĐTB Cả năm",
                    value: (
                      (parseFloat(avg(yearData.hk1)) +
                        parseFloat(avg(yearData.hk2))) /
                      2
                    ).toFixed(2),
                    color: "from-emerald-500 to-teal-400",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl p-4 bg-gradient-to-br ${s.color} text-white text-center shadow-sm`}
                  >
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs text-white/80 mt-0.5">{t(s.label)}</p>
                  </div>
                ))}
              </div>

              {/* Conduct & Title */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏅</span>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {t("Danh hiệu")}
                    </p>
                    <p className="text-sm font-black text-orange-600">
                      {yearData.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {t("Hạnh kiểm")}
                    </p>
                    <p className="text-sm font-black text-emerald-600">
                      {yearData.conduct}
                    </p>
                  </div>
                </div>
              </div>

              {/* HK1 scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">{t("Học kỳ 1")}</h3>
                  <span className="text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                    {t("ĐTB")} {avg(yearData.hk1)}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub, i) => (
                    <ScoreBar key={sub} score={yearData.hk1[i]} subject={sub} />
                  ))}
                </div>
              </div>

              {/* HK2 scores */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">{t("Học kỳ 2")}</h3>
                  <span className="text-xs font-black text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
                    {t("ĐTB")} {avg(yearData.hk2)}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {SUBJECTS.map((sub, i) => (
                    <ScoreBar key={sub} score={yearData.hk2[i]} subject={sub} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: comparison table */}
            <div className="lg:col-span-2 space-y-4">
              {/* Subject comparison */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm">
                    {t("So sánh HK1 vs HK2")}
                  </h3>
                </div>
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-gray-500 font-semibold">
                        {t("Môn")}
                      </th>
                      <th className="text-center px-3 py-2.5 text-orange-600 font-semibold">
                        HK1
                      </th>
                      <th className="text-center px-3 py-2.5 text-violet-600 font-semibold">
                        HK2
                      </th>
                      <th className="text-center px-3 py-2.5 text-gray-500 font-semibold">
                        ±
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SUBJECTS.map((sub, i) => {
                      const diff = yearData.hk2[i] - yearData.hk1[i];
                      return (
                        <tr key={sub} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-700">
                            {sub}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-orange-600">
                            {yearData.hk1[i].toFixed(1)}
                          </td>
                          <td className="px-3 py-2.5 text-center font-mono font-bold text-violet-600">
                            {yearData.hk2[i].toFixed(1)}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <span
                              className={`font-bold font-mono ${diff > 0 ? "text-emerald-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}
                            >
                              {diff > 0
                                ? `+${diff.toFixed(1)}`
                                : diff === 0
                                  ? "–"
                                  : diff.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Strong / weak subjects */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm">
                  {t("Phân tích môn học")}
                </h3>
                <div>
                  <p className="text-xs font-bold text-emerald-600 mb-2">
                    💪 {t("Môn mạnh")} (≥ 8.5)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter(
                      (_, i) => (yearData.hk1[i] + yearData.hk2[i]) / 2 >= 8.5,
                    ).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-600 mb-2">
                    📈 {t("Cần cải thiện")} (&lt; 7.5)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUBJECTS.filter(
                      (_, i) => (yearData.hk1[i] + yearData.hk2[i]) / 2 < 7.5,
                    ).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const StudentPortfolio = () => {
  const t = useT();
  const items = [
    {
      emoji: "🏆",
      title: "Giải Nhì Toán cấp Quận 2024",
      type: "Giải thưởng",
      date: "11/2024",
    },
    {
      emoji: "🤖",
      title: "Dự án Robot tránh vật cản — CLB Robotics",
      type: "Dự án",
      date: "03/2025",
    },
    {
      emoji: "💻",
      title: "App quản lý chi tiêu cá nhân (Python)",
      type: "Dự án cá nhân",
      date: "05/2025",
    },
    {
      emoji: "📜",
      title: "Chứng chỉ Scratch cơ bản — Code.org",
      type: "Chứng chỉ",
      date: "01/2025",
    },
  ];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          {t("Hồ sơ năng lực")} 🗂️
        </h1>
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold flex items-center gap-1.5">
          <Plus size={14} /> {t("Thêm mới")}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-orange-200 shadow-sm transition-all"
          >
            <span className="text-3xl block mb-3">{item.emoji}</span>
            <h3 className="font-bold text-gray-800 text-sm mb-1">
              {item.title}
            </h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                {t(item.type)}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {item.date}
              </span>
            </div>
          </div>
        ))}
        <button className="bg-gray-50 rounded-2xl p-5 border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-orange-500 cursor-pointer">
          <Plus size={24} />
          <span className="text-sm font-semibold">{t("Thêm mục mới")}</span>
        </button>
      </div>
    </div>
  );
};

export const StudentResume = () => {
  const t = useT();

  return (
  <div className="space-y-5 max-w-2xl mx-auto">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">{t("CV / Resume")} 📄</h1>
      <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl text-sm font-bold">
        {t("Xuất PDF")}
      </button>
    </div>
    <div className="bg-white rounded-2xl border-2 border-orange-100 shadow-sm overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-orange-400 to-amber-400" />
      <div className="p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name="Nguyễn Minh Anh" size="lg" />
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Nguyễn Minh Anh
            </h2>
            <p className="text-sm text-gray-500">
              Học sinh lớp 9A · THCS Nguyễn Du
            </p>
            <p className="text-xs text-orange-600 font-semibold mt-0.5">
              Định hướng: Kỹ thuật phần mềm
            </p>
          </div>
        </div>
        {[
          {
            title: "🎯 Mục tiêu",
            content:
              "Phát triển kỹ năng lập trình và công nghệ để trở thành kỹ sư phần mềm tại công ty công nghệ hàng đầu Việt Nam.",
          },
          {
            title: "📚 Học tập",
            content:
              "Học sinh giỏi 3 năm liên tiếp · Điểm TB: 8.5 · Giỏi Toán, Tin học, Vật lý",
          },
          {
            title: "🏆 Thành tích",
            content:
              "Giải Nhì Toán cấp Quận 2024 · Dự án Robot CLB Robotics · App Python cá nhân",
          },
          {
            title: "⚙️ Kỹ năng",
            content:
              "Lập trình Python cơ bản · Scratch · Tư duy logic · Làm việc nhóm · Tiếng Anh B1",
          },
        ].map((s) => (
          <div key={s.title} className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-1.5">
              {s.title}
            </h3>
            <p className="text-sm text-gray-600">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export const StudentApplicationResults = () => {
  const t = useT();
  const items = [
    {
      school: "THPT Chuyên Lê Hồng Phong",
      program: "Chuyên Toán - Tin",
      status: "pending",
      date: "20/07/2025",
      emoji: "🏫",
    },
    {
      school: "THPT Trần Đại Nghĩa",
      program: "Lớp thường",
      status: "accepted",
      date: "15/07/2025",
      emoji: "✅",
    },
    {
      school: "Học bổng Toán cấp Thành phố",
      program: "Đợt 1/2025",
      status: "reviewing",
      date: "30/06/2025",
      emoji: "🎓",
    },
  ];
  const statusMap: Record<string, { label: string; cls: string }> = {
    pending: { label: "Chờ kết quả", cls: "bg-amber-100 text-amber-700" },
    accepted: { label: "Đã đậu 🎉", cls: "bg-emerald-100 text-emerald-700" },
    reviewing: { label: "Đang xét duyệt", cls: "bg-blue-100 text-blue-700" },
  };
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">
        {t("Kết quả Ứng tuyển")} 🏅
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.school}
            className="bg-white rounded-2xl p-5 border-2 border-gray-100 shadow-sm flex items-start gap-4"
          >
            <span className="text-3xl flex-shrink-0">{item.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.school}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{item.program}</p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusMap[item.status].cls}`}
                >
                  {t(statusMap[item.status].label)}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {item.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentPlanGrade = () => {
  const t = useT();

  return (
  <div className="space-y-5">
    <h1 className="text-xl font-bold text-gray-900">
      {t("Kế hoạch theo Lớp")} 📅
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[
        {
          grade: "Lớp 9 (Hiện tại)",
          color: "from-orange-500 to-amber-400",
          items: [
            "Hoàn thiện hồ sơ hướng nghiệp 100%",
            "Làm đủ 4 bài test tính cách & năng lực",
            "Tham gia CLB Robotics & Tin học",
            "Ôn thi lên lớp 10 — Toán, Văn, Anh",
          ],
          active: true,
        },
        {
          grade: "Lớp 10",
          color: "from-emerald-500 to-teal-400",
          items: [
            "Chọn tổ hợp môn phù hợp (A00, A01...)",
            "Học thêm lập trình Python / C++",
            "Tham gia dự án STEM cấp trường",
            "Khám phá thêm 5–10 ngành nghề",
          ],
          active: false,
        },
        {
          grade: "Lớp 11",
          color: "from-violet-500 to-indigo-400",
          items: [
            "Thi thử ĐGNL / ĐGTD",
            "Xây dựng portfolio cá nhân",
            "Học chứng chỉ quốc tế IELTS/SAT",
            "Tham quan các trường ĐH mục tiêu",
          ],
          active: false,
        },
        {
          grade: "Lớp 12",
          color: "from-pink-500 to-rose-400",
          items: [
            "Nộp hồ sơ xét tuyển ĐH",
            "Thi THPT Quốc gia",
            "Phỏng vấn học bổng",
            "Chuẩn bị tài chính cho ĐH",
          ],
          active: false,
        },
      ].map((plan) => (
        <div
          key={plan.grade}
          className={`rounded-2xl overflow-hidden shadow-sm border-2 ${plan.active ? "border-orange-200" : "border-gray-100"}`}
        >
          <div
            className={`p-3 bg-gradient-to-r ${plan.color} text-white flex items-center justify-between`}
          >
            <span className="font-bold text-sm">{plan.grade}</span>
            {plan.active && (
              <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full font-bold">
                {t("Đang thực hiện")}
              </span>
            )}
          </div>
          <div className="bg-white p-4">
            <ul className="space-y-2">
              {plan.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${plan.active ? "bg-orange-400" : "bg-gray-300"}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export const StudentPlanPathways = () => {
  const t = useT();
  const pathways = [
    {
      emoji: "💻",
      title: "Con đường Kỹ thuật phần mềm",
      match: 92,
      steps: [
        "Lớp 9: Học Scratch, Python cơ bản",
        "Lớp 10–11: C++, Web, App",
        "Lớp 12: Portfolio + thi ĐH CNTT",
        "ĐH: Kỹ thuật phần mềm — UIT, BK HCM",
      ],
      grad: "from-violet-500 to-indigo-500",
    },
    {
      emoji: "🔬",
      title: "Con đường Khoa học dữ liệu",
      match: 81,
      steps: [
        "Lớp 9–10: Toán xác suất + Python",
        "Lớp 11: Machine Learning cơ bản",
        "Lớp 12: Dự án data thực tế",
        "ĐH: Toán tin, Khoa học máy tính",
      ],
      grad: "from-blue-500 to-cyan-400",
    },
    {
      emoji: "⚙️",
      title: "Con đường Kỹ thuật điện tử",
      match: 71,
      steps: [
        "Lớp 9–10: Điện tử cơ bản, Arduino",
        "Lớp 11: Robotics, IoT",
        "Lớp 12: Dự án kỹ thuật cấp trường",
        "ĐH: Điện tử viễn thông — BK, ĐH Bách Khoa",
      ],
      grad: "from-teal-500 to-emerald-400",
    },
  ];
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">
        {t("Lộ trình Ngành nghề")} 🗺️
      </h1>
      <p className="text-sm text-gray-500">
        {t("3 con đường nghề nghiệp phù hợp nhất với bạn, được cá nhân hoá dựa trên hồ sơ của bạn.")}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {pathways.map((p, i) => (
          <div
            key={p.title}
            className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm"
          >
            <div className={`h-2 bg-gradient-to-r ${p.grad}`} />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        ⭐ {t("Phù hợp nhất")}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mt-0.5">{p.title}</h3>
                </div>
                <span className="text-sm font-black font-mono text-gray-800">
                  {p.match}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${p.grad}`}
                  style={{ width: `${p.match}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {p.steps.map((step, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-gray-50 text-xs text-gray-600"
                  >
                    <span className="text-base flex-shrink-0">
                      {"🌱📈🚀🎓"[j]}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// University card
