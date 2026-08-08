import axiosInstance from "../api/axiosInstance";

const mechanicWorkService = {
  getMyAppointments: async () => {
    const response = await axiosInstance.get("/mechanic/work/appointments");
    return response.data;
  },

  acceptAppointment: async (appointmentId) => {
    const response = await axiosInstance.put(
      `/mechanic/work/appointments/${appointmentId}/accept`,
    );
    return response.data;
  },

  startWork: async (appointmentId) => {
    const response = await axiosInstance.put(
      `/mechanic/work/appointments/${appointmentId}/start`,
    );
    return response.data;
  },

  completeWork: async (appointmentId) => {
    const response = await axiosInstance.put(
      `/mechanic/work/appointments/${appointmentId}/complete`,
    );
    return response.data;
  },

  getEligibleAppointmentsForJobCard: async () => {
    const response = await axiosInstance.get(
      "/mechanic/work/appointments/eligible-jobcards",
    );
    return response.data;
  },
};

export default mechanicWorkService;
