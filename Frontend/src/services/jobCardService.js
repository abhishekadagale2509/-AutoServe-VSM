import axiosInstance from '../api/axiosInstance';

export const jobCardService = {
  createJobCard: async (jobCardData) => {
    const response = await axiosInstance.post('/jobcards', jobCardData);
    return response.data;
  },

  getJobCards: async () => {
    const response = await axiosInstance.get('/jobcards');
    return response.data;
  },

  getJobCardById: async (id) => {
    const response = await axiosInstance.get(`/jobcards/${id}`);
    return response.data;
  },

  updateJobCard: async (id, jobCardData) => {
    const response = await axiosInstance.put(`/jobcards/${id}`, jobCardData);
    return response.data;
  },

  finalizeJobCard: async (id) => {
  const response = await axiosInstance.put(`/jobcards/${id}/finalize`);
  return response.data;
},

  // Job Card Parts
  addPartToJobCard: async (partData) => {
    const response = await axiosInstance.post('/jobcard-parts', partData);
    return response.data;
  },

  getPartsByJobId: async (jobId) => {
    const response = await axiosInstance.get(`/jobcard-parts/job/${jobId}`);
    return response.data;
  },

  deletePart: async (partId) => {
    const response = await axiosInstance.delete(`/jobcard-parts/${partId}`);
    return response.data;
  },
};
