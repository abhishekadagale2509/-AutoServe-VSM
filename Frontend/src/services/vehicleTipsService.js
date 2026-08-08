import axiosInstance from "../api/axiosInstance";

const vehicleTipsService = {

    getTips: async (vehicleType) => {
        const response = await axiosInstance.get(
            `/vehicle-tips/${vehicleType}`
        );

        return response.data;
    }
};

export default vehicleTipsService;