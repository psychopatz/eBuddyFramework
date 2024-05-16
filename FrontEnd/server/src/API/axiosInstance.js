import axios from 'axios';

const axiosLLM = axios.create({
  baseURL: `${process.env.REACT_APP_LLM_URL}/v1`,
  headers: {
    'Accept': 'application/json'
  }
});
const axiosBackend = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
  headers: {
    'Accept': 'application/json'
  }
});

const axiosFile = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});


export { axiosLLM, axiosBackend, axiosFile };
