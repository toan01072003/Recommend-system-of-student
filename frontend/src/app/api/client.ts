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
  meetingNote?: string | null;
  studentSeenAt?: string | null;
  createdAt: string;
};

export type MeetingsResponse = {
  meetings: MeetingRecord[];
};

export type MeetingCandidateReason = {
  code: string;
  label: string;
  points: number;
  evidence: string;
};

export type MeetingPriority = "high" | "medium" | "low";

export type MeetingCandidateExplanation = {
  algorithm: string;
  summary: string;
  breakdown: Record<string, number>;
  scoreSources: MeetingCandidateScoreSources;
  confidence: "high" | "medium" | "low" | string;
  nextAction: string;
  suggestedTopic: string;
  reviewRequired: boolean;
};

export type MeetingCandidateScoreSources = {
  rules: number;
  ai: number;
  total: number;
  aiProvider?: string | null;
  aiModel?: string | null;
  aiError?: string | null;
};

export type MeetingCandidateAiSignal = {
  code: string;
  category: string;
  severity: "low" | "medium" | "high" | string;
  points: number;
  evidence: string;
  confidence: number;
  source: string;
};

export type SupportMeetingCandidate = {
  studentId: string;
  studentName: string;
  className?: string;
  grade?: number;
  avg: number;
  scoreTrend: number;
  risk?: string;
  stressLevel?: string;
  academicPressureLevel?: string;
  confidenceLevel?: string;
  priorityScore: number;
  priority: MeetingPriority;
  reasons: MeetingCandidateReason[];
  aiSignals: MeetingCandidateAiSignal[];
  scoreSources: MeetingCandidateScoreSources;
  suggestedTopic: string;
  explanation: MeetingCandidateExplanation;
  hasUpcomingMeeting: boolean;
  nextMeetingAt?: string | null;
};

export type CareerCounselingCandidate = {
  studentId: string;
  studentName: string;
  className?: string;
  grade?: number;
  avg: number;
  scoreTrend: number;
  priorityScore: number;
  priority: MeetingPriority;
  reasons: MeetingCandidateReason[];
  aiSignals: MeetingCandidateAiSignal[];
  scoreSources: MeetingCandidateScoreSources;
  suggestedTopic: string;
  explanation: MeetingCandidateExplanation;
  hasUpcomingMeeting: boolean;
  nextMeetingAt?: string | null;
  evidence: {
    riasecTop3?: string;
    favoriteCareer?: string;
    currentExploredCareer?: string;
    latestRecommendCareer?: string;
    likedGroup?: string | null;
    recommendGroup?: string | null;
    targetUniversityName?: string;
    targetUniversityProgram?: string;
    progress?: number;
    parentExpectation?: string;
  };
};

export type MeetingCandidatesResponse<TCandidate> = {
  candidates: TCandidate[];
  count: number;
  threshold: number;
};

export type CreateMeetingPayload = {
  studentId: string;
  counselorId?: string;
  topic: string;
  meetingType: MeetingType;
  meetingUrl?: string;
  scheduledAt: string;
  counselorName?: string;
  meetingNote?: string;
};

export type CreateMeetingResponse = {
  meeting: MeetingRecord;
};

export type UpdateMeetingPayload = Partial<{
  topic: string;
  meetingType: MeetingType;
  meetingUrl: string;
  scheduledAt: string;
  meetingNote: string;
}>;

export type MessageRole = "student" | "parent" | "counselor";
export type ConversationType = "student" | "parent";

export type MessageRecord = {
  id: number;
  conversationType: ConversationType;
  studentId: string;
  studentName: string;
  className?: string;
  parentId?: string | null;
  parentName?: string | null;
  counselorId: string;
  counselorName: string;
  senderRole: MessageRole;
  text: string;
  sentAt: string;
  studentSeenAt?: string | null;
  parentSeenAt?: string | null;
  counselorSeenAt?: string | null;
};

export type MessagesResponse = {
  messages: MessageRecord[];
};

export type CreateMessagePayload = {
  studentId: string;
  parentId?: string;
  conversationType?: ConversationType;
  counselorId?: string;
  counselorName?: string;
  senderRole: MessageRole;
  text: string;
};

export type FamilyRecord = {
  parentId: string;
  parentName: string;
  relationship: "father" | "mother" | "guardian" | string;
  isPrimary: boolean;
  phone?: string | null;
  email?: string | null;
  occupation?: string | null;
  jobPosition?: string | null;
  workplace?: string | null;
  studentId: string;
  studentName: string;
  className?: string | null;
  parentExpectation?: string | null;
  parentFinanceLevel?: string | null;
  counselorId: string;
  lastContactAt?: string | null;
  latestNoteSummary?: string | null;
  latestNoteAt?: string | null;
  noteCount: number;
};

export type FamiliesResponse = {
  families: FamilyRecord[];
};

export type FamilyNoteRecord = {
  id: number;
  parentId: string;
  studentId: string;
  counselorId: string;
  counselorName: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type FamilyNotesResponse = {
  notes: FamilyNoteRecord[];
};

export type CreateFamilyNotePayload = {
  parentId: string;
  studentId: string;
  counselorId?: string;
  counselorName?: string;
  body: string;
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

export type CommonReferenceMapping = {
  commonActionId: string;
  weight: number;
  note?: string;
};

export type ReferenceAction = {
  actionId: string;
  careerId: string;
  careerName: string;
  field?: string;
  label: string;
  sortOrder: number;
  commonMappings?: CommonReferenceMapping[];
};

export type StudentReferenceItem = ReferenceAction & {
  emotion?: ReferenceEmotion | null;
  updatedAt?: string | null;
};

export type CommonReferenceAction = {
  commonActionId: string;
  label: string;
  groupName: string;
  description?: string | null;
  sortOrder: number;
};

export type StudentCommonReferenceItem = CommonReferenceAction & {
  emotion?: ReferenceEmotion | null;
  score?: number | null;
  evidenceCount?: number;
  sourceActionIds?: string[];
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

export type StudentCommonReferencesResponse = {
  student?: {
    id: string;
    name: string;
    className?: string;
  };
  actions: CommonReferenceAction[];
  references: StudentCommonReferenceItem[];
  unmappedActionIds: string[];
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

export type CareerActionAiRequest = {
  studentId: string;
  career: {
    id: string;
    name: string;
    field?: string;
  };
  action: {
    id: string;
    label: string;
  };
  locale?: "vi" | "en";
};

export type CareerActionAiInteractive = {
  kind: "multiple_choice" | "true_false";
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  hint: string;
  successMessage: string;
};

export type CareerActionAiVideo = {
  url: string;
  embedUrl: string;
  title: string;
  channel: string;
  description: string;
  source: "YouTube";
};

export type CareerActionAiResponse = {
  mode: "interactive" | "video";
  title: string;
  summary: string;
  explanation: string;
  interactive: CareerActionAiInteractive | null;
  video: CareerActionAiVideo | null;
};

export type CareerChatAiRequest = {
  studentId: string;
  career: {
    id: string;
    name: string;
    field?: string;
    desc?: string;
    fullDesc?: string;
    salaryRange?: string;
    education?: string;
    skills?: string[];
    activities?: string[];
    universities?: Array<{
      name?: string;
      shortName?: string;
      program?: string;
      score?: string;
    }>;
  };
  question: string;
  locale?: "vi" | "en";
};

export type CareerChatAiResponse = {
  intro: string;
  bullets: string[];
  nextStep: string;
  provider: "gemini" | string;
  model?: string;
};

export type HomeworkChatAiRequest = {
  studentId: string;
  question?: string;
  image?: {
    mimeType: string;
    data: string;
    name?: string;
  };
  locale?: "vi" | "en";
};

export type HomeworkChatAiResponse = {
  detectedProblem: string;
  subject: string;
  grade: string;
  textbookArea: string;
  recommendedLessons: string[];
  solutionGuide: string[];
  commonMistakes: string[];
  nextQuestion: string;
  provider: "gemini" | string;
  model?: string;
};

const DEV_API_ORIGIN = "http://127.0.0.1:8001";

const shouldRetryDirectBackend = (url: string) =>
  url.startsWith("/api/") &&
  typeof window !== "undefined" &&
  !["127.0.0.1:8001", "localhost:8001"].includes(window.location.host);

async function requestJson<T>(
  url: string,
  init?: RequestInit,
  allowDirectRetry = true,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    if (allowDirectRetry && shouldRetryDirectBackend(url)) {
      return requestJson<T>(`${DEV_API_ORIGIN}${url}`, init, false);
    }
    throw new Error(
      `Cannot connect to API ${url}. Hãy chạy backend tại ${DEV_API_ORIGIN}. ${
        error instanceof Error ? error.message : ""
      }`.trim(),
    );
  }
  const text = await response.text();
  let payload: any = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      if (allowDirectRetry && shouldRetryDirectBackend(url)) {
        return requestJson<T>(`${DEV_API_ORIGIN}${url}`, init, false);
      }
      const snippet = text.slice(0, 80).replace(/\s+/g, " ").trim();
      throw new Error(
        `API returned non-JSON response for ${url}: ${snippet || response.statusText}`,
      );
    }
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed: ${response.status}`);
  }

  return payload as T;
}

export function fetchAppData<T>(signal?: AbortSignal): Promise<T> {
  return requestJson<T>("/api/app-data", { signal });
}

export function fetchCareerActionAi(
  payload: CareerActionAiRequest,
  signal?: AbortSignal,
): Promise<CareerActionAiResponse> {
  return requestJson<CareerActionAiResponse>("/api/career-action-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function fetchCareerChatAi(
  payload: CareerChatAiRequest,
  signal?: AbortSignal,
): Promise<CareerChatAiResponse> {
  return requestJson<CareerChatAiResponse>("/api/career-chat-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function fetchHomeworkChatAi(
  payload: HomeworkChatAiRequest,
  signal?: AbortSignal,
): Promise<HomeworkChatAiResponse> {
  return requestJson<HomeworkChatAiResponse>("/api/homework-chat-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

export function fetchReferenceActions(
  signal?: AbortSignal,
): Promise<{ actions: ReferenceAction[] }> {
  return requestJson<{ actions: ReferenceAction[] }>("/api/reference-actions", {
    signal,
  });
}

export function fetchCommonReferenceActions(
  signal?: AbortSignal,
): Promise<{ actions: CommonReferenceAction[] }> {
  return requestJson<{ actions: CommonReferenceAction[] }>(
    "/api/common-reference-actions",
    { signal },
  );
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

export function fetchStudentCommonReferences(
  studentId: string,
  signal?: AbortSignal,
): Promise<StudentCommonReferencesResponse> {
  return requestJson<StudentCommonReferencesResponse>(
    `/api/student-common-references?student_id=${encodeURIComponent(studentId)}`,
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

export function fetchSupportMeetingCandidates(
  params: {
    grade?: number;
    className?: string;
    teacherId?: string;
    threshold?: number;
    limit?: number;
    includeScheduled?: boolean;
  } = {},
  signal?: AbortSignal,
): Promise<MeetingCandidatesResponse<SupportMeetingCandidate>> {
  const search = new URLSearchParams();
  if (params.grade != null) search.set("grade", String(params.grade));
  if (params.className) search.set("class", params.className);
  if (params.teacherId) search.set("teacher_id", params.teacherId);
  if (params.threshold != null) search.set("threshold", String(params.threshold));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.includeScheduled != null)
    search.set("include_scheduled", String(params.includeScheduled));
  const query = search.toString();

  return requestJson<MeetingCandidatesResponse<SupportMeetingCandidate>>(
    `/api/meeting-candidates${query ? `?${query}` : ""}`,
    { signal },
  );
}

export function fetchCareerCounselingCandidates(
  params: {
    grade?: number;
    className?: string;
    teacherId?: string;
    threshold?: number;
    limit?: number;
    includeScheduled?: boolean;
  } = {},
  signal?: AbortSignal,
): Promise<MeetingCandidatesResponse<CareerCounselingCandidate>> {
  const search = new URLSearchParams();
  if (params.grade != null) search.set("grade", String(params.grade));
  if (params.className) search.set("class", params.className);
  if (params.teacherId) search.set("teacher_id", params.teacherId);
  if (params.threshold != null) search.set("threshold", String(params.threshold));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.includeScheduled != null)
    search.set("include_scheduled", String(params.includeScheduled));
  const query = search.toString();

  return requestJson<MeetingCandidatesResponse<CareerCounselingCandidate>>(
    `/api/career-counseling-candidates${query ? `?${query}` : ""}`,
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

export function updateMeeting(
  meetingId: number,
  payload: UpdateMeetingPayload,
  signal?: AbortSignal,
): Promise<CreateMeetingResponse> {
  return requestJson<CreateMeetingResponse>(
    `/api/meetings/${encodeURIComponent(String(meetingId))}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    },
  );
}

export function fetchMessages(
  params: {
    role?: MessageRole;
    conversationType?: ConversationType;
    studentId?: string;
    parentId?: string;
    counselorId?: string;
  } = {},
  signal?: AbortSignal,
): Promise<MessagesResponse> {
  const search = new URLSearchParams();
  if (params.role) search.set("role", params.role);
  if (params.conversationType)
    search.set("conversation_type", params.conversationType);
  if (params.studentId) search.set("student_id", params.studentId);
  if (params.parentId) search.set("parent_id", params.parentId);
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
    conversationType?: ConversationType;
    studentId: string;
    parentId?: string;
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

export function fetchFamilies(
  params: { counselorId?: string } = {},
  signal?: AbortSignal,
): Promise<FamiliesResponse> {
  const search = new URLSearchParams();
  if (params.counselorId) search.set("counselor_id", params.counselorId);
  const query = search.toString();

  return requestJson<FamiliesResponse>(
    `/api/families${query ? `?${query}` : ""}`,
    { signal },
  );
}

export function fetchFamilyNotes(
  params: {
    parentId: string;
    studentId: string;
    counselorId?: string;
  },
  signal?: AbortSignal,
): Promise<FamilyNotesResponse> {
  const search = new URLSearchParams();
  search.set("parent_id", params.parentId);
  search.set("student_id", params.studentId);
  if (params.counselorId) search.set("counselor_id", params.counselorId);

  return requestJson<FamilyNotesResponse>(`/api/family-notes?${search}`, {
    signal,
  });
}

export function createFamilyNote(
  payload: CreateFamilyNotePayload,
  signal?: AbortSignal,
): Promise<{ note: FamilyNoteRecord }> {
  return requestJson<{ note: FamilyNoteRecord }>("/api/family-notes", {
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
