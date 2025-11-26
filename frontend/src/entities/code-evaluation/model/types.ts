interface CodeEvaluationRequest {
  question: string;
  language: string;
  code: string;
}

interface CodeEvaluationResult {
  correct: boolean;
  score: number;
  issues: string | null;
  suggestedFix: string | null;
  raw: string;
}

export type { CodeEvaluationRequest, CodeEvaluationResult };
