import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../API/useLocalStorage';

function ProtectedRoute({ children }) {
    const location = useLocation();
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});

    // Check if the credentials object is empty
    const isAuthenticated = adminCredentials && Object.keys(adminCredentials).length > 0;

    if (!isAuthenticated) {
        // Redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;
