import React from 'react';
import { Paper, styled } from '@mui/material';
import FormatText from './FormatText';
import LoadingAnimations from './LoadingAnimation';

// Function to calculate dynamic width based on text length
const calculateWidth = (text) => {
    const baseSize = 8; // Minimum width as a percentage
    const maxSize = 55; // Maximum width as a percentage
    const lengthFactor = 0.5; // Length multiplier to scale width
    const textLength = text ? text.length : 0;
    return `${Math.min(Math.max(baseSize, textLength * lengthFactor), maxSize)}%`;
};

// Function to determine styles based on the message role
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
                display: 'none' // Hide system messages or any undefined role
            };
    }
};

// Styled component for the chat bubble
const StyledPaper = styled(Paper)(({ theme, role, content }) => ({
    width: calculateWidth(content),
    marginBottom: '18px',
    borderRadius: '20px',
    boxShadow: theme.shadows[3],
    ...getStylesByRole(role),
}));

// ChatBubble component displaying either loading animation or formatted text
const ChatBubble = React.memo(({ message, isLoading = false }) => {
    if (isLoading) {
        return (
            <StyledPaper role={"assistant"} content={"*The Assistant is thinking*, \nPlease Wait"}>
                <h3>{"ASSISTANT"}</h3>
                <FormatText text={"*The Assistant is thinking*, \nPlease Wait"} />
                <LoadingAnimations />
            </StyledPaper>
        );
    } else if (message.role !== 'system') {
        return (
            <StyledPaper role={message.role} content={message.content}>
                <h3>{message.role.toUpperCase()}</h3>
                <FormatText text={message.content} />
            </StyledPaper>
        );
    }

    return null; // Returns null if the role is 'system', effectively hiding it
});

export default ChatBubble;
