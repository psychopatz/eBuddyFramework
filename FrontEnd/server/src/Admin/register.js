import { Box, Container, Typography, Alert } from "@mui/material";
import InputField from "../components/InputField";
import BtnCustom from "../components/BtnCustom";
import { ApiAdmin } from "../API/ApiAdmin";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../API/useLocalStorage";
import { useState, useEffect } from "react";

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
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
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
  );
}

export default Register;
