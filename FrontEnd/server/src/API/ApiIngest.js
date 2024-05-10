import {axiosBackend} from './axiosInstance';

export const ApiIngest = {
  create: (data) => axiosBackend.post('llm/ingest', data),
  update: (id, data) => axiosBackend.put(`llm/ingest/${id}/`, data),
  delete: (id) => axiosBackend.delete(`llm/ingest/${id}/`),
  
};
