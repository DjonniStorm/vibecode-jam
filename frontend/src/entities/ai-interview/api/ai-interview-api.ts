import { api } from '@shared/api';
import type { AiAnswerRequest, AiAnswerResponse, AiStartResponse, AiTurn } from '../model/types';

class AiInterviewApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  startInterview(interviewId: string): Promise<AiStartResponse> {
    return this.api.post<Record<string, never>, AiStartResponse>(
      `${this.prefix}/${interviewId}/start`,
      {},
    );
  }

  answerQuestion(interviewId: string, data: AiAnswerRequest): Promise<AiAnswerResponse> {
    return this.api.post<AiAnswerRequest, AiAnswerResponse>(
      `${this.prefix}/${interviewId}/answer`,
      data,
    );
  }

  getTurns(interviewId: string): Promise<AiTurn[]> {
    return this.api.get<AiTurn[], AiTurn[]>(`${this.prefix}/${interviewId}/turns`);
  }

  finishInterview(interviewId: string): Promise<void> {
    return this.api.post<Record<string, never>, void>(`${this.prefix}/${interviewId}/finish`, {});
  }
}

export const aiInterviewApi = new AiInterviewApi('/api/ai-interviews');
