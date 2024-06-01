import React from 'react';

const DisplayImage = ({ imageUrls, onImageClick, style }) => {
    // Default styles for images
    const defaultStyle = {
        width: 'auto',
        height: '15vh',
        borderRadius: '5px',
        margin: '5px',
        ...style  // Merge custom style with default style
    };

    // Function to handle image loading errors
    const handleImageError = (e) => {
        e.target.src = "/imagePlaceholder.jpeg"; // Set placeholder image on error, assuming it's in the public folder
    };

    return (
        <>
            {imageUrls.map((url, index) => (
                <img
                    key={index}  // Using index as key because URL may not be unique
                    src={url}
                    alt="Photo"
                    style={defaultStyle}
                    onClick={() => onImageClick(url)}
                    onError={handleImageError}  // Add onError handler to replace the src with placeholder image
                />
            ))}
        </>
    );
};

export default DisplayImage;
