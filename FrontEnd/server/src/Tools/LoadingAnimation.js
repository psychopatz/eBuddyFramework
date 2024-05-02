import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

function LoadingAnimation({ color = 'primary' }) {
  return (
    <Box sx={{
      width: '100%',
      '& > * + *': {
        marginTop: 2, // uses the theme's spacing multiplier
      },
    }}>
      <LinearProgress color={color} />
    </Box>
  );
}

export default LoadingAnimation;
