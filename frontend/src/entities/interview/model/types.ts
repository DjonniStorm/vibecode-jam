type InterviewStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type InterviewType = 'MANUAL' | 'AI';

interface Interview {
  id: string;
  userId: string;
  title: string;
  status: InterviewStatus;
  type?: InterviewType;
  createdAt: string;
  totalScore?: number | null;
}

interface InterviewRequest {
  userId: string;
  title: string;
}

interface InterviewResponse {
  id: string;
  userId: string;
  title: string;
  status: InterviewStatus;
  createdAt: string;
}

export type { Interview, InterviewRequest, InterviewResponse, InterviewStatus, InterviewType };
