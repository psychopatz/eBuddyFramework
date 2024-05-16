import {axiosBackend,axiosFile} from './axiosInstance';

// Base URL for your API endpoints
const BASE_URL = 'http://localhost:8000';

// Function to upload a fileimport { axiosBackend, axiosFile } from './axiosInstances';

// Function to upload a file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axiosFile.post('/photos/upload/', formData);
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Function to retrieve an image by filename
export const getImage = async (filename) => {
  try {
    const response = await axiosBackend.get(`/photos/get/${filename}`);
    console.log('Retrieved image data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error retrieving image:', error);
    throw error;
  }
};
