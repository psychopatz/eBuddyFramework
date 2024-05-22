import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '2%',
                position: 'fixed',  // Fix position to the bottom
                bottom: 0,  // Align to bottom
                backgroundColor: 'primary.main',  // Use theme's primary color
                padding: '20px 0',  // Vertical padding
                display: 'flex',  // Flexbox container
                justifyContent: 'center',  // Center horizontally
                alignItems: 'center',  // Center vertically
                boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.4)',  // Shadow for depth, adjusted to top of footer
                zIndex: 1000  // Ensure it stays on top of other content
            }}
        >
            <Typography variant="h6" color="white" sx={{fontSize: '80%'}}>
                CITChat can make mistakes. Please Check important info and Report.
            </Typography>
        </Box>
    );
}

export default Footer;
