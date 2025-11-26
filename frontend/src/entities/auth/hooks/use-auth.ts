import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import type { LoginRequest, RegisterRequest } from '../model/types';

const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      // После регистрации можно автоматически залогинить пользователя
      // или перенаправить на страницу логина
    },
  });
};

const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // Сохраняем токен в localStorage
      localStorage.setItem('token', response.token);
    },
  });
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.reload();
};

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export { useRegister, useLogin, logout, isAuthenticated };
