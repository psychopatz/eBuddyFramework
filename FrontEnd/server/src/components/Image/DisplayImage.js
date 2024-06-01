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

    return (
        <>
            {imageUrls.map(url => (
                <img
                    key={url}
                    src={url}
                    alt="Image Not Found"
                    style={defaultStyle}
                    onClick={() => onImageClick(url)}
                />
            ))}
        </>
    );
};

export default DisplayImage;
