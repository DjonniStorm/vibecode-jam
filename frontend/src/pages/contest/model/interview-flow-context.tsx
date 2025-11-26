import { createContext, useContext, useState, type ReactNode } from 'react';
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

const InterviewFlowContext = createContext<InterviewFlowContextValue | null>(null);

export const InterviewFlowProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InterviewFlowState>({
    currentTurn: null,
    answer: '',
    codeAnswer: '',
    isStarted: false,
    isFinished: false,
  });

  const setCurrentTurn = (turn: AiTurn | null) => {
    setState((prev) => ({ ...prev, currentTurn: turn }));
  };

  const setAnswer = (answer: string) => {
    setState((prev) => ({ ...prev, answer }));
  };

  const setCodeAnswer = (codeAnswer: string) => {
    setState((prev) => ({ ...prev, codeAnswer }));
  };

  const setIsStarted = (isStarted: boolean) => {
    setState((prev) => ({ ...prev, isStarted }));
  };

  const setIsFinished = (isFinished: boolean) => {
    setState((prev) => ({ ...prev, isFinished }));
  };

  const resetAnswers = () => {
    setState((prev) => ({ ...prev, answer: '', codeAnswer: '' }));
  };

  return (
    <InterviewFlowContext.Provider
      value={{
        state,
        setCurrentTurn,
        setAnswer,
        setCodeAnswer,
        setIsStarted,
        setIsFinished,
        resetAnswers,
      }}
    >
      {children}
    </InterviewFlowContext.Provider>
  );
};

export const useInterviewFlowContext = () => {
  const context = useContext(InterviewFlowContext);
  if (!context) {
    throw new Error('useInterviewFlowContext must be used within InterviewFlowProvider');
  }
  return context;
};
