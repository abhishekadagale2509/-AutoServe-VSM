import axiosInstance from "../api/axiosInstance";

export const mechanicService = {
  getAllMechanics: async () => {
    const response = await axiosInstance.get("/mechanics");
    return response.data;
  },

  getMechanicById: async (id) => {
    const response = await axiosInstance.get(`/mechanics/${id}`);
    return response.data;
  },

  createMechanic: async (mechanicData) => {
    const response = await axiosInstance.post("/mechanics", mechanicData);
    return response.data;
  },

  updateMechanic: async (id, mechanicData) => {
    const response = await axiosInstance.put(`/mechanics/${id}`, mechanicData);
    return response.data;
  },

  deleteMechanic: async (id) => {
    const response = await axiosInstance.delete(`/mechanics/${id}`);
    return response.data;
  },

  updateAvailability: async (availabilityStatus) => {
    const response = await axiosInstance.put("/mechanics/me/availability", {
      availabilityStatus,
    });

    return response.data;
  },
};
