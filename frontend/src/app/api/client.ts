export type RecommendationResult = {
  rank: number;
  soc_code: string;
  title: string;
  score: number;
  vector: Record<string, number>;
};

export type RecommendationResponse = {
  student_vector: Record<string, number>;
  results: RecommendationResult[];
  saved?: boolean;
  latestRecommendCareer?: string;
  recommendHistory?: RecommendationHistoryEntry[];
};

export type RecommendationHistoryEntry = {
  createdAt: string;
  latestCareer: string;
  studentVector: Record<string, number>;
  results: RecommendationResult[];
};

export type QuestionItem = {
  id: number;
  area: string;
  text: string;
  source: string;
};

export type QuestionsResponse = {
  questions?: QuestionItem[];
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }

  return payload as T;
}

export function fetchAppData<T>(signal?: AbortSignal): Promise<T> {
  return requestJson<T>("/api/app-data", { signal });
}

export function fetchStudent<T>(
  studentId: string,
  signal?: AbortSignal,
): Promise<T> {
  return requestJson<T>(`/api/students/${encodeURIComponent(studentId)}`, {
    signal,
  });
}

export function fetchRecommendation(
  answers: number[],
  signal?: AbortSignal,
): Promise<RecommendationResponse> {
  return requestJson<RecommendationResponse>("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
    signal,
  });
}

export function fetchStudentRecommendation<TStudent>(
  student: TStudent,
  signal?: AbortSignal,
  options?: { persist?: boolean },
): Promise<RecommendationResponse> {
  return requestJson<RecommendationResponse>("/api/student-recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student, persist: options?.persist ?? false }),
    signal,
  });
}

export function fetchQuestions(
  signal?: AbortSignal,
): Promise<QuestionsResponse> {
  return requestJson<QuestionsResponse>("/api/questions", { signal });
}
