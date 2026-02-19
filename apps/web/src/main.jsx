import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from './app/queryClient';
import { router } from './app/router';
import { AuthProvider } from './context/AuthContext';
import { TeamProvider } from './context/TeamContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TeamProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </TeamProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
