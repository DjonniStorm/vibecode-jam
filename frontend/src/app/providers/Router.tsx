import { ContestLayout } from '@widgets/contest-layout';
import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';

const MainPageLazy = lazy(() =>
  import('@pages/main').then((module) => ({ default: module.MainPage })),
);

const ContestPageLazy = lazy(() =>
  import('@pages/contest').then((module) => ({ default: module.ContestPage })),
);

const router = createBrowserRouter([
  {
    path: '/contest',
    element: <ContestLayout />,
    children: [
      {
        index: true,
        element: <ContestPageLazy />,
      },
    ],
  },
  {
    path: '/',
    element: <MainPageLazy />,
  },
]);

export const Router = () => {
  return <RouterProvider router={router} />;
};
