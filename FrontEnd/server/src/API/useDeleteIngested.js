import {axiosLLM} from "./axiosInstance";

const useDeleteIngested = async (id) => {
  try {
    const response = await axiosLLM.delete(`/ingest/${id}`);
    // Check if the response includes specific success messaging or just resolve generally
    return response.data.message || 'Successfully deleted';
  } catch (error) {
    // throw new Error(error.response?.data?.message || 'Failed to delete the document');
  }
};

export { useDeleteIngested as deleteIngestedDocument };
