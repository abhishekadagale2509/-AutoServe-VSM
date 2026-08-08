import axiosInstance from '../api/axiosInstance';

export const dashboardService = {
  getAdminDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/admin');
    return response.data;
  },

  getCustomerDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/customer');
    return response.data;
  },

  getMechanicDashboard: async () => {
    const response = await axiosInstance.get('/dashboard/mechanic');
    return response.data;
  },
};
