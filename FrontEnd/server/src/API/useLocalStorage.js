import { useState, useEffect } from 'react';

// Custom hook for managing a single key in localStorage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    };

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : null);
            } catch (error) {
                console.error('Error reading from localStorage:', error);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key]);

    return [storedValue, setValue];
}

// Utility function to set item in localStorage
export const setItem = (key, value) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting localStorage item:', error);
    }
};

// Utility function to get item from localStorage
export const getItem = (key) => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error getting localStorage item:', error);
    }
};

// Utility function to remove item from localStorage
export const removeItem = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing localStorage item:', error);
    }
};

export default useLocalStorage;
