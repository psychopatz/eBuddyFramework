// hooks/useIngestText.js
import { useState } from 'react';
import {axiosLLM} from './axiosInstance';

const useIngestText = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const ingestText = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await axiosLLM.post('/ingest/text', data);
            setResponse(result.data);
        } catch (error) {
            setError(error.response ? error.response.data : 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    };

    return { response, error, isLoading, ingestText };
};

export default useIngestText;
