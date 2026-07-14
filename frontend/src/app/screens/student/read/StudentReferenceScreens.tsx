import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import {
  fetchStudentCommonReferences,
  syncReferenceActions,
  type StudentCommonReferenceItem,
} from "../../../api/client";
import {
  careerReferenceActions,
  currentStudentReferenceId,
  referenceEmotionMeta,
} from "../../../logic/referenceActions";

export const StudentReferences = () => {
  const [references, setReferences] = useState<StudentCommonReferenceItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [unmappedCount, setUnmappedCount] = useState(0);
  const studentId = currentStudentReferenceId();

  const loadReferences = (signal?: AbortSignal) => {
    setStatus("loading");
    setError("");
    const actions = careerReferenceActions();
    return syncReferenceActions(actions, signal)
      .catch(() => ({ actions }))
      .then(() => fetchStudentCommonReferences(studentId, signal))
      .then((payload) => {
        setReferences(payload.references);
        setUnmappedCount(payload.unmappedActionIds.length);
        setStatus("ready");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "Không tải được References.");
        setStatus("error");
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadReferences(controller.signal);
    return () => controller.abort();
  }, [studentId]);

  const grouped = useMemo(() => {
    const groups = new Map<string, StudentCommonReferenceItem[]>();
    references.forEach((item) => {
      const key = item.groupName;
      groups.set(key, [...(groups.get(key) ?? []), item]);
    });
    return Array.from(groups.entries()).map(([groupName, items]) => ({
      groupName,
      items,
    }));
  }, [references]);

  const answeredCount = references.filter((item) => item.emotion).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">References</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cảm xúc tổng hợp của bạn với 97 hành động chung.
          </p>
        </div>
        <button
          onClick={() => loadReferences()}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Cập nhật
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500">Đã phản hồi</p>
          <p className="text-2xl font-black text-gray-900 mt-1">
            {answeredCount}/{references.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500">Nhóm hành động</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{grouped.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-500">Chưa map</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{unmappedCount}</p>
        </div>
      </div>

      {status === "error" && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {status === "loading" && references.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">
          Đang tải References...
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.groupName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-900">{group.groupName}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {group.items.filter((item) => item.emotion).length}/{group.items.length} hành động đã có cảm xúc
                  </p>
                </div>
                <BookOpen size={16} className="text-orange-500" />
              </div>
              <div className="divide-y divide-gray-50">
                {group.items.map((item) => {
                  const emotion = referenceEmotionMeta(item.emotion);
                  return (
                    <div key={item.commonActionId} className="flex items-center gap-3 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.description || "Hành động chung"} · {item.evidenceCount ?? 0} bằng chứng
                          {item.score ? ` · Điểm ${item.score.toFixed(2)}` : ""}
                        </p>
                      </div>
                      {emotion ? (
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${emotion.color}`}>
                          {emotion.icon} {emotion.label}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-bold text-gray-500">
                          Chưa chọn
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
