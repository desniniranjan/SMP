import api from './api.js';

export const authService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    const data = await api.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getProfile: async () => {
    return await api.get('/auth/me');
  },
};

export default authService;
