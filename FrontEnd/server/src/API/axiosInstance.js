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

export { axiosLLM, axiosBackend };
