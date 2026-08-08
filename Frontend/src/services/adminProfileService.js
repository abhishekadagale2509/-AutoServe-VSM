import axiosInstance from "../api/axiosInstance";

export const adminProfileService = {

    getProfile: async () => {

        const response =
            await axiosInstance.get("/admin/profile");

        return response.data;
    },

    updateProfile: async (profileData) => {

        const response =
            await axiosInstance.put(
                "/admin/profile",
                profileData
            );

        return response.data;
    }

};