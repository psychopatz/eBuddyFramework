import { useState, useEffect } from 'react';
import {axiosBackend} from "./axiosInstance";

const useFetchData = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axiosBackend.get(url, {
                });
                setData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]); // Dependency array with url to refetch when url changes

    return { data, isLoading, error };
};

export default useFetchData;

