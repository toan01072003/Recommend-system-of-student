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
import { useT } from "../../../i18n";

export const UniversityCard = ({
  uni,
  onSelect,
  isFav,
  onToggleFav,
}: {
  uni: University;
  onSelect: () => void;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
}) => (
  <div
    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer"
    onClick={onSelect}
  >
    {" "}
    <div
      className="relative overflow-hidden bg-gray-200 flex-shrink-0"
      style={{ height: 148 }}
    >
      {" "}
      <img
        src={uni.coverPhoto}
        alt={uni.name}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />{" "}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />{" "}
      <button
        onClick={onToggleFav}
        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 transition-all ${isFav ? "bg-red-500 text-white" : "bg-white/90 text-gray-400 hover:text-red-500"}`}
      >
        {" "}
        <Heart size={13} fill={isFav ? "currentColor" : "none"} />{" "}
      </button>{" "}
      <div className="absolute bottom-2 left-2">
        {" "}
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${uni.typeColor}`}
        >
          {uni.type}
        </span>{" "}
      </div>{" "}
    </div>{" "}
    <div className="p-4 flex flex-col flex-1">
      {" "}
      {/* Short name badge */}{" "}
      <div className="flex items-center gap-2 mb-1.5">
        {" "}
        <span className="text-xs font-black text-gray-400 font-mono">
          {uni.shortName}
        </span>{" "}
        <span className="text-xs text-gray-400">·</span>{" "}
        <span className="text-xs text-gray-500 truncate">
          {uni.location}
        </span>{" "}
      </div>{" "}
      <h3 className="text-sm font-bold text-blue-700 hover:text-blue-900 leading-snug mb-2">
        {uni.name}
      </h3>{" "}
      <p
        className="text-xs text-gray-500 mb-3 flex-1"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {" "}
        {uni.desc}{" "}
      </p>{" "}
      {/* Top major chips */}{" "}
      <div className="flex flex-wrap gap-1 mb-3">
        {" "}
        {uni.majors.slice(0, 2).map((m) => (
          <span
            key={m}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
          >
            {m}
          </span>
        ))}{" "}
        {uni.majors.length > 2 && (
          <span className="text-xs text-gray-400">
            +{uni.majors.length - 2}
          </span>
        )}{" "}
      </div>{" "}
      <div className="pt-2.5 border-t border-gray-100 space-y-1">
        {" "}
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          {" "}
          <GraduationCap
            size={11}
            className="text-gray-400 flex-shrink-0"
          />{" "}
          <span>
            Điểm chuẩn:{" "}
            <span className="font-semibold text-gray-800">
              {uni.admissionScore}
            </span>
          </span>{" "}
        </div>{" "}
        <div className="flex items-center gap-1.5 text-xs">
          {" "}
          <TrendingUp
            size={11}
            className="text-emerald-500 flex-shrink-0"
          />{" "}
          <span className="font-bold text-emerald-700">
            {uni.tuitionMin}–{uni.tuitionMax}
          </span>{" "}
          <span className="text-gray-400">{uni.tuitionNote}</span>{" "}
        </div>{" "}
      </div>{" "}
    </div>{" "}
  </div>
);
// University detail
export const UniversityDetail = ({
  uni,
  onBack,
  favorites,
  onToggleFav,
  reactions,
  onReact,
  onSelectRelated,
}: {
  uni: University;
  onBack: () => void;
  favorites: string[];
  onToggleFav: () => void;
  reactions: Record<string, string>;
  onReact: (id: string, emoji: string) => void;
  onSelectRelated: (id: string) => void;
}) => {
  const t = useT();
  const [showWhy, setShowWhy] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const liked = Object.entries(reactions)
    .filter(([, e]) => e === "😍" || e === "👍")
    .map(([id]) => uni.activities.find((a) => a.id === id)?.label)
    .filter(Boolean);
  const relatedUnis = UNIVERSITIES.filter(
    (u) => u.id !== uni.id && uni.related.includes(u.id),
  );
  return (
    <div className="space-y-6">
      {" "}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
      >
        {" "}
        <ArrowRight size={13} className="rotate-180" /> {t("Quay lại danh sách")}{" "}
      </button>{" "}
      {/* Hero */}{" "}
      <div
        className="relative rounded-2xl overflow-hidden bg-gray-200"
        style={{ height: 280 }}
      >
        {" "}
        <img
          src={uni.coverPhoto}
          alt={uni.name}
          className="w-full h-full object-cover"
        />{" "}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />{" "}
        <div className="absolute bottom-0 left-0 p-6">
          {" "}
          <div className="flex items-center gap-2 mb-2">
            {" "}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${uni.typeColor}`}
            >
              {uni.type}
            </span>{" "}
            <span className="text-white/80 text-xs">
              📍 {uni.location}
            </span>{" "}
          </div>{" "}
          <h1 className="text-2xl font-black text-white leading-tight">
            {uni.name}
          </h1>{" "}
          <p className="text-sm font-bold text-white/60 font-mono mt-0.5">
            {uni.shortName} · {uni.ranking}
          </p>{" "}
        </div>{" "}
        <div className="absolute top-4 right-4 flex gap-2">
          {" "}
          <button
            onClick={() => setShowWhy(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-lg hover:opacity-90"
          >
            {" "}
            💭 {t("Why?")}{" "}
          </button>{" "}
          <button
            onClick={onToggleFav}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${favorites.includes(uni.id) ? "bg-red-500 text-white" : "bg-white/90 text-gray-500 hover:text-red-500"}`}
          >
            {" "}
            <Heart
              size={16}
              fill={favorites.includes(uni.id) ? "currentColor" : "none"}
            />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Quick stats */}{" "}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {" "}
        {[
          {
            icon: TrendingUp,
            label: "Học phí/năm",
            value: `${uni.tuitionMin}–${uni.tuitionMax}`,
            cls: "text-emerald-600",
          },
          {
            icon: GraduationCap,
            label: "Điểm chuẩn",
            value: uni.admissionScore,
            cls: "text-blue-600",
          },
          {
            icon: Star,
            label: "Xếp hạng",
            value: uni.ranking,
            cls: "text-orange-600",
          },
          {
            icon: MapPin,
            label: "Địa điểm",
            value: uni.location.split(" / ")[0],
            cls: "text-purple-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
          >
            {" "}
            <div className="flex items-center gap-1.5 mb-1">
              {" "}
              <s.icon size={13} className={s.cls} />{" "}
              <span className="text-xs text-gray-500 font-medium">
                {t(s.label)}
              </span>{" "}
            </div>{" "}
            <p className={`text-sm font-bold ${s.cls} leading-snug`}>
              {s.value}
            </p>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {" "}
        {/* Left */}{" "}
        <div className="lg:col-span-2 space-y-5">
          {" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-2">
              🏫 {t("Giới thiệu trường")}
            </h3>{" "}
            <p className="text-sm text-gray-600 leading-relaxed">
              {uni.fullDesc}
            </p>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3">
              📚 {t("Ngành đào tạo nổi bật")}
            </h3>{" "}
            <div className="flex flex-wrap gap-2">
              {" "}
              {uni.majors.map((m) => (
                <span
                  key={m}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${m === uni.topMajor ? "bg-blue-500 text-white border-blue-500" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                >
                  {" "}
                  {m === uni.topMajor && "⭐ "}
                  {m}{" "}
                </span>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3">
              📷 {t("Hình ảnh khuôn viên")}
            </h3>{" "}
            <div className="grid grid-cols-3 gap-2">
              {" "}
              {uni.gallery.map((url, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden bg-gray-100 aspect-video"
                >
                  {" "}
                  <img
                    src={url}
                    alt={`${uni.name} ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3">
              🎬 {t("Video giới thiệu trường")}
            </h3>{" "}
            <div
              className="relative rounded-xl overflow-hidden cursor-pointer bg-gray-900"
              style={{ aspectRatio: "16/9" }}
              onClick={() => setVideoPlaying(true)}
            >
              {" "}
              <img
                src={uni.videoThumb}
                alt="Video"
                className={`w-full h-full object-cover transition-opacity ${videoPlaying ? "opacity-30" : "opacity-90"}`}
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
                        borderLeft: "18px solid #2563EB",
                      }}
                    />{" "}
                  </div>{" "}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                  {" "}
                  <div>
                    <p className="text-4xl mb-2">▶</p>
                    <p className="text-sm opacity-80">{t("Video đang phát...")}</p>
                  </div>{" "}
                </div>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Right */}{" "}
        <div className="space-y-4">
          {" "}
          {/* Why collapsed */}{" "}
          {!showWhy && (
            <button
              onClick={() => setShowWhy(true)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <span className="text-2xl">💭</span>{" "}
                <div className="text-left">
                  {" "}
                  <p className="text-sm font-bold text-blue-700">
                    {t("Tôi thích điều gì?")}
                  </p>{" "}
                  <p className="text-xs text-blue-500">
                    {t("Khám phá cuộc sống sinh viên ở đây")}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <ChevronRight
                size={18}
                className="text-blue-400 group-hover:translate-x-1 transition-transform"
              />{" "}
            </button>
          )}{" "}
          {/* Why expanded */}{" "}
          {showWhy && (
            <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
              {" "}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
                {" "}
                <div>
                  {" "}
                  <h3 className="font-bold">💭 {t("Tôi thích điều gì?")}</h3>{" "}
                  <p className="text-xs text-white/80 mt-0.5">
                    {t("Chọn cảm xúc với từng trải nghiệm")}
                  </p>{" "}
                </div>{" "}
                <button
                  onClick={() => setShowWhy(false)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  {" "}
                  <ChevronDown size={14} />{" "}
                </button>{" "}
              </div>{" "}
              <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                {" "}
                {uni.activities.map((act) => (
                  <div
                    key={act.id}
                    className={`p-3 rounded-xl border-2 transition-all ${reactions[act.id] ? "border-blue-200 bg-blue-50" : "border-gray-100 bg-gray-50"}`}
                  >
                    {" "}
                    <p className="text-xs font-medium text-gray-700 mb-2 leading-snug">
                      {act.label}
                    </p>{" "}
                    <div className="flex gap-1.5">
                      {" "}
                      {UNI_REACTIONS.map((r) => (
                        <button
                          key={r.emoji}
                          onClick={() =>
                            onReact(
                              act.id,
                              reactions[act.id] === r.emoji ? "" : r.emoji,
                            )
                          }
                          title={r.label}
                          className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all hover:scale-110 ${reactions[act.id] === r.emoji ? "bg-blue-200 ring-2 ring-blue-400 scale-110" : "bg-white border border-gray-200 hover:border-blue-300"}`}
                        >
                          {" "}
                          {r.emoji}{" "}
                        </button>
                      ))}{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
              {liked.length > 0 && (
                <div className="p-3 border-t border-blue-100 bg-indigo-50">
                  {" "}
                  <p className="text-xs font-bold text-indigo-800 mb-1.5">
                    ✨ {t("Đã lưu vào sở thích")}:
                  </p>{" "}
                  <div className="flex flex-wrap gap-1">
                    {" "}
                    {liked.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="text-xs bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full font-medium"
                      >
                        {a?.split(" ").slice(0, 3).join(" ")}...
                      </span>
                    ))}{" "}
                    {liked.length > 4 && (
                      <span className="text-xs text-indigo-600 font-semibold">
                        +{liked.length - 4}
                      </span>
                    )}{" "}
                  </div>{" "}
                </div>
              )}{" "}
            </div>
          )}{" "}
          {/* Related universities */}{" "}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            {" "}
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              🔗 {t("Trường liên quan")}
            </h3>{" "}
            <div className="space-y-2">
              {" "}
              {relatedUnis.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onSelectRelated(rel.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50 transition-colors group text-left"
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
                    <p className="text-xs font-bold text-gray-800 truncate group-hover:text-blue-700">
                      {rel.shortName} –{" "}
                      {rel.name.split(" ").slice(-2).join(" ")}
                    </p>{" "}
                    <p className="text-xs text-emerald-600 font-semibold">
                      {rel.tuitionMin}–{rel.tuitionMax}
                      {rel.tuitionNote}
                    </p>{" "}
                  </div>{" "}
                  <ChevronRight
                    size={13}
                    className="text-gray-300 group-hover:text-blue-400 flex-shrink-0"
                  />{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export const StudentUniversities = ({
  initialUniId,
}: {
  initialUniId?: string | null;
}) => {
  const t = useT();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("Tất cả");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selected, setSelected] = useState<University | null>(
    initialUniId
      ? (UNIVERSITIES.find((u) => u.id === initialUniId) ?? null)
      : null,
  );
  const [showFavs, setShowFavs] = useState(false);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const toggleFav = (id: string) =>
    setFavorites((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const handleReact = (id: string, emoji: string) =>
    setReactions((p) => ({ ...p, [id]: emoji }));
  const filtered = UNIVERSITIES.filter((u) => {
    if (showFavs && !favorites.includes(u.id)) return false;
    if (activeType !== "Tất cả" && u.type !== activeType) return false;
    if (
      search &&
      !u.name.toLowerCase().includes(search.toLowerCase()) &&
      !u.shortName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });
  if (selected)
    return (
      <UniversityDetail
        uni={selected}
        onBack={() => setSelected(null)}
        favorites={favorites}
        onToggleFav={() => toggleFav(selected.id)}
        reactions={reactions}
        onReact={handleReact}
        onSelectRelated={(id) => {
          const u = UNIVERSITIES.find((x) => x.id === id);
          if (u) setSelected(u);
        }}
      />
    );
  return (
    <div className="space-y-5">
      {" "}
      <div>
        {" "}
        <h1 className="text-xl font-bold text-gray-900">
          {t("Khám phá Đại học")} 🎓
        </h1>{" "}
        <p className="text-sm text-gray-500 mt-0.5">
          {t("Tìm hiểu các trường đại học phù hợp với bạn")}
        </p>{" "}
      </div>{" "}
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
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-blue-400"
            placeholder={t("Tìm trường, ngành...")}
          />{" "}
        </div>{" "}
        <button
          onClick={() => setShowFavs((v) => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${showFavs ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 bg-white text-gray-500 hover:border-red-300"}`}
        >
          {" "}
          <Heart size={14} fill={showFavs ? "currentColor" : "none"} />{" "}
          {t("Yêu thích")} {favorites.length > 0 && `(${favorites.length})`}{" "}
        </button>{" "}
      </div>{" "}
      <div className="flex gap-2 flex-wrap">
        {" "}
        {UNI_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${activeType === type ? "border-blue-500 bg-blue-500 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"}`}
          >
            {" "}
            {t(type)}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      <p className="text-xs text-gray-500 font-medium">
        {filtered.length} {t("trường đại học")}
      </p>{" "}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {" "}
          {filtered.map((u) => (
            <UniversityCard
              key={u.id}
              uni={u}
              onSelect={() => setSelected(u)}
              isFav={favorites.includes(u.id)}
              onToggleFav={(e) => {
                e.stopPropagation();
                toggleFav(u.id);
              }}
            />
          ))}{" "}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          {" "}
          <p className="text-4xl mb-3">🎓</p>{" "}
          <p className="font-semibold">{t("Không tìm thấy trường")}</p>{" "}
          <p className="text-sm mt-1">{t("Thử từ khoá khác hoặc bỏ bộ lọc")}</p>{" "}
        </div>
      )}{" "}
    </div>
  );
};
