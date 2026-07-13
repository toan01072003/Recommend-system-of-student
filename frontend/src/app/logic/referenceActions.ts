import { EXPLORE_CAREERS } from "../data";
import type { ReferenceAction, ReferenceEmotion } from "../api/client";

export const STUDENT_REFERENCE_FALLBACK_ID = "STU006";

export const REFERENCE_EMOTIONS: Array<{
  value: ReferenceEmotion;
  label: string;
  icon: string;
  color: string;
}> = [
  { value: "hate", label: "Ghét", icon: "😣", color: "bg-red-50 text-red-700 border-red-200" },
  { value: "dislike", label: "Hơi ghét", icon: "🙁", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "neutral", label: "Bình thường", icon: "😐", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { value: "like", label: "Thích", icon: "🙂", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "passion", label: "Đam mê", icon: "😍", color: "bg-pink-50 text-pink-700 border-pink-200" },
];

export const referenceEmotionMeta = (emotion?: string | null) =>
  REFERENCE_EMOTIONS.find((item) => item.value === emotion) ?? null;

export const currentStudentReferenceId = () =>
  window.localStorage.getItem("studentPortalSurveyStudentId") ||
  window.localStorage.getItem("studentPortalMeetingStudentId") ||
  STUDENT_REFERENCE_FALLBACK_ID;

export const careerReferenceActions = (): ReferenceAction[] =>
  EXPLORE_CAREERS.flatMap((career) =>
    career.activities.map((activity, index) => ({
      actionId: `${career.id}:${activity.id}`,
      careerId: career.id,
      careerName: career.name,
      field: career.field,
      label: activity.label,
      sortOrder: index + 1,
    })),
  );

export const actionKey = (careerId: string, activityId: string) =>
  `${careerId}:${activityId}`;
