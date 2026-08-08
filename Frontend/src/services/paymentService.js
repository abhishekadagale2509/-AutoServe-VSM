import axiosInstance from '../api/axiosInstance';

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await axiosInstance.post('/payments', paymentData);
    return response.data;
  },

  getPaymentById: async (paymentId) => {
    const response = await axiosInstance.get(`/payments/${paymentId}`);
    return response.data;
  },

  getPaymentByInvoiceId: async (invoiceId) => {
    const response = await axiosInstance.get(`/payments/invoice/${invoiceId}`);
    return response.data;
  },

  getAllPayments: async () => {
    const response = await axiosInstance.get('/payments');
    return response.data;
  },
};
