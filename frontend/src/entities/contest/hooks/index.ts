import { useQuery } from '@tanstack/react-query';
import { contestApi } from '../api/contest-api';
import { tasksApi } from '../api/tasks-api';

const useContest = (id: string) => {
  return useQuery({
    queryKey: ['contest', id],
    queryFn: () => contestApi.getContest(id),
  });
};

const useContests = () => {
  return useQuery({
    queryKey: ['contests'],
    queryFn: () => contestApi.getContests(),
  });
};

const useTasks = (contestId: string) => {
  return useQuery({
    queryKey: ['tasks', contestId],
    queryFn: () => tasksApi.getTasks(contestId),
  });
};

const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getTask(id),
  });
};

export { useContest, useContests, useTasks, useTask };
