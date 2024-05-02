import { useState } from 'react';
import axiosInstance from './axiosInstance';


const useIngestDocument = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadDocument = async (file) => {
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Set headers specifically for this request
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/ingest/file', formData, config);
      setData(response.data);  // Assume the response returns the data directly
      setError(null);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadDocument, data, isLoading, error };
};

export default useIngestDocument;
