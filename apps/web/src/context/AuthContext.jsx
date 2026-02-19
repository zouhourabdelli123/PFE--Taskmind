import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, logout as logoutApi, me as meApi, register as registerApi } from '../api/auth';
import { setUnauthorizedHandler } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(true);

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: meApi,
    retry: false,
    enabled,
  });

  useEffect(() => {
    setUnauthorizedHandler(() => {
      queryClient.setQueryData(['me'], null);
      window.location.href = '/login';
    });
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user: meQuery.data ?? null,
      loading: meQuery.isLoading,
      isAuthenticated: Boolean(meQuery.data),
      async login(payload) {
        await loginApi(payload);
        await queryClient.invalidateQueries({ queryKey: ['me'] });
      },
      async register(payload) {
        await registerApi(payload);
        await queryClient.invalidateQueries({ queryKey: ['me'] });
      },
      async logout() {
        await logoutApi();
        queryClient.setQueryData(['me'], null);
      },
      refreshMe: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
      disableAuthQuery: () => setEnabled(false),
      enableAuthQuery: () => setEnabled(true),
    }),
    [meQuery.data, meQuery.isLoading, queryClient, enabled],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
