import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  CheckCircle,
  GraduationCap,
  Heart,
  Shield,
} from "lucide-react";

// ── Screen 1: Login ──────────────────────────────────────────────────────────

export const LoginScreen = ({
  onLogin,
}: {
  onLogin: (role: string) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const roles = [
    {
      id: "admin",
      label: "Quản trị viên",
      icon: Shield,
      desc: "Quản lý toàn hệ thống",
      cls: "bg-indigo-600",
    },

    {
      id: "teacher",
      label: "Giáo viên",
      icon: BookOpen,
      desc: "Nhập liệu & theo dõi lớp",
      cls: "bg-blue-600",
    },

    {
      id: "counselor",
      label: "Cố vấn hướng nghiệp",
      icon: Briefcase,
      desc: "Tư vấn & lập kế hoạch",
      cls: "bg-teal-600",
    },

    {
      id: "student",
      label: "Học sinh",
      icon: GraduationCap,
      desc: "Khám phá nghề nghiệp",
      cls: "bg-violet-600",
    },

    {
      id: "parent",
      label: "Phụ huynh",
      icon: Heart,
      desc: "Theo dõi tiến độ của con",
      cls: "bg-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C2B4A] via-[#7C3AED] to-[#EA580C] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <GraduationCap className="text-white" size={28} />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">
            EduPath
          </h1>

          <p className="text-blue-300 text-sm mt-1.5">
            Hệ thống hướng nghiệp học sinh lớp 6–12
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>

              <input
                type="email"

                defaultValue="admin@truongnguyendu.edu.vn"

                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>

              <input
                type="password"

                defaultValue="••••••••"

                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-3">
            Đăng nhập với vai trò
          </p>

          <div className="space-y-1.5 mb-5">
            {roles.map((r) => (
              <button
                key={r.id}

                onClick={() => setSelected(r.id)}

                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all text-left ${
                  selected === r.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg ${r.cls} flex items-center justify-center flex-shrink-0`}
                >
                  <r.icon size={15} className="text-white" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {r.label}
                  </p>

                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>

                {selected === r.id && (
                  <CheckCircle
                    size={16}
                    className="text-blue-500 flex-shrink-0"
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => selected && onLogin(selected)}

            disabled={!selected}

            className="w-full py-3 bg-[#EA580C] text-white rounded-xl font-semibold text-sm hover:bg-[#C2410C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Đăng nhập
          </button>
        </div>

        <p className="text-center text-blue-400 text-xs mt-5">
          THCS & THPT Nguyễn Du · Năm học 2024–2025
        </p>
      </div>
    </div>
  );
};
