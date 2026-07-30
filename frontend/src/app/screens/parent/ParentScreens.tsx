import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  CheckCircle,
  Edit2,
  Lock,
  MessageSquare,
  Save,
  Star,
  X,
} from "lucide-react";
import { StatCard } from "../../shared";
import { fetchStudent, updateStudent } from "../../api/client";
import { useT } from "../../i18n";

const DEFAULT_PARENT_ID = "PARENT_STU006_F";
const DEFAULT_PARENT_STUDENT_ID = "STU006";

type ParentStudentRecord = {
  id: string;
  name: string;
  className?: string;
  avg?: number;
  progress?: number;
  careerFit?: string;
  parentExpectation?: string;
  parentFinanceLevel?: string;
};

type Navigate = (target: string) => void;

export const ParentPortal = ({ navigate }: { navigate?: Navigate }) => {
  const t = useT();
  const [student, setStudent] = useState<ParentStudentRecord | null>(null);
  const [expectationDraft, setExpectationDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "error">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    window.localStorage.setItem("parentPortalParentId", DEFAULT_PARENT_ID);
    window.localStorage.setItem(
      "parentPortalStudentId",
      DEFAULT_PARENT_STUDENT_ID,
    );

    const controller = new AbortController();
    setStatus("loading");
    setError("");
    fetchStudent<{ student: ParentStudentRecord }>(
      DEFAULT_PARENT_STUDENT_ID,
      controller.signal,
    )
      .then((payload) => {
        setStudent(payload.student);
        setExpectationDraft(payload.student.parentExpectation || "");
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được dữ liệu phụ huynh.");
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  const saveExpectation = () => {
    if (!student) return;
    const nextExpectation = expectationDraft.trim();
    const confirmed = window.confirm(
      t("Xác nhận lưu kỳ vọng gia đình cho học sinh này?"),
    );
    if (!confirmed) return;

    setStatus("saving");
    setError("");
    updateStudent<{ student: ParentStudentRecord }>(student.id, {
      expectFamily: nextExpectation,
    })
      .then((payload) => {
        setStudent(payload.student);
        setExpectationDraft(payload.student.parentExpectation || "");
        setEditing(false);
        setStatus("ready");
      })
      .catch((err) => {
        setError(err.message || "Không lưu được kỳ vọng gia đình.");
        setStatus("error");
      });
  };

  const cancelEdit = () => {
    setExpectationDraft(student?.parentExpectation || "");
    setEditing(false);
  };

  const studentName = student?.name || "Nguyễn Minh Anh";
  const className = student?.className || "Lớp 9A";
  const expectation =
    student?.parentExpectation ||
    t("Gia đình chưa cập nhật kỳ vọng cho học sinh này.");

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("Cổng thông tin Phụ huynh")}
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            {t("Theo dõi tiến độ của con")} - {studentName} · {className}
          </p>
        </div>

        <button
          onClick={() => navigate?.("parent-messenger")}
          className="h-10 px-4 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 flex items-center gap-2"
        >
          <MessageSquare size={16} /> {t("Messenger")}
        </button>
      </div>

      {status === "error" && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-700">
          {t(error)}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Hồ sơ hướng nghiệp"
          value={`${student?.progress ?? 95}%`}
          sub="Gần hoàn thiện"
          icon={CheckCircle}
          color="green"
        />

        <StatCard
          title="Học lực"
          value={(student?.avg ?? 8.5).toFixed(1)}
          sub="Điểm trung bình"
          icon={BarChart2}
          color="blue"
        />

        <StatCard
          title="Nhóm ngành quan tâm"
          value={student?.careerFit || "KH & CN"}
          sub="Theo hồ sơ hướng nghiệp"
          icon={Star}
          color="navy"
        />

        <StatCard
          title="Buổi tư vấn"
          value="2 / 4"
          sub="Đã hoàn thành"
          icon={MessageSquare}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">
            {t("Phụ huynh nên làm gì tiếp theo?")}
          </h3>

          <div className="space-y-2.5">
            {[
              {
                task: "Trao đổi với con về ngành nghề đang quan tâm trong tuần này.",
                urgent: true,
              },
              {
                task: "Cùng con xem lại các hoạt động tham chiếu đã chọn cảm xúc.",
                urgent: false,
              },
              {
                task: "Nhắn tin cho cố vấn nếu gia đình có thay đổi về định hướng.",
                urgent: false,
              },
              {
                task: "Cập nhật kỳ vọng gia đình để cố vấn có thêm bối cảnh tư vấn.",
                urgent: false,
              },
            ].map((item) => (
              <div
                key={item.task}
                className={`flex items-start gap-3 p-3 rounded-xl ${item.urgent ? "bg-amber-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}
              >
                {item.urgent ? (
                  <AlertTriangle
                    size={14}
                    className="text-amber-500 mt-0.5 flex-shrink-0"
                  />
                ) : (
                  <ArrowRight
                    size={14}
                    className="text-gray-400 mt-0.5 flex-shrink-0"
                  />
                )}

                <p className="text-sm text-gray-700">{t(item.task)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-gray-800">
                {t("Cập nhật kỳ vọng gia đình")}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {t("Thông tin này được lưu vào hồ sơ học sinh.")}
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="h-9 px-3 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 flex items-center gap-1.5"
              >
                <Edit2 size={14} /> {t("Edit")}
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("Mức tài chính gia đình")}
              </label>
              <div className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700">
                {student?.parentFinanceLevel || t("Chưa cập nhật")}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("Kỳ vọng của gia đình")}
              </label>
              {editing ? (
                <textarea
                  rows={5}
                  value={expectationDraft}
                  onChange={(event) => setExpectationDraft(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                />
              ) : (
                <div className="min-h-[112px] px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 whitespace-pre-line">
                  {expectation}
                </div>
              )}
            </div>

            {editing && (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <X size={15} /> {t("Huỷ")}
                </button>
                <button
                  onClick={saveExpectation}
                  disabled={status === "saving"}
                  className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Save size={15} />{" "}
                  {status === "saving" ? t("Đang lưu") : t("Save")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
        <Lock size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />

        <div>
          <p className="text-sm font-bold text-amber-800">
            {t("Lưu ý về dữ liệu Wellbeing")}
          </p>

          <p className="text-xs text-amber-700 mt-0.5">
            {t("Một số thông tin sức khỏe tinh thần của con không được hiển thị để bảo vệ quyền riêng tư của con em. Nếu cần biết thêm, vui lòng liên hệ trực tiếp với cố vấn hướng nghiệp tại trường.")}
          </p>
        </div>
      </div>
    </div>
  );
};
