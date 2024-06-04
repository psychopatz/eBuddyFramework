import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import Pseudo3dImage from '../components/Image/Pseudo3dImage';

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
                color: 'text.primary'
            }}>
            <Canvas style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                filter: 'blur(12px)'
            }}>
                <Pseudo3dImage imageUrl="/citLogo.jpg" depthMapUrl="/citLogo_depth.jpg" imgScale={0.5} />
            </Canvas>
        
            <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 2, color: 'primary.main', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                Error 404
            </Typography>
            <Typography variant="h3" sx={{ mb: 2, color: 'secondary.main', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }} >
                Page not found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Typography>
            <Button variant="contained" onClick={goHome}>
                Go to Home Page
            </Button>
        </Box>
    );
};

export default NotFound;
