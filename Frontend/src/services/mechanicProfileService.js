import axiosInstance from "../api/axiosInstance";

export const mechanicProfileService = {

    getProfile: async () => {

        const response =
            await axiosInstance.get("/mechanic/profile");

        return response.data;
    },

    updateProfile: async (profileData) => {

        const response =
            await axiosInstance.put(
                "/mechanic/profile",
                profileData
            );

        return response.data;
    }

};