import { axiosBackend } from './axiosInstance';

export const ApiPrompt = {
  create: (data) => axiosBackend.post('prompts/create', data),
  get: () => axiosBackend.get('prompts/all'),
  getById: (id) => axiosBackend.get(`prompts/${id}/`),
  update: (id, data) => axiosBackend.put(`prompts/${id}/`, data),
  delete: (id) => axiosBackend.delete(`prompts/${id}/`),
  getByType: (promptType) => axiosBackend.get(`prompts/type/`, { params: { promptType } }),
  incrementPopularity: (id) => axiosBackend.post(`prompts/${id}/increment-popularity`)

};
