import {axiosBackend,axiosFile} from './axiosInstance';

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
