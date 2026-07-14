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
  fetchStudentReferences,
  saveStudentReference,
  syncReferenceActions,
  updateStudent,
  type ReferenceEmotion,
} from "../../../api/client";
import {
  REFERENCE_EMOTIONS,
  actionKey,
  careerReferenceActions,
  currentStudentReferenceId,
} from "../../../logic/referenceActions";

type StudentExploreUpdateResponse = {
  student: {
    currentExploredCareer?: string;
    exploredCareers?: string[];
  };
};

const mergeCareerNames = (items: string[], careerName: string) =>
  Array.from(
    new Set(
      [...items, careerName]
        .map((item) => String(item || "").trim())
        .filter(Boolean),
    ),
  );

export const ExploreCareerDetail = ({
  career,
  onBack,
  favorites,
  onToggleFav,
  reactions,
  currentExploredCareer,
  isExplored,
  onConfirmExplore,
  confirming,
  activitySaving,
  onOpenActivityView,
  onSelectRelated,
  onNavigateToUni,
}: {
  career: ExploreCareer;
  onBack: () => void;
  favorites: string[];
  onToggleFav: () => void;
  reactions: Record<string, ReferenceEmotion>;
  currentExploredCareer?: string;
  isExplored: boolean;
  onConfirmExplore: () => void;
  confirming: boolean;
  activitySaving: boolean;
  onOpenActivityView: () => void;
  onSelectRelated: (id: string) => void;
  onNavigateToUni?: (uniId: string) => void;
}) => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const isCurrentCareer = currentExploredCareer === career.name;
  const likedActivities = Object.entries(reactions)
    .filter(([, emotion]) => emotion === "passion" || emotion === "like")
    .map(([id]) => career.activities.find((a) => actionKey(career.id, a.id) === id)?.label)
    .filter(Boolean);
  const relatedData = EXPLORE_CAREERS.filter(
    (c) =>
      c.id !== career.id &&
      career.relatedCareers.some(
        (r) =>
          c.name.includes(r.split(" ")[0]) || r.includes(c.name.split(" ")[0]),
      ),
  ).slice(0, 3);
  return (
    <div className="space-y-6">
      {" "}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors"
      >
        {" "}
        <ArrowRight size={13} className="rotate-180" /> Quay lại danh sách{" "}
      </button>{" "}
      {/* Hero image */}{" "}
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-200"
        style={{ height: 280 }}
      >
        {" "}
        <img
          src={career.coverPhoto}
          alt={career.name}
          className="w-full h-full object-cover"
        />{" "}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />{" "}
        <div className="absolute bottom-0 left-0 p-6">
          {" "}
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block ${career.fieldColor}`}
          >
            {career.field}
          </span>{" "}
          <h1 className="text-3xl font-black text-white">{career.name}</h1>{" "}
          <p className="text-white/80 text-sm mt-1">{career.desc}</p>{" "}
        </div>{" "}
        {/* Fav + Why buttons on hero */}{" "}
        <div className="absolute top-4 right-4 flex gap-2">
          {" "}
          <button
            onClick={onOpenActivityView}
            disabled={activitySaving}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-xs font-bold shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 ${
              isExplored
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-orange-500 to-pink-500"
            }`}
          >
            {" "}
            💭 {activitySaving ? "Đang lưu..." : isExplored ? "Đã khám phá - sửa lại" : "Tôi thích điều gì?"}{" "}
          </button>{" "}
          <button
            onClick={onToggleFav}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${favorites.includes(career.id) ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:text-red-500"}`}
          >
            {" "}
            <Heart
              size={16}
              fill={favorites.includes(career.id) ? "currentColor" : "none"}
            />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-sm font-bold text-gray-900">
            {isCurrentCareer ? "Đang khám phá ngành nghề này" : "Lưu ngành nghề đang khám phá"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Xác nhận để cập nhật nghề đang khám phá trong hồ sơ của bạn.
          </p>
        </div>
        <button
          onClick={onConfirmExplore}
          disabled={confirming || isCurrentCareer}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
            isCurrentCareer
              ? "bg-emerald-100 text-emerald-700"
              : "bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
          }`}
        >
          <CheckCircle size={13} />
          {isCurrentCareer
            ? "Đang khám phá"
            : confirming
              ? "Đang lưu..."
              : "Xác nhận khám phá ngành nghề này"}
        </button>
      </div>
      {/* Quick info */}{" "}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {" "}
        {[
          {
            icon: TrendingUp,
            label: "Lương tối thiểu",
            value: career.salaryMin + career.salaryNote,
            cls: "text-emerald-600",
          },
          {
            icon: TrendingUp,
            label: "Lương tối đa",
            value: career.salaryMax + career.salaryNote,
            cls: "text-emerald-700",
          },
          {
            icon: GraduationCap,
            label: "Trình độ",
            value: career.education,
            cls: "text-blue-600",
          },
          {
            icon: Star,
            label: "Triển vọng",
            value: "Rất cao 🔥",
            cls: "text-orange-600",
          },
        ].map((info) => (
          <div
            key={info.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            {" "}
            <div className="flex items-center gap-1.5 mb-1">
              {" "}
              <info.icon size={13} className={info.cls} />{" "}
              <span className="text-xs text-gray-500 font-medium">
                {info.label}
              </span>{" "}
            </div>{" "}
            <p className={`text-sm font-bold ${info.cls}`}>{info.value}</p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {" "}
        {/* Left column */}{" "}
        <div className="lg:col-span-2 space-y-5">
          {" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-2">
              📋 Mô tả công việc
            </h3>{" "}
            <p className="text-sm text-gray-600 leading-relaxed">
              {career.fullDesc}
            </p>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3">
              📷 Hình ảnh thực tế
            </h3>{" "}
            <div className="grid grid-cols-3 gap-2">
              {" "}
              {career.gallery.map((url, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden bg-gray-100 aspect-video"
                >
                  {" "}
                  <img
                    src={url}
                    alt={`${career.name} ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3">
              🎬 Video giới thiệu nghề nghiệp
            </h3>{" "}
            <div
              className="relative rounded-xl overflow-hidden cursor-pointer bg-gray-900"
              style={{ aspectRatio: "16/9" }}
              onClick={() => setVideoPlaying(true)}
            >
              {" "}
              <img
                src={career.videoThumb}
                alt="Video thumbnail"
                className={`w-full h-full object-cover transition-opacity duration-300 ${videoPlaying ? "opacity-40" : "opacity-90"}`}
              />{" "}
              {!videoPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {" "}
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                    {" "}
                    <div
                      className="w-0 h-0 ml-1"
                      style={{
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        borderLeft: "18px solid #EA580C",
                      }}
                    />{" "}
                  </div>{" "}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                  {" "}
                  <div>
                    <p className="text-4xl mb-2">▶</p>
                    <p className="text-sm font-semibold opacity-80">
                      Video đang phát...
                    </p>
                  </div>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3">
              ⚡ Kỹ năng cần có
            </h3>{" "}
            <div className="flex flex-wrap gap-2">
              {" "}
              {career.skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold"
                >
                  {s}
                </span>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          {/* Universities section */}{" "}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {" "}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              {" "}
              <h3 className="font-bold text-gray-800">
                🎓 Trường đào tạo ngành này
              </h3>{" "}
              <span className="text-xs text-gray-400 font-medium">
                {career.universities.length} trường
              </span>{" "}
            </div>{" "}
            <div className="divide-y divide-gray-50">
              {" "}
              {career.universities.map((u, i) => {
                const canNav = !!u.uniId && !!onNavigateToUni;
                return (
                  <div
                    key={i}
                    onClick={() => canNav && onNavigateToUni!(u.uniId!)}
                    className={`flex items-center gap-4 px-5 py-3.5 transition-colors group ${canNav ? "cursor-pointer hover:bg-blue-50" : "hover:bg-orange-50/40"}`}
                  >
                    {" "}
                    <span className="text-xs font-black font-mono text-gray-300 w-5 flex-shrink-0">
                      {i + 1}
                    </span>{" "}
                    <div className="w-11 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {" "}
                      <img
                        src={u.photo}
                        alt={u.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />{" "}
                    </div>{" "}
                    <div className="flex-1 min-w-0">
                      {" "}
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {" "}
                        <span
                          className={`text-xs font-black font-mono ${canNav ? "text-blue-700 group-hover:underline" : "text-gray-700"}`}
                        >
                          {u.shortName}
                        </span>{" "}
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${u.type === "Công lập" ? "bg-blue-100 text-blue-700" : u.type === "Tư thục" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}
                        >
                          {" "}
                          {u.type}{" "}
                        </span>{" "}
                        {canNav && (
                          <span className="text-xs text-blue-500 font-medium hidden group-hover:inline">
                            · Xem trường →
                          </span>
                        )}{" "}
                      </div>{" "}
                      <p className="text-xs text-gray-500 truncate">
                        {u.program}
                      </p>{" "}
                    </div>{" "}
                    <div className="text-right flex-shrink-0">
                      {" "}
                      <div className="text-sm font-black text-emerald-700">
                        {u.score}
                      </div>{" "}
                      <div className="text-xs text-gray-400 font-mono">
                        {u.combination}
                      </div>{" "}
                    </div>{" "}
                    {canNav && (
                      <ChevronRight
                        size={14}
                        className="text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors"
                      />
                    )}{" "}
                  </div>
                );
              })}{" "}
            </div>{" "}
            <div className="px-5 py-3 bg-amber-50 border-t border-amber-100">
              {" "}
              <p className="text-xs text-amber-700 font-medium">
                📌 Điểm chuẩn năm 2024 — chỉ mang tính tham khảo, có thể thay
                đổi theo năm.
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right column */}{" "}
        <div className="space-y-4">
          {" "}
          <div
            className={`bg-white rounded-2xl border-2 shadow-sm p-4 ${
              isExplored ? "border-emerald-200" : "border-orange-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  isExplored
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                💭
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 text-sm">
                  {isExplored ? "Đã khám phá nghề này" : "Tôi thích điều gì?"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Mở view riêng để chọn cảm xúc cho {career.activities.length} hoạt động của nghề này.
                </p>
                <button
                  onClick={onOpenActivityView}
                  disabled={activitySaving}
                  className={`mt-3 w-full px-3 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                    isExplored
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {activitySaving ? "Đang lưu..." : isExplored ? "Đã khám phá - sửa lại" : "Mở danh sách hoạt động"} <ChevronRight size={13} />
                </button>
              </div>
            </div>
            {likedActivities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-orange-100">
                <p className="text-xs font-bold text-amber-800 mb-1.5">
                  Đã lưu vào sở thích:
                </p>
                <div className="flex flex-wrap gap-1">
                  {likedActivities.slice(0, 4).map((activity) => (
                    <span
                      key={activity}
                      className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium"
                    >
                      {activity?.split(" ").slice(0, 3).join(" ")}...
                    </span>
                  ))}
                  {likedActivities.length > 4 && (
                    <span className="text-xs text-amber-700 font-semibold">
                      +{likedActivities.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Related careers — small cards with image + name + salary */}{" "}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              🔗 Nghề nghiệp liên quan
            </h3>{" "}
            <div className="space-y-2">
              {" "}
              {relatedData.length > 0
                ? relatedData.map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => onSelectRelated(rel.id)}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-orange-50 transition-colors group text-left"
                    >
                      {" "}
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {" "}
                        <img
                          src={rel.coverPhoto}
                          alt={rel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />{" "}
                      </div>{" "}
                      <div className="flex-1 min-w-0">
                        {" "}
                        <p className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-700 transition-colors">
                          {rel.name}
                        </p>{" "}
                        <p className="text-xs text-emerald-600 font-semibold">
                          {rel.salaryMin}–{rel.salaryMax}
                          {rel.salaryNote}
                        </p>{" "}
                      </div>{" "}
                      <ChevronRight
                        size={13}
                        className="text-gray-300 group-hover:text-orange-400 flex-shrink-0"
                      />{" "}
                    </button>
                  ))
                : career.relatedCareers.slice(0, 4).map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {" "}
                      <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                        {" "}
                        <Briefcase size={12} className="text-orange-600" />{" "}
                      </div>{" "}
                      <span className="text-xs font-medium text-gray-700 hover:text-orange-700">
                        {name}
                      </span>{" "}
                    </div>
                  ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export const CareerActivityEmotionModal = ({
  career,
  reactions,
  saving,
  onClose,
  onSave,
}: {
  career: ExploreCareer;
  reactions: Record<string, ReferenceEmotion>;
  saving: boolean;
  onClose: () => void;
  onSave: (draft: Record<string, ReferenceEmotion>) => void;
}) => {
  const [draft, setDraft] = useState<Record<string, ReferenceEmotion>>(() => {
    const next: Record<string, ReferenceEmotion> = {};
    career.activities.forEach((activity) => {
      const key = actionKey(career.id, activity.id);
      if (reactions[key]) next[key] = reactions[key];
    });
    return next;
  });
  const selectedCount = Object.keys(draft).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="relative h-36 flex-shrink-0 overflow-hidden">
          <img
            src={career.coverPhoto}
            alt={career.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/25" />
          <div className="absolute inset-0 p-6 flex items-end justify-between gap-4">
            <div className="text-white">
              <p className="text-xs font-bold uppercase tracking-wide text-white/70">
                Tôi thích điều gì?
              </p>
              <h2 className="text-2xl font-black mt-1">{career.name}</h2>
              <p className="text-sm text-white/80 mt-1">
                Chọn cảm xúc cho các hoạt động riêng của ngành nghề này.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center disabled:opacity-50"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-bold text-gray-900">
              {selectedCount}/{career.activities.length} hoạt động đã chọn cảm xúc
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Chỉ những lựa chọn trong view này được lưu khi bấm Save.
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {REFERENCE_EMOTIONS.map((emotion) => (
              <span
                key={emotion.value}
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${emotion.color}`}
              >
                {emotion.icon} {emotion.label}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {career.activities.map((activity, index) => {
              const key = actionKey(career.id, activity.id);
              const selectedEmotion = draft[key];

              return (
                <div
                  key={activity.id}
                  className={`rounded-2xl border-2 p-4 transition-all ${
                    selectedEmotion
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-500 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                        {activity.label}
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {REFERENCE_EMOTIONS.map((emotion) => (
                          <button
                            key={emotion.value}
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                [key]: emotion.value,
                              }))
                            }
                            title={emotion.label}
                            className={`px-2.5 py-2 rounded-xl border text-sm font-bold transition-all hover:-translate-y-0.5 ${
                              selectedEmotion === emotion.value
                                ? `${emotion.color} ring-2 ring-orange-300`
                                : "bg-white border-gray-200 text-gray-500 hover:border-orange-300"
                            }`}
                          >
                            <span className="mr-1">{emotion.icon}</span>
                            {emotion.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          <p className="text-xs text-gray-500">
            Save sẽ cập nhật References và đặt nghề này thành nghề đang khám phá.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-bold hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(draft)}
              disabled={saving || selectedCount === 0}
              className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save size={13} />
              {saving ? "Đang lưu..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Career card (grid tile)
export const ExploreCareerCard = ({
  career,
  onSelect,
  isFav,
  isCurrent,
  isExplored,
  onToggleFav,
}: {
  career: ExploreCareer;
  onSelect: () => void;
  isFav: boolean;
  isCurrent?: boolean;
  isExplored?: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
}) => (
  <div
    className={`bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer ${
      isExplored ? "border-emerald-200 ring-1 ring-emerald-100" : "border-gray-200"
    }`}
    onClick={onSelect}
  >
    {" "}
    {/* Cover photo */}{" "}
    <div
      className="relative overflow-hidden bg-gray-200 flex-shrink-0"
      style={{ height: 160 }}
    >
      {" "}
      <img
        src={career.coverPhoto}
        alt={career.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />{" "}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />{" "}
      {(isCurrent || isExplored) && (
        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
          {isCurrent ? "Đang khám phá" : "Đã khám phá"}
        </span>
      )}
      <button
        onClick={onToggleFav}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${isFav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
      >
        {" "}
        <Heart size={14} fill={isFav ? "currentColor" : "none"} />{" "}
      </button>{" "}
    </div>{" "}
    {/* Card body */}{" "}
    <div className="p-4 flex flex-col flex-1">
      {" "}
      <span
        className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mb-2 ${career.fieldColor}`}
      >
        {career.field}
      </span>{" "}
      <h3 className="text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline mb-1.5 leading-snug">
        {career.name}
      </h3>{" "}
      <p
        className="text-xs text-gray-500 leading-relaxed mb-3 flex-1"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {" "}
        {career.desc}{" "}
      </p>{" "}
      {/* Education + Salary - no progress bar */}{" "}
      <div className="space-y-1.5 pt-3 border-t border-gray-100">
        {" "}
        <div className="flex items-center gap-2 text-xs text-gray-600">
          {" "}
          <GraduationCap
            size={12}
            className="text-gray-400 flex-shrink-0"
          />{" "}
          <span>{career.education}</span>{" "}
        </div>{" "}
        <div className="flex items-center gap-2 text-xs">
          {" "}
          <TrendingUp
            size={12}
            className="text-emerald-500 flex-shrink-0"
          />{" "}
          <span className="font-bold text-emerald-700">
            {career.salaryMin} – {career.salaryMax}
          </span>{" "}
          <span className="text-gray-400">{career.salaryNote}</span>{" "}
        </div>{" "}
      </div>{" "}
    </div>{" "}
  </div>
);
export const ExploreTestModal = ({
  onClose,
  onViewCareer,
  onConfirmCareer,
  currentExploredCareer,
  confirmingCareerId,
}: {
  onClose: () => void;
  onViewCareer: (career: ExploreCareer) => void;
  onConfirmCareer: (career: ExploreCareer) => void;
  currentExploredCareer?: string;
  confirmingCareerId?: string | null;
}) => {
  const [filters, setFilters] = useState<TestFilters>({
    minSalary: 0,
    education: [],
    demand: [],
    personality: [],
    clusters: [],
    subjects: [],
  });
  const [step, setStep] = useState<"form" | "results">("form");
  const [results, setResults] = useState<
    { career: ExploreCareer; score: number }[]
  >([]);
  const [showAllClusters, setShowAllClusters] = useState(false);
  const set = <K extends keyof TestFilters>(k: K, v: TestFilters[K]) =>
    setFilters((f) => ({ ...f, [k]: v }));
  const handleSubmit = () => {
    const scored = EXPLORE_CAREERS.map((c) => ({
      career: c,
      score: scoreCareer(c, filters),
    })).sort((a, b) => b.score - a.score);
    setResults(scored);
    setStep("results");
  };
  const SALARY_STEPS = [0, 5, 10, 15, 20, 25, 30, 40, 50];
  const salaryLabel =
    filters.minSalary === 0
      ? "Không yêu cầu"
      : `${filters.minSalary} triệu+/tháng`;
  const visibleClusters = showAllClusters
    ? CLUSTER_OPTS
    : CLUSTER_OPTS.slice(0, 4);
  const suggestedClusters = ["Công nghệ & CNTT", "Nghệ thuật & Thiết kế"];
  /* demo */ const SectionLabel = ({ label }: { label: string }) => (
    <div className="flex items-center gap-0 mb-3">
      {" "}
      <span className="text-sm font-bold text-gray-800 w-44 flex-shrink-0">
        {label}
      </span>{" "}
      <div className="flex-1 h-px bg-gray-100" />{" "}
    </div>
  );
  if (step === "results")
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.5)" }}
      >
        {" "}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {" "}
          {/* Header */}{" "}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            {" "}
            <div>
              {" "}
              <h2 className="text-lg font-bold text-gray-900">
                Kết quả khám phá 🎯
              </h2>{" "}
              <p className="text-sm text-gray-500 mt-0.5">
                Dựa trên tiêu chí bạn đã chọn
              </p>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                onClick={() => setStep("form")}
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                {" "}
                ← Chỉnh lại{" "}
              </button>{" "}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                {" "}
                <span className="text-lg leading-none">×</span>{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
          <div className="overflow-y-auto p-6 space-y-3">
            {" "}
            {results.map(({ career, score }, i) => {
              const pct = Math.round(score);
              const bar =
                pct >= 80
                  ? "from-emerald-500 to-green-400"
                  : pct >= 60
                    ? "from-blue-500 to-sky-400"
                    : pct >= 40
                      ? "from-amber-400 to-yellow-300"
                      : "from-gray-300 to-gray-200";
              return (
                <div
                  key={career.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all hover:shadow-md ${i === 0 ? "border-emerald-300 bg-emerald-50/40" : i === 1 ? "border-blue-200 bg-blue-50/30" : "border-gray-100 bg-white"}`}
                >
                  {" "}
                  {/* Rank */}{" "}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {" "}
                    {i === 0
                      ? "🥇"
                      : i === 1
                        ? "🥈"
                        : i === 2
                          ? "🥉"
                          : i + 1}{" "}
                  </div>{" "}
                  {/* Photo */}{" "}
                  <div className="w-14 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {" "}
                    <img
                      src={career.coverPhoto}
                      alt={career.name}
                      className="w-full h-full object-cover"
                    />{" "}
                  </div>{" "}
                  {/* Info */}{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {" "}
                      <h3 className="font-bold text-gray-900 text-sm">
                        {career.name}
                      </h3>{" "}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${career.fieldColor}`}
                      >
                        {career.field}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center gap-2">
                      {" "}
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        {" "}
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${bar} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />{" "}
                      </div>{" "}
                      <span
                        className={`text-xs font-black font-mono w-8 ${pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-blue-600" : pct >= 40 ? "text-amber-600" : "text-gray-400"}`}
                      >
                        {pct}%
                      </span>{" "}
                    </div>{" "}
                  </div>{" "}
                  {/* Salary */}{" "}
                  <div className="text-right flex-shrink-0">
                    {" "}
                    <p className="text-xs font-bold text-emerald-700">
                      {career.salaryMin}–{career.salaryMax}
                    </p>{" "}
                    <p className="text-xs text-gray-400">
                      {career.salaryNote}
                    </p>{" "}
                  </div>{" "}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        onClose();
                        onViewCareer(career);
                      }}
                      className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      Xem chi tiết <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={() => onConfirmCareer(career)}
                      disabled={
                        confirmingCareerId === career.id ||
                        currentExploredCareer === career.name
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 ${
                        currentExploredCareer === career.name
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      }`}
                    >
                      <CheckCircle size={12} />
                      {currentExploredCareer === career.name
                        ? "Đang khám phá"
                        : confirmingCareerId === career.id
                          ? "Đang lưu..."
                          : "Xác nhận khám phá"}
                    </button>
                  </div>
                </div>
              );
            })}{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      {" "}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {" "}
        {/* Header */}{" "}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#1e3a5f,#2563EB)" }}
        >
          {" "}
          <div>
            {" "}
            <h2 className="text-lg font-bold text-white">
              🔍 Test Khám phá Nghề nghiệp
            </h2>{" "}
            <p className="text-sm text-blue-200 mt-0.5">
              Chọn tiêu chí để tìm ngành nghề phù hợp nhất với bạn
            </p>{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            {" "}
            <span className="text-xl leading-none font-light">×</span>{" "}
          </button>{" "}
        </div>{" "}
        {/* Form body */}{" "}
        <div className="overflow-y-auto p-6 space-y-7 flex-1">
          {" "}
          {/* Minimum Salary */}{" "}
          <div>
            {" "}
            <SectionLabel label="Mức lương tối thiểu" />{" "}
            <div className="flex items-center gap-4">
              {" "}
              <span className="text-xs text-gray-400 font-mono w-20 flex-shrink-0">
                Không yêu cầu
              </span>{" "}
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={filters.minSalary}
                onChange={(e) => set("minSalary", parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#2563EB" }}
              />{" "}
              <span className="text-xs text-gray-400 font-mono w-14 flex-shrink-0 text-right">
                50 tr+
              </span>{" "}
            </div>{" "}
            <div className="mt-2 text-center">
              {" "}
              <span className="inline-block text-sm font-bold text-blue-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
                {" "}
                {salaryLabel}{" "}
              </span>{" "}
            </div>{" "}
          </div>{" "}
          {/* Education */}{" "}
          <div>
            {" "}
            <SectionLabel label="Trình độ học vấn" />{" "}
            <MultiCheck
              options={EDU_OPTS.map((e) => e.label)}
              selected={filters.education}
              onChange={(v) => set("education", v)}
              cols={2}
            />{" "}
          </div>{" "}
          {/* Career Demand */}{" "}
          <div>
            {" "}
            <SectionLabel label="Triển vọng ngành" />{" "}
            <MultiCheck
              options={DEMAND_OPTIONS}
              selected={filters.demand}
              onChange={(v) => set("demand", v)}
              cols={4}
            />{" "}
          </div>{" "}
          {/* Personality Styles */}{" "}
          <div>
            {" "}
            <SectionLabel label="Phong cách cá nhân" />{" "}
            <MultiCheck
              options={PERSONALITY_OPTS}
              selected={filters.personality}
              onChange={(v) => set("personality", v)}
              cols={3}
            />{" "}
          </div>{" "}
          {/* Career Clusters */}{" "}
          <div>
            {" "}
            <SectionLabel label="Nhóm ngành quan tâm" />{" "}
            <div
              className={`grid gap-2`}
              style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
            >
              {" "}
              {visibleClusters.map((o) => {
                const isSuggested = suggestedClusters.includes(o);
                const isSelected = filters.clusters.includes(o);
                return (
                  <button
                    key={o}
                    onClick={() =>
                      set(
                        "clusters",
                        isSelected
                          ? filters.clusters.filter((x) => x !== o)
                          : [...filters.clusters, o],
                      )
                    }
                    className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left text-sm transition-all ${isSelected ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                  >
                    {" "}
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                    >
                      {" "}
                      {isSelected && (
                        <CheckCircle size={10} className="text-white" />
                      )}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <span className="font-medium">{o}</span>{" "}
                      {isSuggested && (
                        <span className="ml-1.5 text-xs text-blue-500 font-semibold">
                          (gợi ý cho bạn)
                        </span>
                      )}{" "}
                    </div>{" "}
                  </button>
                );
              })}{" "}
            </div>{" "}
            {!showAllClusters && (
              <button
                onClick={() => setShowAllClusters(true)}
                className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                {" "}
                <Plus size={14} /> Xem thêm nhóm ngành{" "}
              </button>
            )}{" "}
          </div>{" "}
          {/* School Subjects */}{" "}
          <div>
            {" "}
            <SectionLabel label="Môn học yêu thích" />{" "}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {" "}
              {SUBJECT_OPTS.map((o) => (
                <button
                  key={o}
                  onClick={() =>
                    set(
                      "subjects",
                      filters.subjects.includes(o)
                        ? filters.subjects.filter((x) => x !== o)
                        : [...filters.subjects, o],
                    )
                  }
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${filters.subjects.includes(o) ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
                >
                  {" "}
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${filters.subjects.includes(o) ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
                  >
                    {" "}
                    {filters.subjects.includes(o) && (
                      <CheckCircle size={10} className="text-white" />
                    )}{" "}
                  </div>{" "}
                  {o}{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50">
          {" "}
          <button
            onClick={() =>
              setFilters({
                minSalary: 0,
                education: [],
                demand: [],
                personality: [],
                clusters: [],
                subjects: [],
              })
            }
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            {" "}
            Đặt lại tất cả{" "}
          </button>{" "}
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
          >
            {" "}
            Tìm ngành phù hợp <ArrowRight size={15} />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export const StudentExplore = ({
  onNavigateToUni,
}: {
  onNavigateToUni?: (uniId: string) => void;
}) => {
  const { studentsInClass: appStudents, updateStudentInAppData } = useAppData();
  const [search, setSearch] = useState("");
  const [activeField, setActiveField] = useState("Tất cả");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<ExploreCareer | null>(null);
  const [showFavs, setShowFavs] = useState(false);
  const [reactions, setReactions] = useState<Record<string, ReferenceEmotion>>({});
  const [showTest, setShowTest] = useState(false);
  const [currentExploredCareer, setCurrentExploredCareer] = useState("");
  const [exploredCareers, setExploredCareers] = useState<string[]>([]);
  const [savingCareerId, setSavingCareerId] = useState<string | null>(null);
  const [activityCareer, setActivityCareer] = useState<ExploreCareer | null>(null);
  const [savingActivities, setSavingActivities] = useState(false);
  const [notice, setNotice] = useState("");
  const studentId = currentStudentReferenceId();
  const referenceActions = careerReferenceActions();
  const appStudent = appStudents.find((student) => student.id === studentId);

  React.useEffect(() => {
    const controller = new AbortController();
    syncReferenceActions(referenceActions, controller.signal).catch(() => undefined);
    fetchStudentReferences(studentId, controller.signal)
      .then((payload) => {
        const next = Object.fromEntries(
          payload.references
            .filter((item) => item.emotion)
            .map((item) => [item.actionId, item.emotion as ReferenceEmotion]),
        );
        setReactions(next);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [studentId]);

  React.useEffect(() => {
    const nextExplored = (appStudent?.exploredCareers ?? []).filter(Boolean);
    setExploredCareers(nextExplored);
    setCurrentExploredCareer(
      appStudent?.currentExploredCareer ||
        nextExplored[0] ||
        appStudent?.favoriteCareer ||
        "",
    );
  }, [
    studentId,
    appStudent?.currentExploredCareer,
    appStudent?.favoriteCareer,
    (appStudent?.exploredCareers ?? []).join("|"),
  ]);

  const toggleFav = (id: string) =>
    setFavorites((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const isCareerExplored = (career: ExploreCareer) =>
    currentExploredCareer === career.name || exploredCareers.includes(career.name);
  const openActivityView = (career: ExploreCareer) => {
    if (
      isCareerExplored(career) &&
      !window.confirm(
        `Bạn đã khám phá "${career.name}". Bạn có muốn làm lại và cập nhật cảm xúc đã lưu không?`,
      )
    ) {
      return;
    }
    setActivityCareer(career);
  };
  const saveExploredCareer = (career: ExploreCareer) => {
    const nextExplored = mergeCareerNames(exploredCareers, career.name);
    setSavingCareerId(career.id);
    setNotice("");

    return updateStudent<StudentExploreUpdateResponse>(studentId, {
      currentExploredCareer: career.name,
      exploredCareers: nextExplored,
    })
      .then((payload) => {
        const updatedExplored = payload.student.exploredCareers ?? nextExplored;
        const updatedCurrent = payload.student.currentExploredCareer ?? career.name;
        setExploredCareers(updatedExplored);
        setCurrentExploredCareer(updatedCurrent);
        updateStudentInAppData(studentId, {
          currentExploredCareer: updatedCurrent,
          exploredCareers: updatedExplored,
        });
        setNotice(`Đã lưu "${career.name}" là nghề đang khám phá.`);
      })
      .catch((error) => {
        setNotice(error.message || "Không lưu được nghề đang khám phá.");
        throw error;
      })
      .finally(() => setSavingCareerId(null));
  };
  const handleSaveActivityReactions = (career: ExploreCareer, draft: Record<string, ReferenceEmotion>) => {
    const entries = Object.entries(draft).filter(([key]) =>
      key.startsWith(`${career.id}:`),
    );
    if (entries.length === 0) return;

    setSavingActivities(true);
    setNotice("");
    Promise.all(
      entries.map(([key, emotion]) => {
        const action = referenceActions.find((item) => item.actionId === key);
        if (!action) return Promise.resolve(null);
        return saveStudentReference({
          studentId,
          actionId: key,
          emotion,
          action,
        });
      }),
    )
      .then(() => saveExploredCareer(career))
      .then(() => {
        setReactions((current) => ({ ...current, ...draft }));
        setActivityCareer(null);
      })
      .catch(() => undefined)
      .finally(() => setSavingActivities(false));
  };
  const filtered = EXPLORE_CAREERS.filter((c) => {
    if (showFavs && !favorites.includes(c.id)) return false;
    if (activeField !== "Tất cả" && c.field !== activeField) return false;
    if (
      search &&
      !c.name.toLowerCase().includes(search.toLowerCase()) &&
      !c.field.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });
  if (selected)
    return (
      <>
        <ExploreCareerDetail
          career={selected}
          onBack={() => setSelected(null)}
          favorites={favorites}
          onToggleFav={() => toggleFav(selected.id)}
          reactions={reactions}
          currentExploredCareer={currentExploredCareer}
          isExplored={isCareerExplored(selected)}
          confirming={savingCareerId === selected.id}
          activitySaving={savingActivities && activityCareer?.id === selected.id}
          onConfirmExplore={() => saveExploredCareer(selected).catch(() => undefined)}
          onOpenActivityView={() => openActivityView(selected)}
          onSelectRelated={(id) => {
            const c = EXPLORE_CAREERS.find((x) => x.id === id);
            if (c) setSelected(c);
          }}
          onNavigateToUni={onNavigateToUni}
        />
        {notice && (
          <div
            className={`fixed bottom-5 right-5 z-40 rounded-2xl border px-4 py-3 text-sm font-bold shadow-lg ${
              notice.startsWith("Không")
                ? "border-red-100 bg-red-50 text-red-700"
                : "border-emerald-100 bg-emerald-50 text-emerald-700"
            }`}
          >
            {notice}
          </div>
        )}
        {activityCareer && (
          <CareerActivityEmotionModal
            career={activityCareer}
            reactions={reactions}
            saving={savingActivities}
            onClose={() => {
              if (!savingActivities) setActivityCareer(null);
            }}
            onSave={(draft) => handleSaveActivityReactions(activityCareer, draft)}
          />
        )}
      </>
    );
  return (
    <div className="space-y-5">
      {" "}
      {showTest && (
        <ExploreTestModal
          onClose={() => setShowTest(false)}
          onViewCareer={(career) => setSelected(career)}
          onConfirmCareer={(career) =>
            saveExploredCareer(career).catch(() => undefined)
          }
          currentExploredCareer={currentExploredCareer}
          confirmingCareerId={savingCareerId}
        />
      )}{" "}
      <div className="flex items-start justify-between flex-wrap gap-3">
        {" "}
        <div>
          {" "}
          <h1 className="text-xl font-bold text-gray-900">
            Khám phá Ngành nghề 🧭
          </h1>{" "}
          <p className="text-sm text-gray-500 mt-0.5">
            Tìm hiểu ngành nghề và khám phá điều bạn yêu thích
          </p>{" "}
        </div>{" "}
        {/* Test button */}{" "}
        <button
          onClick={() => setShowTest(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-all hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}
        >
          {" "}
          <span className="text-base">🔍</span> Test Khám phá{" "}
        </button>{" "}
      </div>{" "}
      {notice && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            notice.startsWith("Không")
              ? "border-red-100 bg-red-50 text-red-700"
              : "border-emerald-100 bg-emerald-50 text-emerald-700"
          }`}
        >
          {notice}
        </div>
      )}
      {/* Search + fav filter */}{" "}
      <div className="flex flex-wrap gap-3 items-center">
        {" "}
        <div className="relative flex-1 min-w-52">
          {" "}
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />{" "}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-orange-400"
            placeholder="Tìm ngành nghề..."
          />{" "}
        </div>{" "}
        <button
          onClick={() => setShowFavs((v) => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${showFavs ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-300"}`}
        >
          {" "}
          <Heart size={14} fill={showFavs ? "currentColor" : "none"} /> Yêu
          thích {favorites.length > 0 && `(${favorites.length})`}{" "}
        </button>{" "}
      </div>{" "}
      {/* Field chips */}{" "}
      <div className="flex gap-2 flex-wrap">
        {" "}
        {EXPLORE_FIELDS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveField(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${activeField === f ? "border-orange-500 bg-orange-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"}`}
          >
            {" "}
            {f}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      <p className="text-xs text-gray-500 font-medium">
        {filtered.length} ngành nghề
      </p>{" "}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {" "}
          {filtered.map((c) => (
            <ExploreCareerCard
              key={c.id}
              career={c}
              onSelect={() => setSelected(c)}
              isFav={favorites.includes(c.id)}
              isCurrent={currentExploredCareer === c.name}
              isExplored={isCareerExplored(c)}
              onToggleFav={(e) => {
                e.stopPropagation();
                toggleFav(c.id);
              }}
            />
          ))}{" "}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          {" "}
          <p className="text-4xl mb-3">🔍</p>{" "}
          <p className="font-semibold">Không tìm thấy kết quả</p>{" "}
          <p className="text-sm mt-1">Thử từ khoá khác hoặc bỏ bộ lọc</p>{" "}
        </div>
      )}{" "}
    </div>
  );
};
