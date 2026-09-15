
import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import axios from 'axios';

// ============================================================
// CONFIGURATION API — PRODUCTION
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error('VITE_API_URL n’est pas configurée.');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// TYPES
// ============================================================

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'user' | 'partner' | 'admin';
  username?: string;
  business_name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirm?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'user' | 'partner';
  business_name?: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // RÉCUPÉRER LE PROFIL DE L'UTILISATEUR
  // ==========================================================

  const fetchUser = async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<User>('/users/profile/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // CHARGEMENT INITIAL
  // ==========================================================

  useEffect(() => {
    fetchUser();
  }, []);

  // ==========================================================
  // CONNEXION
  // ==========================================================

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/token/', {
        email,
        password,
      });

      const { access, refresh, user: responseUser } = response.data;

      // Sauvegarde des tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Si l'API retourne directement l'utilisateur
      if (responseUser) {
        setUser(responseUser);
      } else {
        // Sinon, récupérer le profil
        const profileResponse = await api.get<User>('/users/profile/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        setUser(profileResponse.data);
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  // ==========================================================
  // INSCRIPTION
  // ==========================================================

  const register = async (data: RegisterData) => {
    try {
      await api.post('/users/register/', data);
    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
      throw error;
    }
  };

  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        const accessToken = localStorage.getItem('access_token');

        await api.post(
          '/users/logout/',
          {
            refresh: refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours supprimer les tokens localement
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setUser(null);
    }
  };

  // ==========================================================
  // RAFRAÎCHIR LES INFORMATIONS UTILISATEUR
  // ==========================================================

  const refreshUser = async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get<User>('/users/profile/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setUser(null);
    }
  };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// HOOK useAuth
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider');
  }

  return context;
}

