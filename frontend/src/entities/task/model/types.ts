type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';

interface Task {
  id: string;
  interviewId: string;
  title: string;
  description: string;
  language: string;
  userResponse: string | null;
  status: TaskStatus;
  checkResult: string | null;
}

interface TaskRequest {
  interviewId: string;
  title: string;
  description: string;
  language: string;
}

interface TaskResponse {
  id: string;
  interviewId: string;
  title: string;
  description: string;
  language: string;
  userResponse: string | null;
  status: TaskStatus;
  checkResult: string | null;
}

interface TaskUpdateRequest {
  userResponse?: string;
  status?: TaskStatus;
  checkResult?: string;
}

export type { Task, TaskRequest, TaskResponse, TaskUpdateRequest, TaskStatus };
