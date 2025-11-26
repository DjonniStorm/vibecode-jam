import { ContestStoreProvider } from '@entities/contest';
import { ContestLayout } from '@widgets/contest-layout';
import { AppLayout } from '@widgets/app-layout';
import { AuthProtectedRoute } from '@features/auth-protected-route';
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

const MainPageLazy = lazy(() =>
  import('@pages/main').then((module) => ({ default: module.MainPage })),
);

const ContestPageLazy = lazy(() =>
  import('@pages/contest').then((module) => ({ default: module.ContestPage })),
);

const ContestStartPageLazy = lazy(() =>
  import('@pages/contest-start').then((module) => ({ default: module.ContestStartPage })),
);

const AllContestsPageLazy = lazy(() =>
  import('@pages/all-contest').then((module) => ({ default: module.AllContestsPages })),
);

const LoginPageLazy = lazy(() =>
  import('@pages/auth/login').then((module) => ({ default: module.LoginPage })),
);

const RegisterPageLazy = lazy(() =>
  import('@pages/auth/register').then((module) => ({ default: module.RegisterPage })),
);

const NotFoundPageLazy = lazy(() =>
  import('@pages/error').then((module) => ({ default: module.NotFoundPage })),
);

const ProfilePageLazy = lazy(() =>
  import('@pages/profile').then((module) => ({ default: module.ProfilePage })),
);

const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <LoginPageLazy />,
  },
  {
    path: '/auth/register',
    element: <RegisterPageLazy />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <MainPageLazy />,
      },
      {
        path: '/contests',
        element: (
          <AuthProtectedRoute>
            <AllContestsPageLazy />
          </AuthProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <AuthProtectedRoute>
            <ProfilePageLazy />
          </AuthProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/contest',
    element: (
      <AuthProtectedRoute>
        <ContestLayout />
      </AuthProtectedRoute>
    ),
    children: [
      {
        path: '/contest/:id',
        element: <ContestStartPageLazy />,
      },
      {
        path: '/contest/:id/play',
        element: (
          <ContestStoreProvider>
            <ContestPageLazy />
          </ContestStoreProvider>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPageLazy />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
