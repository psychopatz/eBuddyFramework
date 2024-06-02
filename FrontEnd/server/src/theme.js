import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#830404",  // Your primary color
      light: "#a83636"  // Lighter shade of primary color for input background or border
    },
    secondary: {
      main: "#F2B20E",  // Your secondary color
    },
    error: {
      main: '#ff0000',  // Your error color
    },
    background: {
      default: '#FADD90',  // Your background color
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.25)', // Adds a light background to all text fields
          '& label.Mui-focused': {
            color: '#830404',  // Label color when focused
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#830404',  // Underline color when focused
          },
          '& .MuiOutlinedInput-root': {
            '& input': {
              color: 'black',  // Set text color to black for all input fields
            },
            '& fieldset': {
              borderColor: '#a83636',  // Default border color
            },
            '&:hover fieldset': {
              borderColor: '#830404',  // Border color when hovered (optional)
            },
            '&.Mui-focused fieldset': {
              borderColor: '#830404',  // Border color when focused
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.9)', // Changes the label color
              top: '0px', // Adjust label position for alignment
              '&.Mui-focused': {
                color: '#830404', // Keeps label color when focused
                top: '-6px' // Adjust label position for focus state
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'white',  // Sets placeholder text color to white
              opacity: 0.8  // Ensures full opacity for placeholder text
            }
          },
          
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',  // Removes uppercase styling from buttons
          backgroundColor: '#830404',  // Primary button color
          '&:hover': {
            backgroundColor: '#a83636',  // Button hover color using lighter shade
          }
        }
      }
    }
  },
  
  typography: {
    fontFamily: 'Arial, sans-serif',  // Example: Set a default font family
    button: {
      fontWeight: 600,  // Ensures button text is bold
    },
  }
});

export default theme;
