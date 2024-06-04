import Pseudo3dImage from "../../components/Image/Pseudo3dImage";
import { styled } from '@mui/material/styles';
import { Canvas } from '@react-three/fiber';
import { Box, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
import BtnCustom from "../../components/component/BtnCustom";

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
  left: 0, // Align left to 0 to start from the left edge
  transform: 'translateY(-50%)', // Adjust only vertically to center
  width: '100%', // Set width to 100% of its parent
  padding: theme.spacing(4), // Use theme spacing for consistent padding
  borderRadius: theme.shape.borderRadius, // Use theme border radius
  display: 'flex',
  flexDirection: 'column', // Stack children vertically
  alignItems: 'center', // Center children horizontally
  justifyContent: 'center', // Center children vertically
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
}));


const LandingPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
    console.log('User Clicked to Chat!');
    navigate('/chat') 

  };
    return (
        <FullScreenWrapper>
            <StyledBox>
                <img src="/banner.png" alt="Logo" style={{ width: '130px', marginBottom: '20px', filter: 'drop-shadow(10px 10px 5px rgba(0,0,0,0.5))' }} />
                <Typography variant="h4" sx={{ color: 'primary.light', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                    Ask anything with CITChat: AI-Machine Learning Powered Support for the CIT Community
                </Typography>
                <Typography variant="h5" sx={{ color: 'secondary.main', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                    A chat system specifically designed to streamline and enhance communication about CIT 
                    information services.
                </Typography>
                <Typography variant="h5" sx={{ color: 'secondary.main', textAlign: 'center', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                     Our innovative solution leverages machine learning and a Large Language Model to provide on-demand
                    responses to queries about CIT operations, enrollment, accounts, and more, available anytime and anywhere.
                </Typography>
                <BtnCustom
                        onClick={handleClick}
                        type="button"
                        variant="outlined"
                        color="primary"
                        sx={{ mt: 2 , width: '30%', 
                        backgroundColor: 'transparent',
                        color: 'white',
                        borderColor: 'primary.light'}}  
                    >
                        Start Chatting →
                    </BtnCustom>
            </StyledBox>
            <Canvas style={{
                width: '100%',
                height: '100%',
                filter: 'brightness(90%)'
            }}>
                <Pseudo3dImage imageUrl="/landingImage.jpg" depthMapUrl="/landingImage_depth.jpg" />
            </Canvas>
        </FullScreenWrapper>
    );
}

export default LandingPage;
