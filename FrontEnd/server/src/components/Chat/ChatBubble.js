import React, { useState } from 'react';
import { Paper, styled } from '@mui/material';
import FormatText from '../FormatText';
import useTypingEffect from '../../Tools/useTypingEffect';
import LoadingAnimation from '../../Tools/LoadingAnimation';
import Modal from '../Image/Modal';

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

// Function to check if a string is a URL of an image
const findImageUrls = (text) => {
    // Regex to match URLs inside and outside quotation marks, capturing the entire URL
    const regex = /(?:"|')(https?:\/\/\S+?\.(jpeg|jpg|gif|png))(?:"|')|(https?:\/\/\S+?\.(jpeg|jpg|gif|png))/ig;
    let match;
    const urls = [];
    while ((match = regex.exec(text)) !== null) {
        // Extract URL and check if it includes quotes, remove them if necessary
        const url = match[1] || match[3]; // match[1] for quoted, match[3] for non-quoted URLs
        // Replace the localhost base URL with the environment variable, if applicable
        const updatedUrl = url.replace("http://localhost:8000", process.env.REACT_APP_BACKEND_URL);
        urls.push(updatedUrl);
        // console.log("Image URL found:", updatedUrl);
    }
    if (urls.length > 0) {
        return urls;
    }
    // console.log("No image URLs found.");
    return [];
};


// ChatBubble component displaying either loading animation or formatted text or image
const ChatBubble = React.memo(({ message, isLoading = false,typingSpeed = 20 }) => {
    const [modalImage, setModalImage] = useState(null);
    const modifiedContent = message.content.replace(/http:\/\/localhost:8000/g, process.env.REACT_APP_BACKEND_URL);
    const typingText = useTypingEffect(modifiedContent, typingSpeed);
    const imageUrls = findImageUrls(modifiedContent);
    // console.log("imageUrl: ", imageUrls);

    const handleImageClick = (url) => {
        setModalImage(url);
    };

    const handleCloseModal = () => {
        setModalImage(null);
    };

    if (message.role !== 'system') {
        return (

            <>
            <Modal isOpen={modalImage !== null} onClose={handleCloseModal}>
                <img src={modalImage} alt="Full Size" style={{ maxHeight: '90%', maxWidth: '90%', borderRadius: '10px' }} />
            </Modal>
            <StyledPaper role={message.role} content={modifiedContent}>
                {message.role === "assistant" && <img src={'/logo.png'} alt="Logo" style={{ width: '6%', height: '6%', float: 'left' }} />}
                <h3>{message.role === "assistant" ? "": message.role.toUpperCase()}</h3>
                {imageUrls.map(url => (
                    <img key={url} src={url} alt="Image Not Found" style={{ maxWidth: '30%', borderRadius: '5px', margin: '5px' }} onClick={() => handleImageClick(url)} />
                ))}
                <FormatText text={(message.role === 'assistant' && !isLoading ? typingText : modifiedContent)
              } />
                {(isLoading) && <LoadingAnimation />}
            </StyledPaper>
            
            </>
        );
    }

    return null; // Returns null if the role is 'system', effectively hiding it
});

export default ChatBubble;
