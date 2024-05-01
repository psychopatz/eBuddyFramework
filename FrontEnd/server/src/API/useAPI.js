import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = (initialMessages, url = 'http://localhost:8001/v1/chat/completions') => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState(initialMessages);

  // Ensuring that fetchData uses the latest messages without needing dependencies in useEffect
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Updated to only send the current messages, assume initialMessages is managed outside or included in messages
    const postData = {
      include_sources: true,
      messages: messages,
      stream: false,
      use_context: false
    };

    try {
      const response = await axios.post(url, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setData(response.data);
    } catch (error) {
      setError(error);
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, url]); // include url in the dependency array if it's dynamic

  return { fetchData, data, isLoading, error, messages, setMessages };
};

export default useApi;
