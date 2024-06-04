import { Box, Container, Typography, Link } from "@mui/material";
import InputField from "../components/component/InputField";
import BtnCustom from "../components/component/BtnCustom";
import useLocalStorage from "../API/useLocalStorage";
import { useEffect, useState } from "react";
import { ApiAdmin } from "../API/ApiAdmin";
import { useNavigate } from "react-router-dom";
import { Canvas } from '@react-three/fiber';
import Pseudo3dImage from "../components/Image/Pseudo3dImage";
import { styled } from '@mui/material/styles';


const FullScreenWrapper = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1, // Ensure it's above other elements if necessary
  backgroundColor: 'primary.main', // Optional, based on your theme or preference
  display: 'flex', // Added to use flexbox for centering
  alignItems: 'center', // Aligns children vertically in the center
  justifyContent: 'center', // Aligns children horizontally in the center
});

const StyledBox = styled(Box)(({ theme }) => ({
  zIndex: 10, // Ensures the box is above the canvas
  position: 'absolute', // Keep position absolute to layer it on top of the Canvas
  top: '50%', // Set top to 50% of its parent
  left: '50%', // Set left to 50% of its parent
  transform: 'translate(-50%, -50%)', // Adjust for centered positioning
  padding: theme.spacing(4), // Use theme spacing for consistent padding
  borderRadius: theme.shape.borderRadius, // Use theme border radius
  display: 'flex',
  flexDirection: 'column', // Stack children vertically
  alignItems: 'center', // Center children horizontally
  justifyContent: 'center', // Center children vertically
}));

const Login = () => {
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});

    useEffect(() => {
        // Check if admin is already authenticated
        const isAuthenticated = adminCredentials && Object.keys(adminCredentials).length > 0;
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [adminCredentials, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginData = {
            email: data.get('email'),
            password: data.get('password')
        };

        try {
            const response = await ApiAdmin.login(loginData);
            if (response.status === 200) {
                console.log('Login successful', response.data);
                setAdminCredentials(response.data); // Assuming the backend sends back necessary admin data
                navigate('/admin');
            } else {
                throw new Error('Failed to log in');
            }
        } catch (error) {
            setLoginError(error.response ? error.response.data.detail : "An unexpected error occurred");
            console.error('Login error:', error);
        }
    };

    return (
        <FullScreenWrapper>
            <StyledBox>
                <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                {loginError && (
                    <Typography color="error">{loginError}</Typography>
                )}
                <Typography component="h1" variant="h4" sx={{color: 'secondary.main'}}>
                    Welcome to
                </Typography>
                <img src="/banner.png" alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <Typography component="h1" variant="h5" sx={{color: 'primary.main'}}>
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <InputField label="Email Address" name="email" autoComplete="email" required autoFocus />
                    <InputField label="Password" name="password" type="password" autoComplete="current-password" required />
                    <BtnCustom type="submit" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </BtnCustom>
                    <Typography variant="body2" sx={{color: 'secondary.main'}}>
                        Need an account? Register <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}>here</Link>.
                    </Typography>
                </Box>
            </Box>
        </Container>
            </StyledBox>
            <Canvas style={{
                width: '100%',
                height: '100%',
                filter: 'brightness(10%)'
            }}>
                <Pseudo3dImage imageUrl="/landingImage.jpg" depthMapUrl="/landingImage_depth.jpg" />
            </Canvas>
        </FullScreenWrapper>

        
    );
}

export default Login;
