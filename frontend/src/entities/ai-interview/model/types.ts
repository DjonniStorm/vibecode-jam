interface AiTurn {
  id: string;
  turnNumber: number;
  question: string;
  userAnswer: string | null;
  codeQuestion: boolean;
  codeLanguage: string | null;
  evaluation: string | null;
  score: number | null;
  createdAt: string;
}

interface AiAnswerRequest {
  turnId: string;
  answer: string;
}

interface AiAnswerResponse {
  previousTurn: AiTurn;
  nextTurn: AiTurn | null;
}

interface AiStartResponse {
  id: string;
  turnNumber: number;
  question: string;
  userAnswer: null;
  codeQuestion: boolean;
  codeLanguage: string | null;
  evaluation: null;
  score: null;
  createdAt: string;
}

export type { AiTurn, AiAnswerRequest, AiAnswerResponse, AiStartResponse };
