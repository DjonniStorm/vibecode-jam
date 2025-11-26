import { ThemeProvider } from './app/providers/Theme';
import { Router } from './app/providers/Router';
import { UserProvider } from './entities/user';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './shared/config';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <Router />
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
