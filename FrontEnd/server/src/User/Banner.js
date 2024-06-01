import { Box } from '@mui/material';

const Banner = () => {
    return (
        <Box
            sx={{
                height: '1vh',
                width: '100%',  
                backgroundColor: 'primary.main', 
                padding: '20px 0', 
                display: 'flex', 
                justifyContent: 'center',  
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)' ,
                
                
            }}
        >
            <Box
                component="img"
                src="/logoText.png"
                alt="Company Logo"
                sx={{
                    width: { xs: '100px', sm: '130px' },  
                    height: 'auto', 
                }}
            />
        </Box>
    );
}

export default Banner;
