import { useContext } from 'react';
import { InterviewFlowContext } from './interview-flow-context';

export const useInterviewFlowContext = () => {
  const context = useContext(InterviewFlowContext);
  if (!context) {
    throw new Error('useInterviewFlowContext must be used within InterviewFlowProvider');
  }
  return context;
};
