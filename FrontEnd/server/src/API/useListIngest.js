// src/hooks/useListIngest.js
import { useState, useEffect } from 'react';
import {axiosLLM} from './axiosInstance.js';

const useListIngest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosLLM.get('/ingest/list');
        setData(response.data);  // Assume the response has the data directly
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useListIngest;
