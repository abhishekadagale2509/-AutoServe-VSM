import axiosInstance from "../api/axiosInstance";

export const invoiceService = {
  generateInvoice: async (jobId) => {
    const response = await axiosInstance.post(`/invoices/generate/${jobId}`);
    return response.data;
  },

  getInvoiceById: async (invoiceId) => {
    const response = await axiosInstance.get(`/invoices/${invoiceId}`);
    return response.data;
  },

  getInvoiceByJobId: async (jobId) => {
    const response = await axiosInstance.get(`/invoices/jobcard/${jobId}`);
    return response.data;
  },

  getAllInvoices: async () => {
    const response = await axiosInstance.get("/invoices");
    return response.data;
  },

  downloadInvoicePdf: async (invoiceId) => {
    return await axiosInstance.get(`/invoices/${invoiceId}/pdf`, {
      responseType: "blob",
    });
  },
};
