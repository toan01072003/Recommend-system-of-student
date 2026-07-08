import { TrendingUp, CheckCircle } from "lucide-react";
export { LineChart, Line } from "recharts";

// ── Shared micro-components ──────────────────────────────────────────────────

export const RiskBadge = ({ level }: { level: string }) => {
  const map: Record<string, { cls: string; label: string }> = {
    none: {
      cls: "bg-green-100 text-green-700 border border-green-200",
      label: "Bình thường",
    },
    low: {
      cls: "bg-yellow-100 text-yellow-700 border border-yellow-200",
      label: "Chú ý",
    },
    medium: {
      cls: "bg-orange-100 text-orange-700 border border-orange-200",
      label: "Cần hỗ trợ",
    },
    high: {
      cls: "bg-red-100 text-red-700 border border-red-200",
      label: "Khẩn cấp",
    },
  };
  const { cls, label } = map[level] ?? map.none;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
};

export const TestBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    "Hoàn thành": "bg-green-100 text-green-700",
    "Đang làm": "bg-blue-100 text-blue-700",
    "Chưa làm": "bg-gray-100 text-gray-500",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
};

export const ProgressBar = ({ value }: { value: number }) => {
  const color =
    value >= 80
      ? "bg-green-500"
      : value >= 60
        ? "bg-blue-500"
        : value >= 40
          ? "bg-yellow-500"
          : "bg-red-400";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  sub,
  icon: Icon,
  color = "blue",
  trend,
}: {
  title: string;
  value: string;
  sub?: string;
  icon: any;
  color?: string;
  trend?: string;
}) => {
  const iconCls: Record<string, string> = {
    blue: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    navy: "bg-amber-50 text-amber-700",
  };
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1 font-mono">
            {value}
          </p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2.5 rounded-lg flex-shrink-0 ${iconCls[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
          <TrendingUp size={11} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export const Avatar = ({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) => {
  const initial = name.split(" ").pop()?.charAt(0) ?? "?";
  const sz =
    size === "sm"
      ? "w-8 h-8 text-xs"
      : size === "lg"
        ? "w-16 h-16 text-2xl"
        : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sz} rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {initial}
    </div>
  );
};

export const ScoreBar = ({
  score,
  subject,
}: {
  score: number;
  subject: string;
}) => {
  const color =
    score >= 8.5
      ? "from-emerald-500 to-green-400"
      : score >= 7.0
        ? "from-blue-500 to-sky-400"
        : score >= 5.0
          ? "from-amber-400 to-yellow-300"
          : "from-red-500 to-rose-400";
  const textColor =
    score >= 8.5
      ? "text-emerald-700"
      : score >= 7.0
        ? "text-blue-700"
        : score >= 5.0
          ? "text-amber-700"
          : "text-red-600";
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-gray-600 w-20 flex-shrink-0">
        {subject}
      </span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
        <div
          className={`h-5 rounded-full bg-gradient-to-r ${color} transition-all duration-500 flex items-center justify-end pr-2`}
          style={{ width: `${(score / 10) * 100}%` }}
        >
          <span
            className="text-white text-xs font-bold leading-none"
            style={{ fontSize: 10 }}
          >
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      <span
        className={`text-xs font-black w-8 text-right font-mono ${textColor}`}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
};

export const MultiCheck = ({
  options,
  selected,
  onChange,
  cols = 3,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  cols?: number;
}) => {
  const toggle = (o: string) =>
    onChange(
      selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o],
    );
  return (
    <div
      className={`grid gap-2`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {options.map((o) => (
        <button
          key={o}
          onClick={() => toggle(o)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-medium transition-all ${selected.includes(o) ? "border-blue-500 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}
        >
          <div
            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.includes(o) ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
          >
            {selected.includes(o) && (
              <CheckCircle size={10} className="text-white" />
            )}
          </div>
          {o}
        </button>
      ))}
    </div>
  );
};
