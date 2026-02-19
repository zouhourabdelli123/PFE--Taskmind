import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { meApi } from '../../api/auth.api';
import { setTokenGetter } from '../../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tm_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('tm_token')));

  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    let active = true;

    async function hydrateUser() {
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const response = await meApi();
        if (active) {
          setUser(response.data);
        }
      } catch {
        if (active) {
          localStorage.removeItem('tm_token');
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    hydrateUser();

    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      setSession(nextToken, nextUser = null) {
        localStorage.setItem('tm_token', nextToken);
        setToken(nextToken);
        setUser(nextUser);
      },
      clearSession() {
        localStorage.removeItem('tm_token');
        setToken(null);
        setUser(null);
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
