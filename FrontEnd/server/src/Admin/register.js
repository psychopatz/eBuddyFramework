import { Box, Container, Typography } from "@mui/material";
import InputField from "../components/InputField";
import BtnCustom from "../components/BtnCustom";
import { ApiAdmin } from "../API/ApiAdmin";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../API/useLocalStorage";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();
    const [adminCredentials,setAdminCredentials] = useLocalStorage('adminCredentials', {});
    useEffect(() => {
        const isAuthenticated = adminCredentials && Object.keys(adminCredentials).length > 0;
        if(isAuthenticated){
            // Redirect to dashboard or home page here if needed
            navigate('/admin');
        }
       
    }, []);

 const handleSubmit = async (event) => {
        event.preventDefault(); 
        const data = new FormData(event.currentTarget);
        
        if (data.get('password') !== data.get('Repassword')) {
            alert("Password does not match");
            return;  // Stop further execution if passwords don't match
        }

        const adminData = {
            email: data.get('email'),
            password: data.get('password'),
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            profile_picture: ""
        };

        try {
            const response = await ApiAdmin.create(adminData);
            alert("Registration successful");
            console.log('Registered admin:', response.data); // Log or handle the response as needed
            setAdminCredentials(adminData);
            navigate('/admin');
        } catch (error) {
            console.error('Error registering admin:', error);
            if (error.response && error.response.status === 400) {
                alert("Registration failed: Email is already taken");
            } else {
                alert("Registration failed: Please try again later.");
            }
        }
    };


    
    

    return (
        <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Admin Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <InputField
            label="Your First Name"
            name="firstName"
            type="text"
            // autoComplete="current-password"
            required
          />
          <InputField
            label="Your Last Name"
            name="lastName"
            type="text"
            // autoComplete="current-password"
            required
          />
          <InputField
            label="Email Address"
            name="email"
            // autoComplete="email"
            required
            autoFocus
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            // autoComplete="current-password"
            required
          />
          <InputField
            label="Retype Password"
            name="Repassword"
            type="password"
            // autoComplete="current-password"
            required
          />

          

          <BtnCustom type="submit" sx={{ mt: 3, mb: 2 }}>
            Register
          </BtnCustom>

          

          
        </Box>
      </Box>
    </Container>
      );
}
 
export default Register;
