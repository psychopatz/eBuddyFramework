import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';

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
    boxShadow: `0px 2px 2px rgba(0, 0, 0, 0.4)`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
        borderColor: theme.palette.primary.main,
    },
    '&:focus': {
        borderColor: theme.palette.secondary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
    },
    '&:focus-visible': {
        outline: 'none',
    },
}));

const StyledStack = styled(Stack)(({ theme }) => ({
    position: 'fixed',
    bottom: 50,
    left: '15%', 
    right: '15%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    boxShadow: '0 -2px 4px rgba(0,0,0,0.4)',
    borderRadius: theme.shape.borderRadius,
    zIndex: 1200,
}));

const InputBox = ({ value, placeholder, onSend, onChange, isDisabled }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSend();
        }
    };

    return (
        <StyledStack direction="row" spacing={2} alignItems="center">
            <StyledTextarea
                aria-label="input area"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                style={{ flexGrow: 1, minHeight: '50px' }} 
            />
            <Button 
                variant="contained"
                endIcon={<SendIcon />}
                onClick={onSend}
                disabled={isDisabled}
            >
                Send
            </Button>
        </StyledStack>
    );
};

export default InputBox;
