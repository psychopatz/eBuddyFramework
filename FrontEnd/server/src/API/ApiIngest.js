import {axiosBackend} from './axiosInstance';

export const ApiIngest = {
  create: (data) => axiosBackend.post('llm/ingest', data),
  update: (id, data) => axiosBackend.put(`llm/ingest/${id}/`, data),
  delete: (id) => axiosBackend.delete(`llm/ingest/${id}/`),
  list: () => axiosBackend.get('llm/ingest/list'),
  unlearn: (id) => axiosBackend.delete(`llm/unlearn/${id}`)
  
};
