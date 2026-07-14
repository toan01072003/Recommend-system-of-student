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

export type MeetingType = "offline" | "online";

export type MeetingRecord = {
  id: number;
  studentId: string;
  studentName: string;
  className?: string;
  counselorId: string;
  counselorName: string;
  topic: string;
  meetingType: MeetingType;
  meetingUrl?: string;
  scheduledAt: string;
  status: string;
  studentSeenAt?: string | null;
  createdAt: string;
};

export type MeetingsResponse = {
  meetings: MeetingRecord[];
};

export type CreateMeetingPayload = {
  studentId: string;
  counselorId?: string;
  topic: string;
  meetingType: MeetingType;
  meetingUrl?: string;
  scheduledAt: string;
  counselorName?: string;
};

export type CreateMeetingResponse = {
  meeting: MeetingRecord;
};

export type MessageRole = "student" | "counselor";

export type MessageRecord = {
  id: number;
  studentId: string;
  studentName: string;
  className?: string;
  counselorId: string;
  counselorName: string;
  senderRole: MessageRole;
  text: string;
  sentAt: string;
  studentSeenAt?: string | null;
  counselorSeenAt?: string | null;
};

export type MessagesResponse = {
  messages: MessageRecord[];
};

export type CreateMessagePayload = {
  studentId: string;
  counselorId?: string;
  counselorName?: string;
  senderRole: MessageRole;
  text: string;
};

export type AdvicePriority = "high" | "medium" | "low";

export type AdviceNoteRecord = {
  id: number;
  studentId: string;
  studentName: string;
  className?: string;
  counselorId: string;
  counselorName: string;
  title: string;
  body: string;
  priority: AdvicePriority;
  studentSeenAt?: string | null;
  createdAt: string;
};

export type AdviceNotesResponse = {
  notes: AdviceNoteRecord[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type CreateAdviceNotePayload = {
  studentId: string;
  counselorId?: string;
  counselorName?: string;
  title: string;
  body: string;
  priority: AdvicePriority;
};

export type ReferenceEmotion = "hate" | "dislike" | "neutral" | "like" | "passion";

export type ReferenceAction = {
  actionId: string;
  careerId: string;
  careerName: string;
  field?: string;
  label: string;
  sortOrder: number;
};

export type StudentReferenceItem = ReferenceAction & {
  emotion?: ReferenceEmotion | null;
  updatedAt?: string | null;
};

export type StudentReferencesResponse = {
  student?: {
    id: string;
    name: string;
    className?: string;
  };
  actions: ReferenceAction[];
  references: StudentReferenceItem[];
};

export type SurveyQuestionType = "scale" | "single_choice" | "multiple_choice" | "text";

export type SurveyAnswerValue = string | number | Array<string | number>;

export type SurveyAnswerOption = {
  value: string | number;
  label: string;
};

export type SurveyQuestion = {
  id: string;
  text: string;
  type: SurveyQuestionType | string;
  area?: string;
  options?: SurveyAnswerOption[];
};

export type SurveyStatus = "draft" | "scheduled" | "active" | "closed";

export type SurveyResultRecord = {
  id: number;
  surveyId: number;
  studentId: string;
  studentName: string;
  className?: string;
  answers: Array<{ questionId: string; value: SurveyAnswerValue }>;
  result: {
    answeredCount?: number;
    totalQuestions?: number;
    averageScore?: number | null;
    dimensionScores?: Record<string, number>;
    topDimensions?: string[];
    summary?: string;
  };
  submittedAt: string;
};

export type SurveyAssigneeRecord = {
  studentId: string;
  studentName: string;
  className?: string;
  grade?: number;
  status: "pending" | "completed";
  submittedAt?: string | null;
  result?: SurveyResultRecord["result"] | null;
};

export type SurveyRecord = {
  id: number;
  counselorId: string;
  counselorName: string;
  title: string;
  description?: string | null;
  questions: SurveyQuestion[];
  answerOptions: SurveyAnswerOption[];
  openAt: string;
  closeAt: string;
  status: SurveyStatus;
  storedStatus?: SurveyStatus;
  assignedStudentIds: string[];
  assignedCount: number;
  submittedCount: number;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
  studentCompleted?: boolean;
  studentResult?: SurveyResultRecord | null;
  assignees?: SurveyAssigneeRecord[];
  results?: SurveyResultRecord[];
};

export type SurveysResponse = {
  surveys: SurveyRecord[];
};

export type SurveyResponse = {
  survey: SurveyRecord;
};

export type CreateSurveyPayload = {
  counselorId?: string;
  title: string;
  description?: string;
  openAt: string;
  closeAt: string;
  status?: SurveyStatus;
  questions: SurveyQuestion[];
  answerOptions?: SurveyAnswerOption[];
  studentIds?: string[];
  classNames?: string[];
  grades?: number[];
};

export type SubmitSurveyPayload = {
  studentId: string;
  answers: Array<{ questionId: string; value: SurveyAnswerValue }>;
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

export function fetchReferenceActions(
  signal?: AbortSignal,
): Promise<{ actions: ReferenceAction[] }> {
  return requestJson<{ actions: ReferenceAction[] }>("/api/reference-actions", {
    signal,
  });
}

export function syncReferenceActions(
  actions: ReferenceAction[],
  signal?: AbortSignal,
): Promise<{ actions: ReferenceAction[] }> {
  return requestJson<{ actions: ReferenceAction[] }>("/api/reference-actions/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actions }),
    signal,
  });
}

export function fetchStudentReferences(
  studentId: string,
  signal?: AbortSignal,
): Promise<StudentReferencesResponse> {
  return requestJson<StudentReferencesResponse>(
    `/api/student-references?student_id=${encodeURIComponent(studentId)}`,
    { signal },
  );
}

export function saveStudentReference(
  payload: {
    studentId: string;
    actionId: string;
    emotion: ReferenceEmotion;
    action?: ReferenceAction;
  },
  signal?: AbortSignal,
): Promise<{ studentId: string; action: ReferenceAction; reference: { actionId: string; emotion: ReferenceEmotion; updatedAt: string } }> {
  return requestJson<{ studentId: string; action: ReferenceAction; reference: { actionId: string; emotion: ReferenceEmotion; updatedAt: string } }>(
    "/api/student-references",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    },
  );
}

export function fetchStudent<T>(
  studentId: string,
  signal?: AbortSignal,
): Promise<T> {
  return requestJson<T>(`/api/students/${encodeURIComponent(studentId)}`, {
    signal,
  });
}

export function updateStudent<T>(
  studentId: string,
  payload: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  return requestJson<T>(`/api/students/${encodeURIComponent(studentId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

export function fetchSurveys(
  params: {
    role?: "student" | "counselor";
    studentId?: string;
    counselorId?: string;
  } = {},
  signal?: AbortSignal,
): Promise<SurveysResponse> {
  const search = new URLSearchParams();
  if (params.role) search.set("role", params.role);
  if (params.studentId) search.set("student_id", params.studentId);
  if (params.counselorId) search.set("counselor_id", params.counselorId);
  const query = search.toString();

  return requestJson<SurveysResponse>(
    `/api/surveys${query ? `?${query}` : ""}`,
    { signal },
  );
}

export function fetchSurvey(
  surveyId: number,
  signal?: AbortSignal,
): Promise<SurveyResponse> {
  return requestJson<SurveyResponse>(`/api/surveys/${surveyId}`, { signal });
}

export function createSurvey(
  payload: CreateSurveyPayload,
  signal?: AbortSignal,
): Promise<SurveyResponse> {
  return requestJson<SurveyResponse>("/api/surveys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function submitSurveyResult(
  surveyId: number,
  payload: SubmitSurveyPayload,
  signal?: AbortSignal,
): Promise<{ result: SurveyResultRecord }> {
  return requestJson<{ result: SurveyResultRecord }>(
    `/api/surveys/${surveyId}/results`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    },
  );
}

export function fetchMeetings(
  params: {
    role?: "student" | "counselor";
    studentId?: string;
    counselorId?: string;
  } = {},
  signal?: AbortSignal,
): Promise<MeetingsResponse> {
  const search = new URLSearchParams();
  if (params.role) search.set("role", params.role);
  if (params.studentId) search.set("student_id", params.studentId);
  if (params.counselorId) search.set("counselor_id", params.counselorId);
  const query = search.toString();

  return requestJson<MeetingsResponse>(
    `/api/meetings${query ? `?${query}` : ""}`,
    { signal },
  );
}

export function createMeeting(
  payload: CreateMeetingPayload,
  signal?: AbortSignal,
): Promise<CreateMeetingResponse> {
  return requestJson<CreateMeetingResponse>("/api/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function fetchMessages(
  params: {
    role?: MessageRole;
    studentId?: string;
    counselorId?: string;
  } = {},
  signal?: AbortSignal,
): Promise<MessagesResponse> {
  const search = new URLSearchParams();
  if (params.role) search.set("role", params.role);
  if (params.studentId) search.set("student_id", params.studentId);
  if (params.counselorId) search.set("counselor_id", params.counselorId);
  const query = search.toString();

  return requestJson<MessagesResponse>(
    `/api/messages${query ? `?${query}` : ""}`,
    { signal },
  );
}

export function createMessage(
  payload: CreateMessagePayload,
  signal?: AbortSignal,
): Promise<{ message: MessageRecord }> {
  return requestJson<{ message: MessageRecord }>("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function markMessagesSeen(
  payload: {
    role: MessageRole;
    studentId: string;
    counselorId?: string;
  },
  signal?: AbortSignal,
): Promise<MessagesResponse> {
  return requestJson<MessagesResponse>("/api/messages/seen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function fetchAdviceNotes(
  params: {
    studentId?: string;
    counselorId?: string;
    sort?: "newest" | "oldest" | "priority" | "student";
    page?: number;
    pageSize?: number;
  } = {},
  signal?: AbortSignal,
): Promise<AdviceNotesResponse> {
  const search = new URLSearchParams();
  if (params.studentId) search.set("student_id", params.studentId);
  if (params.counselorId) search.set("counselor_id", params.counselorId);
  if (params.sort) search.set("sort", params.sort);
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("page_size", String(params.pageSize));
  const query = search.toString();

  return requestJson<AdviceNotesResponse>(
    `/api/advice-notes${query ? `?${query}` : ""}`,
    { signal },
  );
}

export function createAdviceNote(
  payload: CreateAdviceNotePayload,
  signal?: AbortSignal,
): Promise<{ note: AdviceNoteRecord }> {
  return requestJson<{ note: AdviceNoteRecord }>("/api/advice-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function deleteAdviceNote(
  noteId: number,
  params: { counselorId?: string } = {},
  signal?: AbortSignal,
): Promise<{ deleted: boolean; id: number }> {
  const search = new URLSearchParams();
  if (params.counselorId) search.set("counselor_id", params.counselorId);
  const query = search.toString();

  return requestJson<{ deleted: boolean; id: number }>(
    `/api/advice-notes/${noteId}${query ? `?${query}` : ""}`,
    {
      method: "DELETE",
      signal,
    },
  );
}
