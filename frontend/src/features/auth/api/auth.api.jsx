import apiClient from "../../../../config/axiosInsstance.jsx";

export const authAPI = {
  register: async (name, email, password, organizationName) => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      organizationName,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};