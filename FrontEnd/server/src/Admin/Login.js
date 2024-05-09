import { Box, Container, Typography } from "@mui/material";
import InputField from "../components/InputField";
import BtnCustom from "../components/BtnCustom";

const Login = () => {

    const handleSubmit = (event) => {
    event.preventDefault();  // Prevents the default form submission mechanism
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),  // Fetching the email from the form
      password: data.get('password'),  // Fetching the password from the form
    });
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <InputField
            label="Email Address"
            name="email"
            autoComplete="email"
            required
            autoFocus
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <BtnCustom type="submit" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </BtnCustom>
        </Box>
      </Box>
    </Container>
      );
}
 
export default Login;
