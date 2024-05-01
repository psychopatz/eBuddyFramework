import React from 'react';
import { Paper, styled } from '@mui/material';
import FormatText from './FormatText';

const calculateWidth = (text) => {
    const baseSize = 8; // Minimum width as a percentage
    const maxSize = 55; // Maximum width as a percentage
    const lengthFactor = 0.5; // Factor to adjust scaling
    const textLength = text ? text.length : 0; // Ensure text is not undefined
    const calculatedWidth = Math.min(Math.max(baseSize, textLength * lengthFactor), maxSize);
    return `${calculatedWidth}%`;
};

const getStylesByRole = (role) => {
    switch (role) {
        case 'assistant':
            return {
                backgroundColor: '#E5E5EA',
                padding: '10px 24px',
                textAlign: 'left',
                color: "black",
                borderTopRightRadius: '15px',
                borderBottomRightRadius: '15px',
                borderBottomLeftRadius: '1px',
                marginRight: 'auto',
                '&:hover': {
                    backgroundColor: 'darkgrey',
                }
            };
        case 'user':
            return {
                backgroundColor: '#36A9FB',
                padding: '10px 24px',
                textAlign: 'left',
                color: "white",
                borderTopLeftRadius: '15px',
                borderBottomLeftRadius: '15px',
                borderBottomRightRadius: '1px',
                marginLeft: 'auto',
                '&:hover': {
                    backgroundColor: 'darkblue',
                }
            };
        default:
            return {
                backgroundColor: '#f4f4f4',
                textAlign: 'left'
            };
    }
};

const StyledPaper = styled(Paper)(({ theme, role, content }) => ({
    width: calculateWidth(content),
    marginBottom: '18px',
    borderRadius: '20px',
    boxShadow: theme.shadows[3],
    ...getStylesByRole(role),
}));

const ChatBubble = React.memo(({ message }) => (
    <StyledPaper role={message.role} content={message.content}>
        <h3>{message.role.toUpperCase()}</h3>
        <FormatText text={message.content} />
    </StyledPaper>
));

export default ChatBubble;
