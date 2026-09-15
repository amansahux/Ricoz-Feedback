import axios from 'axios';

const API_URL = '/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;