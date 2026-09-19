import api from './api.js';

export const verificationService = {
  getVerificationActivities: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.department && filters.department !== 'All') params.append('department', filters.department);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await api.get(`/verification${queryString}`);
  },

  updateVerification: async (activityId, { status, remarks }) => {
    return await api.put(`/verification/${activityId}`, { status, remarks });
  },

  getApprovedActivities: async () => {
    return await api.get('/approvedActivities');
  },

  getDepartmentSummary: async () => {
    return await api.get('/reports/department-summary');
  },

  getPortalSummary: async () => {
    return await api.get('/reports/portal-summary');
  },
};

export default verificationService;
