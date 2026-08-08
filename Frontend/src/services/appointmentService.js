import axiosInstance from "../api/axiosInstance";

export const appointmentService = {
  createAppointment: async (appointmentData) => {
    const response = await axiosInstance.post("/appointments", appointmentData);
    return response.data;
  },

  getAppointments: async (search = "") => {
    const response = await axiosInstance.get("/appointments", {
      params: { search },
    });
    return response.data;
  },

  getAllAppointments: async () => {
    const response = await axiosInstance.get("/appointments/all");
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await axiosInstance.get(`/appointments/${id}`);
    return response.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const response = await axiosInstance.put(`/appointments/${id}/status`, {
      status,
    });
    return response.data;
  },

  assignMechanic: async (appointmentId, mechanicId) => {
    const response = await axiosInstance.put(
      `/appointments/${appointmentId}/assign`,
      { mechanicId },
    );
    return response.data;
  },

  cancelAppointment: async (appointmentId) => {
    const response = await axiosInstance.put(
      `/appointments/${appointmentId}/cancel`,
    );

    return response.data;
  },
};
