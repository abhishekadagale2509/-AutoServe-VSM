import axiosInstance from "../api/axiosInstance";

export const razorpayService = {

    createOrder: async (invoiceId) => {

        const response = await axiosInstance.post(
            "/razorpay/create-order",
            {
                invoiceId
            }
        );

        return response.data;
    }

};