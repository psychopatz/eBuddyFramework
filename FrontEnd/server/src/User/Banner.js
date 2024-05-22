import { Box } from '@mui/material';

const Banner = () => {
    return (
        <Box
            sx={{
                width: '100%',  // Full width of the container
                backgroundColor: 'primary.main',  // Use theme's primary color
                padding: '20px 0',  // Vertical padding
                display: 'flex',  // Flexbox container
                justifyContent: 'center',  // Center horizontally
                alignItems: 'center',  // Center vertically
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'  // Subtle shadow for depth
            }}
        >
            <Box
                component="img"
                src="/logoText.png"
                alt="Company Logo"
                sx={{
                    width: { xs: '100px', sm: '130px' },  // Responsive width
                    height: 'auto',  // Maintain aspect ratio
                }}
            />
        </Box>
    );
}

export default Banner;
