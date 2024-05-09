import React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import { styled } from '@mui/material/styles';

const StyledTextarea = styled(BaseTextareaAutosize)(({ theme }) => ({
    boxSizing: 'border-box',
    width: '100%',
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: theme.typography.lineHeight,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0px 2px 2px rgba(0, 0, 0, 0.1)`,
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
    '&:focus': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
    },
    '&:focus-visible': {
        outline: 'none',
    },
}));

const StyledStack = styled(Stack)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: '30%', // Start at 25% from the left to center the stack that takes up 50% width
    right: '30%', // Ensures the total width is 50% by also setting right to 25%
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    boxShadow: '0 -2px 4px rgba(0,0,0,0.1)',
    zIndex: 1200,

    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightRegular,
    lineHeight: theme.typography.lineHeight,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: `0px 2px 2px rgba(0, 0, 0, 0.1)`,
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
    '&:focus': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
    },
    '&:focus-visible': {
        outline: 'none',
    },
}
    
));

const InputBox = ({ value, placeholder, onSend, onChange, isDisabled }) => {
    return (
        <StyledStack direction="row" spacing={2} alignItems="center">
            <textarea
                aria-label="input area"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{ flexGrow: 1, height: '50px' }} // Example height, adjust as needed
            />
            <button 
                type="button"
                onClick={onSend}
                disabled={isDisabled}
            >
                Send
            </button>
        </StyledStack>
    );
};

export default InputBox;
