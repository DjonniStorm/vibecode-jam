import { ThemeProvider } from './app/providers/Theme';
import { Router } from './app/providers/Router';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  </StrictMode>,
);
