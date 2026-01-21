export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      ME: '/api/v1/auth/me',
      REFRESH: '/api/v1/auth/refresh',
      LOGOUT: '/api/v1/auth/logout',
    },
  },
};
