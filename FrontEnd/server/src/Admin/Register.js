import { Box, Container, Typography, Alert } from "@mui/material";
import InputField from "../components/InputField";
import BtnCustom from "../components/BtnCustom";
import { ApiAdmin } from "../API/ApiAdmin";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../API/useLocalStorage";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Canvas } from '@react-three/fiber';
import Pseudo3dImage from "../components/Image/Pseudo3dImage";


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

const Register = () => {
  const navigate = useNavigate();
  const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const isAuthenticated = adminCredentials && Object.keys(adminCredentials).length > 0;
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [adminCredentials, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Validate email
    const email = data.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (data.get('password') !== data.get('repassword')) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const adminData = {
      email: email,
      password: data.get('password'),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      profile_picture: "" 
    };

    try {
      const response = await ApiAdmin.create(adminData);
      setAdminCredentials(response.data);
      navigate('/admin');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "An unexpected error occurred. Please try again later.";
      setError(errorMessage);
      console.error('Error registering admin:', error);
    }
  };

  return (
    <FullScreenWrapper>
            <StyledBox>
                <img src="/banner.png" alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{color: 'secondary.main'}}>
          Admin Registration
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {passwordError && <Alert severity="error">{passwordError}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <InputField label="Your First Name" name="firstName" type="text" required />
          <InputField label="Your Last Name" name="lastName" type="text" required />
          <InputField label="Email Address" name="email" required autoFocus />
          <InputField label="Password" name="password" type="password" required />
          <InputField label="Retype Password" name="repassword" type="password" required />
          <BtnCustom type="submit" sx={{ mt: 3, mb: 2 }}>
            Register
          </BtnCustom>
        </Box>
      </Box>
    </Container>
            </StyledBox>
            <Canvas style={{
                width: '100%',
                height: '100%',
                filter: 'brightness(30%)'
            }}>
                <Pseudo3dImage imageUrl="/landingImage.jpg" depthMapUrl="/landingImage_depth.jpg" />
            </Canvas>
        </FullScreenWrapper>
    
  );
}

export default Register;
