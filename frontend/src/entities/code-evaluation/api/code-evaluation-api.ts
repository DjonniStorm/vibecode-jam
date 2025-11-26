import { api } from '@shared/api';
import type { CodeEvaluationRequest, CodeEvaluationResult } from '../model/types';

class CodeEvaluationApi {
  private readonly api: typeof api;

  constructor(private readonly prefix: string) {
    this.api = api;
  }

  evaluateCode(data: CodeEvaluationRequest): Promise<CodeEvaluationResult> {
    return this.api.post<CodeEvaluationRequest, CodeEvaluationResult>(`${this.prefix}/`, data);
  }
}

export const codeEvaluationApi = new CodeEvaluationApi('/api/code-evaluation');
