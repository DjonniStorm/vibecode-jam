import { api } from '@shared/api';
import type { Interview, InterviewRequest, InterviewResponse } from '../model/types';
import type { InterviewStatus } from '../model/types';

class InterviewApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  createInterview(data: InterviewRequest): Promise<InterviewResponse> {
    return this.api.post<InterviewRequest, InterviewResponse>(`${this.prefix}/`, data);
  }

  get(): Promise<Interview[]> {
    return this.api.get<Interview[], Interview[]>(this.prefix);
  }

  getInterview(id: string): Promise<Interview> {
    return this.api.get<Interview, Interview>(`${this.prefix}/${id}`);
  }

  updateStatus(id: string, status: InterviewStatus): Promise<void> {
    return this.api.patch<void, void>(`${this.prefix}/${id}/status?status=${status}`);
  }
}

export const interviewApi = new InterviewApi('/api/interviews');
