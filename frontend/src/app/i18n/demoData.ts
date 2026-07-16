import { useMemo } from "react";
import {
  ACADEMIC_HISTORY,
  CLUSTER_OPTS,
  CONTACTS_FOR_COUNSELOR,
  CONTACTS_FOR_STUDENT,
  DEMAND_OPTIONS,
  EDU_OPTS,
  EXPLORE_CAREERS,
  EXPLORE_FIELDS,
  INITIAL_MESSAGES,
  INTEREST_CHIPS,
  KID_CARDS,
  PERSONALITY_OPTS,
  QUIZ_QUESTIONS,
  REACTIONS,
  SAMPLE_NOTES,
  SUBJECTS,
  SUBJECT_OPTS,
  SURVEY_COMPLETED_RESULTS,
  UNI_REACTIONS,
  UNI_TYPES,
  UNIVERSITIES,
} from "../data";
import { translateStaticText, type Language } from "./dictionary";
import { useLanguage } from "./LanguageProvider";

const structuralKeys = new Set([
  "id",
  "cls",
  "avatar",
  "color",
  "fieldColor",
  "from",
  "grad",
  "photo",
  "to",
  "typeColor",
  "uniId",
  "val",
  "value",
  "coverPhoto",
  "videoThumb",
]);

const urlLike = (value: string) =>
  /^https?:\/\//.test(value) || /^#[0-9A-Fa-f]{3,8}$/.test(value);

const localizeValue = (value: unknown, language: Language, key?: string): any => {
  if (typeof value === "string") {
    if (key && structuralKeys.has(key)) return value;
    if (urlLike(value)) return value;
    return translateStaticText(value, language);
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeValue(item, language));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        localizeValue(entryValue, language, entryKey),
      ]),
    );
  }

  return value;
};

export const translateDataLabel = (value: string, language: Language) =>
  translateStaticText(value, language);

export const localizeDemoData = (language: Language) => ({
  EXPLORE_CAREERS: localizeValue(EXPLORE_CAREERS, language) as typeof EXPLORE_CAREERS,
  EXPLORE_FIELDS: localizeValue(EXPLORE_FIELDS, language) as typeof EXPLORE_FIELDS,
  REACTIONS: localizeValue(REACTIONS, language) as typeof REACTIONS,
  UNIVERSITIES: localizeValue(UNIVERSITIES, language) as typeof UNIVERSITIES,
  UNI_TYPES: localizeValue(UNI_TYPES, language) as typeof UNI_TYPES,
  UNI_REACTIONS: localizeValue(UNI_REACTIONS, language) as typeof UNI_REACTIONS,
  CONTACTS_FOR_STUDENT: localizeValue(
    CONTACTS_FOR_STUDENT,
    language,
  ) as typeof CONTACTS_FOR_STUDENT,
  CONTACTS_FOR_COUNSELOR: localizeValue(
    CONTACTS_FOR_COUNSELOR,
    language,
  ) as typeof CONTACTS_FOR_COUNSELOR,
  INITIAL_MESSAGES: localizeValue(
    INITIAL_MESSAGES,
    language,
  ) as typeof INITIAL_MESSAGES,
  SAMPLE_NOTES: localizeValue(SAMPLE_NOTES, language) as typeof SAMPLE_NOTES,
  SURVEY_COMPLETED_RESULTS: localizeValue(
    SURVEY_COMPLETED_RESULTS,
    language,
  ) as typeof SURVEY_COMPLETED_RESULTS,
  SUBJECTS: localizeValue(SUBJECTS, language) as typeof SUBJECTS,
  ACADEMIC_HISTORY: localizeValue(
    ACADEMIC_HISTORY,
    language,
  ) as typeof ACADEMIC_HISTORY,
  DEMAND_OPTIONS: localizeValue(DEMAND_OPTIONS, language) as typeof DEMAND_OPTIONS,
  PERSONALITY_OPTS: localizeValue(
    PERSONALITY_OPTS,
    language,
  ) as typeof PERSONALITY_OPTS,
  CLUSTER_OPTS: localizeValue(CLUSTER_OPTS, language) as typeof CLUSTER_OPTS,
  SUBJECT_OPTS: localizeValue(SUBJECT_OPTS, language) as typeof SUBJECT_OPTS,
  EDU_OPTS: localizeValue(EDU_OPTS, language) as typeof EDU_OPTS,
  INTEREST_CHIPS: localizeValue(INTEREST_CHIPS, language) as typeof INTEREST_CHIPS,
  KID_CARDS: localizeValue(KID_CARDS, language) as typeof KID_CARDS,
  QUIZ_QUESTIONS: localizeValue(QUIZ_QUESTIONS, language) as typeof QUIZ_QUESTIONS,
});

export const useLocalizedDemoData = () => {
  const { language } = useLanguage();
  return useMemo(() => localizeDemoData(language), [language]);
};

