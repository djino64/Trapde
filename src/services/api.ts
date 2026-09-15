
import axios from 'axios';

// ============================================================
// CONFIGURATION API — PRODUCTION
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error('VITE_API_URL n’est pas configurée.');
}

// ============================================================
// INSTANCE AXIOS
// ============================================================

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// AJOUT AUTOMATIQUE DU TOKEN JWT
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// REFRESH TOKEN AUTOMATIQUE SI 401
// ============================================================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Vérifier qu'il s'agit bien d'une erreur 401
    // et éviter une boucle infinie
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          window.location.href = '/login';

          return Promise.reject(error);
        }

        // BASE_URL = https://trapde.tech/api
        // donc cette URL devient :
        // https://trapde.tech/api/auth/token/refresh/
        const response = await axios.post(
          `${BASE_URL}/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        // Sauvegarder le nouveau token
        localStorage.setItem('access_token', newAccessToken);

        // Ajouter le nouveau token à la requête originale
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Rejouer la requête originale
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          'Impossible de rafraîchir le token JWT:',
          refreshError
        );

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
