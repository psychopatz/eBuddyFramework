import {axiosBackend} from './axiosInstance';

export const ApiDataset = {
  create: (data) => axiosBackend.post('datasets/create/', data),
  get: () => axiosBackend.get('datasets/all'),
  getById: (id) => axiosBackend.get(`datasets/${id}/`),
  update: (id, data) => axiosBackend.put(`datasets/${id}/`, data),
  delete: (id) => axiosBackend.delete(`datasets/${id}/`),
  
};
