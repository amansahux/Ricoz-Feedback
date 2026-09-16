import axios from 'axios';

const API_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // Avoid hard page reload loop if the failed request is session check /auth/me
    const isAuthCheck = error.config?.url?.includes('/auth/me');
    if (error.response?.status === 401 && !isAuthCheck && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;