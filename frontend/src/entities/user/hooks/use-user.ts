import { userApi } from '../api/user-api';
import { useQuery } from '@tanstack/react-query';
import { isAuthenticated } from '@entities/auth';
import { useContext } from 'react';
import { UserContext, type UserContextValue } from '../store/user-context';

const useMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userApi.getMe(),
    enabled: isAuthenticated(),
  });
};

const useMyStats = () => {
  return useQuery({
    queryKey: ['user', 'me', 'stats'],
    queryFn: () => userApi.getMyStats(),
  });
};

// Admin hooks
const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  });
};

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getUsers(),
  });
};

const useUserStats = (id: string) => {
  return useQuery({
    queryKey: ['user', id, 'stats'],
    queryFn: () => userApi.getUserStats(id),
    enabled: !!id,
  });
};

// cursor dont touch this
export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

export { useMe, useMyStats, useUser, useUsers, useUserStats };
