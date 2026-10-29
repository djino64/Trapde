
/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from 'react';
import axios from 'axios';

// ============================================================
// CONFIGURATION API — PRODUCTION DOKPLOY
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
  language?: 'ht' | 'fr' | 'en';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: 'user' | 'partner';
  business_name?: string;
  language?: 'ht' | 'fr' | 'en';
}

interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
  role?: 'user' | 'partner' | 'admin';
}

interface AuthResult {
  user: User | null;
  role: 'user' | 'partner' | 'admin' | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginData) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;

  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================
  // RÉCUPÉRER LE PROFIL
  // ==========================================================

  const fetchUser = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<User>('/users/profile/');

      setUser(response.data);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du profil:',
        error
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==========================================================
  // CHARGEMENT INITIAL
  // ==========================================================

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  // ==========================================================
  // CONNEXION
  // ==========================================================

  const login = async (data: LoginData): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // POST :
      // https://trapde.tech/api/auth/token/
      const response = await api.post<AuthResponse>(
        '/auth/token/',
        {
          email: data.email,
          password: data.password,
        }
      );

      const { access, refresh } = response.data;

      // Sauvegarder les tokens JWT
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      let loggedUser: User;

      // ======================================================
      // Si le backend retourne déjà l'utilisateur
      // ======================================================

      if (response.data.user) {
        loggedUser = response.data.user;
      } else {
        // ====================================================
        // Sinon récupérer le profil
        // ====================================================

        const profileResponse = await api.get<User>(
          '/users/profile/',
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        loggedUser = profileResponse.data;
      }

      setUser(loggedUser);

      const role =
        response.data.role ||
        loggedUser.role ||
        null;

      return {
        user: loggedUser,
        role,
      };
    } catch (error) {
      console.error('Erreur de connexion:', error);

      let errorMessage = 'Email ou mot de passe incorrect.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const data = error.response.data;

          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.error === 'string') {
            errorMessage = data.error;
          }
        }
      }

      setError(errorMessage);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // INSCRIPTION
  // ==========================================================

  const register = async (
    data: RegisterData
  ): Promise<AuthResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // POST :
      // https://trapde.tech/api/users/register/
      const response = await api.post<AuthResponse>(
        '/users/register/',
        data
      );

      // ======================================================
      // Si l'inscription retourne directement les tokens
      // ======================================================

      if (response.data.access && response.data.refresh) {
        localStorage.setItem(
          'access_token',
          response.data.access
        );

        localStorage.setItem(
          'refresh_token',
          response.data.refresh
        );

        let registeredUser: User;

        if (response.data.user) {
          registeredUser = response.data.user;
        } else {
          const profileResponse = await api.get<User>(
            '/users/profile/',
            {
              headers: {
                Authorization: `Bearer ${response.data.access}`,
              },
            }
          );

          registeredUser = profileResponse.data;
        }

        setUser(registeredUser);

        const role =
          response.data.role ||
          registeredUser.role ||
          null;

        return {
          user: registeredUser,
          role,
        };
      }

      // ======================================================
      // Si l'inscription ne retourne pas de token
      // ======================================================

      const registeredUser = response.data.user || null;

      if (registeredUser) {
        setUser(registeredUser);

        return {
          user: registeredUser,
          role: registeredUser.role || null,
        };
      }

      return {
        user: null,
        role: response.data.role || null,
      };
    } catch (error) {
      console.error(
        'Erreur lors de l’inscription:',
        error
      );

      let errorMessage = 'Erreur lors de l’inscription.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const data = error.response.data;

          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (typeof data === 'object') {
            const messages = Object.values(data)
              .flat()
              .filter((value) => typeof value === 'string');

            if (messages.length > 0) {
              errorMessage = messages.join(' ');
            }
          }
        }
      }

      setError(errorMessage);

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // DÉCONNEXION
  // ==========================================================

  const logout = async () => {
    const refreshToken =
      localStorage.getItem('refresh_token');

    const accessToken =
      localStorage.getItem('access_token');

    try {
      if (refreshToken) {
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
      console.error(
        'Erreur lors de la déconnexion:',
        error
      );
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setUser(null);
      setError(null);
    }
  };

  // ==========================================================
  // RAFRAÎCHIR LE PROFIL
  // ==========================================================

  const refreshUser = async () => {
    const accessToken =
      localStorage.getItem('access_token');

    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const response = await api.get<User>(
        '/users/profile/'
      );

      setUser(response.data);
    } catch (error) {
      console.error(
        'Erreur lors du rafraîchissement du profil:',
        error
      );

      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      setUser(null);
    }
  };

  // ==========================================================
  // EFFACER L'ERREUR
  // ==========================================================

  const clearError = () => {
    setError(null);
  };

  // ==========================================================
  // ÉTAT DE CONNEXION
  // ==========================================================

  const isLoggedIn = !!user;

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const value: AuthContextType = {
    user,
    isLoggedIn,
    isLoading,
    error,
    login,
    register,
    logout,
    refreshUser,
    clearError,
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
    throw new Error(
      'useAuth doit être utilisé à l’intérieur de AuthProvider'
    );
  }

  return context;
}
