import axiosInstance from "../api/axiosInstance";

export const jobCardPartService = {

    getParts: async (jobId) => {

        const response =
            await axiosInstance.get(
                `/jobcard-parts/job/${jobId}`
            );

        return response.data;

    },

    addPart: async (payload) => {

        const response =
            await axiosInstance.post(
                "/jobcard-parts",
                payload
            );

        return response.data;

    },

    deletePart: async (jobCardPartId) => {

        const response =
            await axiosInstance.delete(
                `/jobcard-parts/${jobCardPartId}`
            );

        return response.data;

    }

};