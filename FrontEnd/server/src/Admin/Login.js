import { Box, Container, Typography } from "@mui/material";
import InputField from "../components/InputField";
import BtnCustom from "../components/BtnCustom";
import useLocalStorage from "../API/useLocalStorage";
import { useEffect, useState } from "react";
import { ApiAdmin } from "../API/ApiAdmin";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [loginError, setLoginError] = useState("");
   
    const navigate = useNavigate();
    const [adminCredentials,setAdminCredentials] = useLocalStorage('adminCredentials', {});
    useEffect(() => {
        const isAuthenticated = adminCredentials && Object.keys(adminCredentials).length > 0;
        if(isAuthenticated){
            navigate('/admin');
        }
    }, []);

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
                const credentials = await ApiAdmin.getById(response.data.id);//{id: response.data.id, email: data.get('email'), password: data.get('password')};
                console.log('Login successful', credentials);
                setAdminCredentials(credentials.data);
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
                    <Typography variant="body1">
                        Need an account? Register{' '}
                        <Typography
                            component="span"
                            onClick={() => navigate('/register')}
                            sx={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                color: 'primary.main',
                                display: 'inline'
                            }}
                            style={{ userSelect: "none" }}
                        >
                            here
                        </Typography>.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
