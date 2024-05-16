import {axiosBackend} from './axiosInstance';

export const ApiQuestion = {
  create: (data) => axiosBackend.post('questions/', data),
  get: () => axiosBackend.get('questions/all'),
  getById: (id) => axiosBackend.get(`questions/${id}/`),
  update: (id, data) => axiosBackend.put(`questions/${id}/`, data),
  delete: (id) => axiosBackend.delete(`questions/${id}/`),
};
