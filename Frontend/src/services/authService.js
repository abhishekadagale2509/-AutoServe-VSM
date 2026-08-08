import axiosInstance from "../api/axiosInstance";

const authService = {
  login: async (credentials) => {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await axiosInstance.post("/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async (
    email,
    newPassword,
    confirmPassword
  ) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

    changePassword: async (
    currentPassword,
    newPassword,
    confirmPassword
  ) => {
    const response = await axiosInstance.put("/auth/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    return response.data;
  },
};

export default authService;