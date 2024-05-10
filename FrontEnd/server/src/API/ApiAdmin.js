import {axiosBackend} from './axiosInstance';

export const ApiAdmin = {
  create: (data) => axiosBackend.post('admins/create/', data),
  get: () => axiosBackend.get('admins/'),
  getById: (id) => axiosBackend.get(`admins/${id}/`),
  update: (id, data) => axiosBackend.put(`admins/${id}/`, data),
  delete: (id) => axiosBackend.delete(`admins/${id}/`),
  login: (data) => axiosBackend.post('admins/login', data)
};
