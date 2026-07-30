import React, { useMemo, useState } from "react";
import {
  FileText,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react";
import {
  createFamilyNote,
  fetchFamilies,
  fetchFamilyNotes,
  type FamilyNoteRecord,
  type FamilyRecord,
} from "../../../api/client";
import { useLanguage } from "../../../i18n";

const DEFAULT_COUNSELOR_ID = "COUNSELOR001";

type Navigate = (
  target: string,
  params?: { studentId?: string; parentId?: string },
) => void;

const relationshipLabel: Record<string, string> = {
  father: "Bố",
  mother: "Mẹ",
  guardian: "Người giám hộ",
};

export const CounselorFamilies = ({ navigate }: { navigate: Navigate }) => {
  const { t, formatDateTime } = useLanguage();
  const [families, setFamilies] = useState<FamilyRecord[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");
  const [activeFamily, setActiveFamily] = useState<FamilyRecord | null>(null);
  const [notes, setNotes] = useState<FamilyNoteRecord[]>([]);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteStatus, setNoteStatus] = useState<
    "idle" | "loading" | "saving" | "error"
  >("idle");
  const [noteError, setNoteError] = useState("");

  const formatNullableDateTime = (value?: string | null) => {
    if (!value) return t("Chưa liên hệ");
    return formatDateTime(value, {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const loadFamilies = (signal?: AbortSignal) => {
    setStatus("loading");
    setError("");
    fetchFamilies({ counselorId: DEFAULT_COUNSELOR_ID }, signal)
      .then((payload) => {
        setFamilies(payload.families);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được danh sách phụ huynh.");
        setStatus("error");
      });
  };

  React.useEffect(() => {
    const controller = new AbortController();
    loadFamilies(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredFamilies = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return families;

    return families.filter((family) =>
      [
        family.parentName,
        family.studentName,
        family.className,
        family.phone,
        family.email,
        family.occupation,
        family.jobPosition,
        family.workplace,
        family.parentExpectation,
        family.parentFinanceLevel,
        family.latestNoteSummary,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword)),
    );
  }, [families, search]);

  const loadNotes = (family: FamilyRecord) => {
    setNoteStatus("loading");
    setNoteError("");
    setNotes([]);
    fetchFamilyNotes({
      parentId: family.parentId,
      studentId: family.studentId,
      counselorId: family.counselorId || DEFAULT_COUNSELOR_ID,
    })
      .then((payload) => {
        setNotes(payload.notes);
        setNoteStatus("idle");
      })
      .catch((err) => {
        setNoteError(err.message || "Không tải được family note.");
        setNoteStatus("error");
      });
  };

  const openNotes = (family: FamilyRecord) => {
    setActiveFamily(family);
    setNoteDraft("");
    loadNotes(family);
  };

  const closeNotes = () => {
    setActiveFamily(null);
    setNotes([]);
    setNoteDraft("");
    setNoteError("");
    setNoteStatus("idle");
  };

  const saveNote = () => {
    if (!activeFamily || !noteDraft.trim()) return;
    setNoteStatus("saving");
    setNoteError("");
    createFamilyNote({
      parentId: activeFamily.parentId,
      studentId: activeFamily.studentId,
      counselorId: activeFamily.counselorId || DEFAULT_COUNSELOR_ID,
      body: noteDraft.trim(),
    })
      .then((payload) => {
        setNotes((items) => [payload.note, ...items]);
        setNoteDraft("");
        setNoteStatus("idle");
        loadFamilies();
      })
      .catch((err) => {
        setNoteError(err.message || "Không lưu được family note.");
        setNoteStatus("error");
      });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {t("Gia đình học sinh")}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {families.length} {t("phụ huynh thuộc học sinh đang quản lý")}
          </p>
        </div>

        <button
          onClick={() => loadFamilies()}
          className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw size={15} /> {t("Tải lại")}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("Tìm phụ huynh, học sinh, SĐT, email, nơi làm...")}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <span className="text-xs font-semibold text-gray-500">
            {filteredFamilies.length} / {families.length} {t("kết quả")}
          </span>
        </div>

        {status === "error" && (
          <div className="m-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-700">
            {t(error)}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1320px] text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">{t("Phụ huynh")}</th>
                <th className="px-4 py-3 text-left">{t("PH của học sinh")}</th>
                <th className="px-4 py-3 text-left">{t("SĐT")}</th>
                <th className="px-4 py-3 text-left">{t("Email")}</th>
                <th className="px-4 py-3 text-left">{t("Công việc")}</th>
                <th className="px-4 py-3 text-left">
                  {t("Kỳ vọng gia đình")}
                </th>
                <th className="px-4 py-3 text-left">
                  {t("Liên hệ lần cuối")}
                </th>
                <th className="px-4 py-3 text-left">{t("Tóm tắt note")}</th>
                <th className="px-4 py-3 text-right">{t("Thao tác")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {status === "loading" && families.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    {t("Đang tải danh sách phụ huynh...")}
                  </td>
                </tr>
              ) : filteredFamilies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    {t("Không tìm thấy phụ huynh phù hợp.")}
                  </td>
                </tr>
              ) : (
                filteredFamilies.map((family) => (
                  <tr key={`${family.parentId}:${family.studentId}`}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">
                        {family.parentName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t(relationshipLabel[family.relationship] || family.relationship)}
                        {family.isPrimary ? ` · ${t("Liên hệ chính")}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-blue-700">
                        {family.studentName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {family.className || t("Chưa có lớp")}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700">
                      {family.phone || t("Chưa có")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {family.email || t("Chưa có")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">
                        {family.occupation || t("Chưa có")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {family.jobPosition || t("Chưa có vị trí")}
                      </div>
                      <div className="text-xs text-gray-400">
                        {family.workplace || t("Chưa có nơi làm")}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[220px] text-gray-700 line-clamp-2">
                        {family.parentExpectation || t("Chưa cập nhật")}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {t("Mức tài chính")}:{" "}
                        {family.parentFinanceLevel || t("Chưa cập nhật")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatNullableDateTime(family.lastContactAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs text-gray-600 line-clamp-2">
                        {family.latestNoteSummary || t("Chưa có note")}
                      </div>
                      {family.noteCount > 0 && (
                        <span className="text-xs font-semibold text-gray-400">
                          {family.noteCount} {t("note")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate("co-messenger", {
                              parentId: family.parentId,
                              studentId: family.studentId,
                            })
                          }
                          className="h-9 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
                        >
                          <MessageSquare size={14} /> {t("Nhắn tin")}
                        </button>
                        <button
                          onClick={() => openNotes(family)}
                          className="h-9 px-3 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 flex items-center gap-1.5"
                        >
                          <FileText size={14} /> {t("Note")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeFamily && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-gray-900">
                  {t("Family note")} · {activeFamily.parentName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {t("PH của")} {activeFamily.studentName} ·{" "}
                  {activeFamily.className || t("Chưa có lớp")}
                </p>
              </div>
              <button
                onClick={closeNotes}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                title={t("Đóng")}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  {t("Thêm ghi chú mới")}
                </label>
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  rows={4}
                  placeholder={t("Nhập ghi chú sau lần trao đổi với phụ huynh...")}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  {noteError ? (
                    <span className="text-xs font-semibold text-red-600">
                      {t(noteError)}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {t("Note được lưu riêng cho cặp phụ huynh-học sinh này.")}
                    </span>
                  )}
                  <button
                    onClick={saveNote}
                    disabled={!noteDraft.trim() || noteStatus === "saving"}
                    className="h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {noteStatus === "saving" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    {t("Lưu note")}
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    {t("Lịch sử note")}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {notes.length} {t("note")}
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {noteStatus === "loading" ? (
                    <div className="p-5 text-sm text-gray-500">
                      {t("Đang tải family note...")}
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="p-5 text-sm text-gray-500">
                      {t("Chưa có note nào cho phụ huynh này.")}
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="text-xs font-semibold text-gray-500">
                            {note.counselorName}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {formatNullableDateTime(note.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {note.body}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
