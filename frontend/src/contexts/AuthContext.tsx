import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginApi, meApi, registerApi } from '../services/authApi';
import { TOKEN_KEY } from '../services/apiClient';
import type { AuthResponse, Role, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { fullName: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => void;
  hasRole: (roles?: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    meApi()
      .then((profile) => setUser(normalizeUser(profile)))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function saveAuth(auth: AuthResponse) {
    const normalizedUser = normalizeUser(auth.user);
    localStorage.setItem(TOKEN_KEY, auth.token);
    setToken(auth.token);
    setUser(normalizedUser);
    return normalizedUser;
  }

  async function login(email: string, password: string) {
    return saveAuth(await loginApi(email, password));
  }

  async function register(data: { fullName: string; email: string; password: string; phone?: string }) {
    return saveAuth(await registerApi(data));
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  function hasRole(roles?: Role[]) {
    if (!roles || roles.length === 0) return Boolean(user);
    return Boolean(user?.roles.some((role) => roles.includes(role)));
  }

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, hasRole }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function normalizeUser(user: User): User {
  return {
    ...user,
    roles: (user.roles || []).map((role: any) => (typeof role === 'string' ? role : role.name)).filter(Boolean)
  };
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
