import { type PropsWithChildren, useState } from 'react';
import type { AiTurn } from '@entities/ai-interview';
import { InterviewFlowContext } from './interview-flow-context';
// @ts-expect-error - React is not used in this file
import React from 'react';

interface InterviewFlowState {
  currentTurn: AiTurn | null;
  answer: string;
  codeAnswer: string;
  isStarted: boolean;
  isFinished: boolean;
}

export const InterviewFlowProvider = ({ children }: PropsWithChildren) => {
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
