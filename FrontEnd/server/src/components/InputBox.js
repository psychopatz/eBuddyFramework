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

const InputBox = ({ value, placeholder, onSend, onChange, isDisabled }) => {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            <StyledTextarea
                maxRows={4}
                aria-label="input area"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{ flexGrow: 1 }}
            />
            <Button 
                variant="contained" 
                endIcon={<SendIcon />} 
                onClick={onSend} 
                disabled={isDisabled}  // Use the `isDisabled` prop to control button's disabled state
            >
                Send
            </Button>
        </Stack>
    );
};

export default InputBox;
