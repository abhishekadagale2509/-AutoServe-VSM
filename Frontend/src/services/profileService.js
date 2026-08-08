import axiosInstance from "../api/axiosInstance";

export const profileService = {

    getProfile: async () => {

        const response = await axiosInstance.get("/customer/profile");

        return response.data;
    },

    updateProfile: async (profileData) => {

        const response = await axiosInstance.put(
            "/customer/profile",
            profileData
        );

        return response.data;
    }

};