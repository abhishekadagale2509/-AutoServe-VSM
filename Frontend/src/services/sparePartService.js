import axiosInstance from "../api/axiosInstance";

export const sparePartService = {

  getAllParts: async () => {

    const response = await axiosInstance.get("/spare-parts");

    return response.data;

  }

};