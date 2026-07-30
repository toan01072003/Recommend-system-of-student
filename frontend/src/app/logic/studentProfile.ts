import type { studentsInClass } from "../data";
import type { RecommendationHistoryEntry } from "../api/client";

export type StudentProfileRecord = (typeof studentsInClass)[number] & {
  currentExploredCareer?: string;
  latestRecommendCareer?: string;
  recommendHistory?: RecommendationHistoryEntry[];
  skillMap?: Array<{ skill: string; score: number; fullMark: number }>;
};

export const resolveStudentProfile = (
  students: StudentProfileRecord[],
  studentId?: string,
) => {
  if (!studentId) return students[0];

  return students.find((student) => student.id === studentId) ?? students[0];
};

export const hasStudentProfileDetail = (
  student?: StudentProfileRecord | null,
) =>
  Boolean(
    student &&
      Array.isArray(student.academicTrend) &&
      Array.isArray(student.scores),
  );
