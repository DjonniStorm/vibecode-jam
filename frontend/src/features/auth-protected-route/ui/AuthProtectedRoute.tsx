import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useUserContext } from '@entities/user';
import { isAuthenticated } from '@entities/auth';
import { Loader, Center } from '@mantine/core';

export const AuthProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  if (!isAuthenticated() || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};
