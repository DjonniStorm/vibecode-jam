import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiInterviewApi } from '../api/ai-interview-api';
import type { AiAnswerRequest } from '../model/types';

const useAiInterviewTurns = (interviewId: string) => {
  return useQuery({
    queryKey: ['ai-interview', interviewId, 'turns'],
    queryFn: () => aiInterviewApi.getTurns(interviewId),
    enabled: !!interviewId,
  });
};

const useStartAiInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interviewId: string) => aiInterviewApi.startInterview(interviewId),
    onSuccess: (_, interviewId) => {
      queryClient.invalidateQueries({ queryKey: ['ai-interview', interviewId] });
      queryClient.invalidateQueries({ queryKey: ['interview', interviewId] });
    },
  });
};

const useAnswerAiQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ interviewId, data }: { interviewId: string; data: AiAnswerRequest }) =>
      aiInterviewApi.answerQuestion(interviewId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-interview', variables.interviewId, 'turns'] });
      queryClient.invalidateQueries({ queryKey: ['interview', variables.interviewId] });
    },
  });
};

const useFinishAiInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (interviewId: string) => aiInterviewApi.finishInterview(interviewId),
    onSuccess: (_, interviewId) => {
      queryClient.invalidateQueries({ queryKey: ['ai-interview', interviewId] });
      queryClient.invalidateQueries({ queryKey: ['interview', interviewId] });
    },
  });
};

export { useAiInterviewTurns, useStartAiInterview, useAnswerAiQuestion, useFinishAiInterview };
