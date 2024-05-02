import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8001/v1',
  headers: {
    'Accept': 'application/json'
  }
});

export default axiosInstance;
