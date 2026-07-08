import type { RecommendationResponse } from "../api/client";
import type { studentsInClass } from "../data";

type StudentProfile = (typeof studentsInClass)[number];

export const RIASEC_META: Record<string, { label: string; color: string }> = {
  R: { label: "Realistic", color: "#F97316" },
  I: { label: "Investigative", color: "#3B82F6" },
  A: { label: "Artistic", color: "#8B5CF6" },
  S: { label: "Social", color: "#EC4899" },
  E: { label: "Enterprising", color: "#F59E0B" },
  C: { label: "Conventional", color: "#10B981" },
};

export const buildRecommendationAnswers = (student: StudentProfile) => {
  const profile = student.careerFit.toLowerCase();
  const weights: Record<string, number> = {
    R: 3,
    I: 3,
    A: 3,
    S: 3,
    E: 3,
    C: 3,
  };

  if (
    profile.includes("công nghệ") ||
    profile.includes("kỹ thuật") ||
    profile.includes("thực hành")
  ) {
    Object.assign(weights, { R: 4, I: 5, A: 3, S: 2, E: 3, C: 5 });
  } else if (
    profile.includes("kinh tế") ||
    profile.includes("lãnh đạo") ||
    profile.includes("tc")
  ) {
    Object.assign(weights, { R: 2, I: 4, A: 3, S: 3, E: 5, C: 5 });
  } else if (profile.includes("y tế") || profile.includes("dịch vụ")) {
    Object.assign(weights, { R: 3, I: 5, A: 2, S: 5, E: 3, C: 4 });
  } else if (profile.includes("nghệ thuật")) {
    Object.assign(weights, { R: 2, I: 3, A: 5, S: 4, E: 3, C: 2 });
  } else if (profile.includes("giáo dục")) {
    Object.assign(weights, { R: 2, I: 3, A: 3, S: 5, E: 4, C: 3 });
  } else if (profile.includes("nghiên cứu") || profile.includes("phân tích")) {
    Object.assign(weights, { R: 2, I: 5, A: 3, S: 2, E: 3, C: 4 });
  } else if (profile.includes("hành chính") || profile.includes("dữ liệu")) {
    Object.assign(weights, { R: 2, I: 3, A: 2, S: 3, E: 3, C: 5 });
  }

  const order = ["R", "I", "A", "S", "E", "C"];
  return Array.from({ length: 60 }, (_, idx) => {
    const base = weights[order[idx % order.length]];
    const variation =
      (student.id.charCodeAt(student.id.length - 1) + idx) % 3 === 0 ? -1 : 0;
    return Math.min(5, Math.max(1, base + variation));
  });
};

export const recommendationAssessment = (
  student: StudentProfile,
  recommendation: RecommendationResponse | null,
) => {
  if (!recommendation?.results.length)
    return "Chưa đủ dữ liệu để tạo đánh giá.";
  const top = recommendation.results[0];
  const strongest = Object.entries(recommendation.student_vector)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([key]) => key)
    .join("-");
  return `${student.name} đang nổi bật ở nhóm ${strongest}. Nghề phù hợp nhất hiện tại là ${top.title} với độ khớp ${Math.round(top.score * 100)}%.`;
};

export const scoreTone = (score: number) =>
  score >= 8.5 ? "strong" : score < 6.5 ? "weak" : "neutral";

export const buildStudentSkillRadar = (student: StudentProfile) => [
  {
    skill: "Tư duy logic",
    score: Math.min(100, Math.max(40, student.iq - 20)),
    fullMark: 100,
  },
  {
    skill: "Giao tiếp",
    score: Math.min(100, Math.max(40, student.eq)),
    fullMark: 100,
  },
  { skill: "Học thuật", score: Math.round(student.avg * 10), fullMark: 100 },
  {
    skill: "Tự tin",
    score:
      student.confidenceLevel === "High"
        ? 88
        : student.confidenceLevel === "Medium"
          ? 70
          : 52,
    fullMark: 100,
  },
  {
    skill: "Độc lập",
    score:
      student.workStyle === "Independent"
        ? 82
        : student.workStyle === "Balanced"
          ? 68
          : 62,
    fullMark: 100,
  },
  { skill: "RIASEC Fit", score: student.riasecTop3 ? 86 : 60, fullMark: 100 },
];

export const buildStudentCareerMatches = (student: StudentProfile) => {
  const careers = [student.favoriteCareer, ...student.exploredCareers].filter(
    Boolean,
  );
  return Array.from(new Set(careers))
    .slice(0, 5)
    .map((career, idx) => ({
      career,
      score: Math.max(62, 94 - idx * 6),
    }));
};
