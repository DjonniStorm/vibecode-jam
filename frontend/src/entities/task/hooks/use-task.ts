import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/task-api';
import type { TaskRequest, TaskUpdateRequest } from '../model/types';

const useTasksByInterview = (interviewId: string) => {
  return useQuery({
    queryKey: ['tasks', 'interview', interviewId],
    queryFn: () => taskApi.getTasksByInterview(interviewId),
    enabled: !!interviewId,
  });
};

const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TaskRequest) => taskApi.createTask(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'interview', variables.interviewId] });
    },
  });
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: TaskUpdateRequest }) =>
      taskApi.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export { useTasksByInterview, useCreateTask, useUpdateTask };
