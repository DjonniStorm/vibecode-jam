import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { interviewApi } from '../api/interview-api';
import type { InterviewRequest } from '../model/types';
import type { InterviewStatus } from '../model/types';

const useInterviews = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: () => interviewApi.get(),
  });
};

const useInterview = (id: string) => {
  return useQuery({
    queryKey: ['interview', id],
    queryFn: () => interviewApi.getInterview(id),
    enabled: !!id,
  });
};

const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InterviewRequest) => interviewApi.createInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
    },
  });
};

const useUpdateInterviewStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InterviewStatus }) =>
      interviewApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] });
      queryClient.invalidateQueries({ queryKey: ['interview', variables.id] });
    },
  });
};

export { useInterviews, useInterview, useCreateInterview, useUpdateInterviewStatus };
