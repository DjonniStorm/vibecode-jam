import { createContext } from 'react';
import type { AiTurn } from '@entities/ai-interview';

interface InterviewFlowState {
  currentTurn: AiTurn | null;
  answer: string;
  codeAnswer: string;
  isStarted: boolean;
  isFinished: boolean;
}

interface InterviewFlowContextValue {
  state: InterviewFlowState;
  setCurrentTurn: (turn: AiTurn | null) => void;
  setAnswer: (answer: string) => void;
  setCodeAnswer: (codeAnswer: string) => void;
  setIsStarted: (isStarted: boolean) => void;
  setIsFinished: (isFinished: boolean) => void;
  resetAnswers: () => void;
}

export const InterviewFlowContext = createContext<InterviewFlowContextValue | null>(null);
