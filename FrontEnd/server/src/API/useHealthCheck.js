import axios from 'axios';
import { useState, useEffect } from 'react';

// Custom hook for performing a GET request
function useHealthCheck(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(url, {
      headers: {
        'accept': 'application/json'
      }
    })
    .then(response => {
      setData(response.data);
      setLoading(false);
    })
    .catch(error => {
      setError(error);
      setLoading(false);
    });
  }, [url]);

  return { data, loading, error };
}

// Example component using the custom hook
function HealthCheck() {
  const { data, loading, error } = useHealthCheck('http://localhost:8001/health');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;

  return (
    <div>
      <h1>Health Check Status</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export { useHealthCheck, HealthCheck };
