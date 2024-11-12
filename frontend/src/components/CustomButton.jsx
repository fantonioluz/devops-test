import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ children, onClick, color = "primary", variant = "contained", ...props }) => {
  return (
    <Button onClick={onClick} color={color} variant={variant} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
