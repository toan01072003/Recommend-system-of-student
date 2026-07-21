import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Target } from "lucide-react";
import {
  fetchQuestions,
  fetchRecommendation,
  type RecommendationResponse,
} from "../../api/client";
import type { studentsInClass } from "../../data";
import {
  RIASEC_META,
  buildRecommendationAnswers,
  recommendationAssessment,
} from "../../logic/recommendation";
import { useT } from "../../i18n";

type StudentProfile = (typeof studentsInClass)[number];

export const StudentRecommendationPanel = ({
  student,
}: {
  student: StudentProfile;
}) => {
  const t = useT();
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [recommendationError, setRecommendationError] = useState("");
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    if (recommendationStatus !== "idle") return;
    if (student.testStatus !== "Hoàn thành") return;

    const controller = new AbortController();
    setRecommendationStatus("loading");
    setRecommendationError("");

    Promise.all([
      fetchRecommendation(
        buildRecommendationAnswers(student),
        controller.signal,
      ),
      fetchQuestions(controller.signal),
    ])
      .then(([recommendData, questionData]) => {
        setQuestionCount(questionData.questions?.length ?? null);
        setRecommendation(recommendData);
        setRecommendationStatus("success");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setRecommendationError(
          error.message || t("Không kết nối được backend recommendation."),
        );
        setRecommendationStatus("error");
      });

    return () => controller.abort();
  }, [recommendationStatus, student, t]);

  return (
    <div className="space-y-5">
      {student.testStatus !== "Hoàn thành" ? (
        <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                {t("Chưa có kết quả gợi ý")}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {t("Học sinh cần hoàn thành bài test Holland/RIASEC trước khi hệ thống tạo gợi ý nghề nghiệp.")}
              </p>
            </div>
          </div>
        </div>
      ) : recommendationStatus === "loading" ? (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">
            {t("Đang lấy kết quả từ recommendation engine...")}
          </p>
        </div>
      ) : recommendationStatus === "error" ? (
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">
                {t("Không lấy được kết quả")}
              </h3>
              <p className="text-sm text-red-600 mt-0.5">
                {recommendationError}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("Kiểm tra backend đang chạy tại cổng 8001.")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        recommendation && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">
                    {t("Gợi ý nghề nghiệp từ RIASEC")}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("Nguồn")}: {questionCount ?? 60}{" "}
                    {t("câu O*NET Interest Profiler và")} `career_vectors_onet.csv`.
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  {t("Đã tính toán")}
                </span>
              </div>
              <div className="space-y-3">
                {recommendation.results.slice(0, 5).map((item) => (
                  <div
                    key={item.soc_code}
                    className="p-3.5 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black flex-shrink-0">
                        {item.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-800 leading-snug">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">
                              {item.soc_code}
                            </p>
                          </div>
                          <span className="text-sm font-black text-indigo-700 bg-indigo-100 px-2 py-1 rounded-lg">
                            {Math.round(item.score * 100)}%
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-6 gap-1.5">
                          {Object.entries(item.vector).map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-white border border-gray-100 rounded-lg px-2 py-1.5 text-center"
                            >
                              <p
                                className="text-xs font-bold"
                                style={{ color: RIASEC_META[key]?.color }}
                              >
                                {key}
                              </p>
                              <p className="text-xs font-mono text-gray-600">
                                {Number(value).toFixed(1)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4">
                  {t("Vector học sinh")}
                </h3>
                <div className="space-y-3">
                  {Object.entries(recommendation.student_vector).map(
                    ([key, value]) => {
                      const maxValue = Math.max(
                        ...Object.values(recommendation.student_vector),
                      );
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-gray-600">
                              {key} · {RIASEC_META[key]?.label}
                            </span>
                            <span className="text-xs font-mono font-bold text-gray-700">
                              {value}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.max(8, (value / maxValue) * 100)}%`,
                                backgroundColor: RIASEC_META[key]?.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">
                  {t("Đánh giá cố vấn")}
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {recommendationAssessment(student, recommendation)}
                </p>
                <div className="mt-4 space-y-2 text-xs text-blue-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={13} className="mt-0.5 flex-shrink-0" />
                    <span>
                      {t("Ưu tiên trao đổi về nhóm nghề top 3 và điều kiện học tập cần chuẩn bị.")}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target size={13} className="mt-0.5 flex-shrink-0" />
                    <span>
                      {t("Đối chiếu thêm điểm học tập, sở thích cá nhân và kỳ vọng phụ huynh trước khi chốt lộ trình.")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
