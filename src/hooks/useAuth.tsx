import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'partner';
  business_name?: string;
  password: string;
  password2: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  role: 'user' | 'partner' | 'admin';
  business_name: string;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: RegisterData) => Promise<{ role: string }>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('trapde_user');
};

const getStoredUser = (): User | null => {
  try {
    const u = localStorage.getItem('trapde_user');
    return u ? JSON.parse(u) : null;
  } catch (_e) {
    return null;
  }
};

const extractError = (err: unknown): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const e = err as { response?: { data?: Record<string, unknown> } };
    const data = e.response?.data;
    if (data) {
      const msgs = Object.values(data).flat().join(' ');
      if (msgs) return msgs;
    }
  }
  if (err instanceof Error) return err.message;
  return 'Yon ere te fet. Eseye anko.';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      setIsLoading(true);
      api.get<User>('/api/users/profile/')
        .then((res) => {
          setUser(res.data);
          localStorage.setItem('trapde_user', JSON.stringify(res.data));
        })
        .catch(() => clearTokens())
        .finally(() => setIsLoading(false));
    }
  }, []);

  const register = async (data: RegisterData): Promise<{ role: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post<{ user: User; tokens: { access: string; refresh: string } }>(
        '/api/users/register/',
        data
      );
      saveTokens(res.data.tokens.access, res.data.tokens.refresh);
      setUser(res.data.user);
      localStorage.setItem('trapde_user', JSON.stringify(res.data.user));
      return { role: res.data.user.role };
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const tokenRes = await api.post<{ access: string; refresh: string }>(
        '/api/auth/token/',
        { email: data.email, password: data.password }
      );
      saveTokens(tokenRes.data.access, tokenRes.data.refresh);
      const profileRes = await api.get<User>('/api/users/profile/');
      setUser(profileRes.data);
      localStorage.setItem('trapde_user', JSON.stringify(profileRes.data));
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await api.post('/api/users/logout/', { refresh }).catch(() => null);
      }
    } finally {
      clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, error, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth dwe itilize anndan AuthProvider');
  return context;
};