import { Box, Container, Typography, Link } from "@mui/material";
import InputField from "../components/InputField";
import BtnCustom from "../components/BtnCustom";
import useLocalStorage from "../API/useLocalStorage";
import { useEffect, useState } from "react";
import { ApiAdmin } from "../API/ApiAdmin";
import { useNavigate } from "react-router-dom";

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
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {loginError && (
                    <Typography color="error">{loginError}</Typography>
                )}
                <Typography component="h1" variant="h4">
                    Welcome to CITChat
                </Typography>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <InputField label="Email Address" name="email" autoComplete="email" required autoFocus />
                    <InputField label="Password" name="password" type="password" autoComplete="current-password" required />
                    <BtnCustom type="submit" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </BtnCustom>
                    <Typography variant="body2">
                        Need an account? Register <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}>here</Link>.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
