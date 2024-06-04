import * as React from 'react';
import { Button } from '@mui/material';

function BtnCustom({ children, onClick, type, variant, color, sx }) {
  return (
    <Button
      onClick={onClick}
      type={type}  // Ensuring the type prop is passed to the Button
      fullWidth
      variant={variant || 'contained'}
      color={color || 'primary'}
      sx={sx}
    >
      {children}
    </Button>
  );
}

export default BtnCustom;
