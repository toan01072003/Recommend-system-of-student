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

/* ── Student Groups ── */

type StudentGroupRow = {
  student: StudentProfileRecord;
  exploredCareer: string;
  recommendedCareer: string;
  exploredGroup?: RiasecGroupId;
  recommendedGroup?: RiasecGroupId;
  groupId?: RiasecGroupId;
  status: "ok" | "conflict" | "missing-explore" | "missing-recommend" | "missing-both";
  error?: string;
};

type RiasecGroupId = "R" | "I" | "A" | "S" | "E" | "C";

const RIASEC_GROUPS: Array<{
  id: RiasecGroupId;
  name: string;
  label: string;
  color: string;
}> = [
  {
    id: "R",
    name: "Realistic",
    label: "Thực tế / kỹ thuật",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "I",
    name: "Investigative",
    label: "Nghiên cứu / phân tích",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "A",
    name: "Artistic",
    label: "Sáng tạo / thiết kế",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "S",
    name: "Social",
    label: "Xã hội / hỗ trợ",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "E",
    name: "Enterprising",
    label: "Kinh doanh / lãnh đạo",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "C",
    name: "Conventional",
    label: "Quy trình / dữ liệu",
    color: "from-slate-500 to-gray-600",
  },
];

const CAREER_RIASEC_MAP: Record<string, RiasecGroupId> = {
  "accountant": "C",
  "agritech specialist": "R",
  "animator": "A",
  "architect": "A",
  "bank officer": "C",
  "business analyst": "E",
  "civil servant": "C",
  "content creator": "A",
  "cybersecurity analyst": "I",
  "data analyst": "I",
  "designer": "A",
  "doctor": "S",
  "economist": "I",
  "entrepreneur": "E",
  "environmental officer": "R",
  "factory operator": "R",
  "hr specialist": "S",
  "lawyer": "E",
  "logistics operator": "R",
  "market researcher": "I",
  "mechanical engineer": "R",
  "medical technologist": "I",
  "nurse": "S",
  "operations coordinator": "C",
  "pharmacist": "I",
  "police officer": "R",
  "product manager": "E",
  "programmer": "I",
  "psychologist": "S",
  "robotics engineer": "R",
  "sales manager": "E",
  "salesperson": "E",
  "scientist": "I",
  "social worker": "S",
  "software engineer": "I",
  "sports coach": "S",
  "surgeon": "S",
  "teacher": "S",
  "ux designer": "A",
};

const normalizeCareer = (career: string) => career.trim().toLowerCase();

const firstExploredCareer = (student: StudentProfileRecord) =>
  student.exploredCareers?.find(Boolean)?.trim() ||
  student.favoriteCareer?.trim() ||
  "";

const careerToRiasecGroup = (career: string): RiasecGroupId | undefined =>
  CAREER_RIASEC_MAP[normalizeCareer(career)];

const strongestRiasecDimension = (
  vector?: Record<string, number>,
): RiasecGroupId | undefined => {
  if (!vector) return undefined;

  const strongest = Object.entries(vector)
    .filter(([key]) => RIASEC_GROUPS.some((group) => group.id === key))
    .sort((a, b) => b[1] - a[1])[0]?.[0];

  return strongest as RiasecGroupId | undefined;
};

const studentGroupStatus = (
  exploredCareer: string,
  recommendedCareer: string,
  exploredGroup?: RiasecGroupId,
  recommendedGroup?: RiasecGroupId,
): StudentGroupRow["status"] => {
  if (!exploredCareer && !recommendedCareer) return "missing-both";
  if (!exploredCareer) return "missing-explore";
  if (!recommendedCareer) return "missing-recommend";
  return exploredGroup && recommendedGroup && exploredGroup === recommendedGroup
    ? "ok"
    : "conflict";
};

export const CounselorStudentGroups = ({
  navigate,
}: {
  navigate: (v: string, params?: { studentId?: string }) => void;
}) => {
  const { studentsInClass } = useAppData();
  const [groupStudents, setGroupStudents] =
    useState<StudentProfileRecord[]>(studentsInClass);
  const [selectedGroup, setSelectedGroup] = useState<RiasecGroupId | null>(
    null,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setStatus("loading");
    setError("");

    fetchAppData<{ studentsInClass?: StudentProfileRecord[] }>(
      controller.signal,
    )
      .then((payload) => {
        setGroupStudents(payload.studentsInClass ?? studentsInClass);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được student groups.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [studentsInClass]);

  const rows = groupStudents.map((student) => {
    const exploredCareer =
      student.currentExploredCareer?.trim() || firstExploredCareer(student);
    const recommendedCareer = student.latestRecommendCareer?.trim() || "";
    const exploredGroup = careerToRiasecGroup(exploredCareer);
    const recommendedGroup =
      careerToRiasecGroup(recommendedCareer) ||
      strongestRiasecDimension(student.recommendHistory?.[0]?.results?.[0]?.vector) ||
      strongestRiasecDimension(student.recommendHistory?.[0]?.studentVector);

    return {
      student,
      exploredCareer,
      recommendedCareer,
      exploredGroup,
      recommendedGroup,
      groupId: exploredGroup || recommendedGroup,
      status: studentGroupStatus(
        exploredCareer,
        recommendedCareer,
        exploredGroup,
        recommendedGroup,
      ),
    } satisfies StudentGroupRow;
  });

  const groups = RIASEC_GROUPS.map((group) => {
    const items = rows.filter((row) => row.groupId === group.id);

    return {
      ...group,
      items,
      count: items.length,
      conflicts: items.filter((item) => item.status === "conflict").length,
      warnings: items.filter((item) => item.status !== "ok").length,
    };
  });
  const selectedGroupMeta = groups.find((group) => group.id === selectedGroup);
  const selectedRows = selectedGroupMeta?.items ?? [];
  const ungroupedRows = rows.filter((row) => !row.groupId);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {selectedGroupMeta
              ? `Danh sách học sinh nhóm ${selectedGroupMeta.name}`
              : "Nhóm Học sinh theo RIASEC"}
          </h1>
        </div>

        {selectedGroupMeta ? (
          <button
            onClick={() => setSelectedGroup(null)}
            className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5"
          >
            <ArrowRight size={12} className="rotate-180" /> Quay lại 6 nhóm
          </button>
        ) : null}
      </div>

      {status === "error" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "loading" && rows.length === 0 && (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            Đang tải dữ liệu nhóm học sinh từ database...
          </p>
        </div>
      )}

      {!selectedGroupMeta && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className="bg-white rounded-2xl border border-gray-100 text-left shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`h-2 bg-gradient-to-r ${g.color}`} />

              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${g.color} flex items-center justify-center text-white flex-shrink-0`}
                  >
                    <Briefcase size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm truncate">
                      {g.id} - {g.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{g.label}</p>

                    <p className="text-2xl font-black text-gray-900">
                      {g.count}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        học sinh
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {g.conflicts > 0 && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      {g.conflicts} conflict
                    </span>
                  )}
                  {g.warnings > g.conflicts && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                      {g.warnings - g.conflicts} thiếu dữ liệu
                    </span>
                  )}
                </div>

                {g.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100">
                    {g.items.slice(0, 3).map((row) => (
                      <span
                        key={row.student.id}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {row.student.name.split(" ").pop()}
                      </span>
                    ))}

                    {g.count > 3 && (
                      <span className="text-xs text-gray-400 px-1">
                        +{g.count - 3} khác
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedGroupMeta && (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">
            Danh sách học sinh nhóm {selectedGroupMeta?.name}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Học sinh",
                  "Nghề đang explore",
                  "Nghề kq recommend",
                  "Nhóm",
                  "",
                ].map((header) => (
                  <th
                    key={header}
                    className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {selectedRows.map((row) => {
                return (
                  <tr key={row.student.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={row.student.name} size="sm" />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {row.student.name}
                          </p>
                          <p className="text-xs text-gray-400 font-mono">
                            {row.student.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {row.exploredCareer || (
                        <span className="text-gray-400">Chưa có</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <span
                        className={
                          row.status === "conflict"
                            ? "text-red-600 font-bold"
                            : ""
                        }
                      >
                        {row.recommendedCareer || (
                          <span className="text-gray-400">
                            {row.error ? "Lỗi recommend" : "Chưa có"}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">
                        {row.groupId
                          ? `${row.groupId} - ${
                              RIASEC_GROUPS.find(
                                (group) => group.id === row.groupId,
                              )?.name
                            }`
                          : "Chưa xác định"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          navigate("co-students-list", {
                            studentId: row.student.id,
                          })
                        }
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        title="Xem chi tiết học sinh"
                      >
                        <UserCheck size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {selectedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 px-4 text-center text-sm text-gray-400"
                  >
                    Chưa có học sinh trong nhóm này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {!selectedGroupMeta && ungroupedRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-amber-100 bg-amber-50">
            <h3 className="font-bold text-amber-800">
              Học sinh chưa phân được vào 6 nhóm
            </h3>
            <p className="text-xs text-amber-700 mt-0.5">
              Các học sinh này thiếu cả nghề explore và nhóm recommend hợp lệ.
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {ungroupedRows.map((row) => (
              <div
                key={row.student.id}
                className="p-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={row.student.name} size="sm" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {row.student.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      {row.student.id}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-amber-100 text-amber-700">
                  Thiếu dữ liệu phân nhóm
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

