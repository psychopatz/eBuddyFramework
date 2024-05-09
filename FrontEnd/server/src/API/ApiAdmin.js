import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const ApiAdmin = {
  createAdmin: (adminData) => axiosInstance.post('admins/create/', adminData),
  getAdmins: () => axiosInstance.get('admins/'),
  getAdminById: (id) => axiosInstance.get(`admins/${id}/`),
  updateAdmin: (id, adminData) => axiosInstance.put(`admins/${id}/`, adminData),
  deleteAdmin: (id) => axiosInstance.delete(`admins/${id}/`),
  loginAdmin: (adminData) => axiosInstance.post('admins/login', adminData)
};
