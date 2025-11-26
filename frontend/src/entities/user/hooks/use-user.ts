import { userApi } from '../api/user-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { User, UserCreate } from '../model/types';
import { queryClient } from '@shared/config';

const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUser(id),
  });
};

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  });
};

const useCreateUser = () => {
  return useMutation({
    mutationFn: (user: UserCreate) => userApi.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

const useUpdateUser = () => {
  return useMutation({
    mutationFn: ({ id, user }: { id: string; user: User }) => userApi.updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export { useUser, useUsers, useCreateUser, useUpdateUser };
