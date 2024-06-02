import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'background.default',
                color: 'text.primary'
            }}
        >
            <Pseudo3dImage imageUrl="/landingImage.png" depthMapUrl="/landingImage_depth.png" />
            <Typography variant="h1" component="h1" gutterBottom>
                Error 404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Page not found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Typography>
            <Button variant="contained" onClick={goHome}>
                Go to Home Page
            </Button>
        </Box>
    );
};

export default NotFound;
