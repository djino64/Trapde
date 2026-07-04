import api from './api';

// Types 
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

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Fonksyon yo 

/**
 * Enskri yon nouvo itilizatè
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/users/register/', data);
  saveTokens(response.data.tokens);
  return response.data;
};

/**
 * Konekte yon itilizatè egzistan
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<{ access: string; refresh: string }>('/api/auth/token/', {
    username: data.email,   // Django SimpleJWT itilize 'username' pa defo
    password: data.password,
  });

  const tokens: AuthTokens = {
    access: response.data.access,
    refresh: response.data.refresh,
  };

  saveTokens(tokens);

  // Jwenn enfòmasyon itilizatè a
  const userResponse = await api.get<User>('/api/users/profile/');
  return { user: userResponse.data, tokens };
};

/**
 * Dekonekte itilizatè a
 */
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      await api.post('/api/users/logout/', { refresh: refreshToken });
    }
  } finally {
    clearTokens();
  }
};

/**
 * Jwenn pwofil itilizatè ki konekte a
 */
export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>('/api/users/profile/');
  return response.data;
};

/**
 * Chanje modpas
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  await api.post('/api/users/change-password/', {
    old_password: oldPassword,
    new_password: newPassword,
  });
};

// ─── Itilitè token ───────────────────────────────────────────────────────────
export const saveTokens = (tokens: AuthTokens): void => {
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
};

export const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};