import api from './api.js';

export const activityService = {
  getActivities: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.department && filters.department !== 'All') params.append('department', filters.department);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/activities${queryString}`);
  },

  getActivity: async (id) => {
    return await api.get(`/activities/${id}`);
  },

  createActivity: async (activityData) => {
    return await api.post('/activities', activityData);
  },

  updateActivity: async (id, activityData) => {
    return await api.put(`/activities/${id}`, activityData);
  },

  deleteActivity: async (id) => {
    return await api.delete(`/activities/${id}`);
  },
};

export default activityService;
