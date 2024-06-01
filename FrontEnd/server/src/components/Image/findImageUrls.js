// utils/imageUrlFinder.js

// Function to check if a string is a URL of an image
export const findImageUrls = (text, backendBaseUrl = process.env.REACT_APP_BACKEND_URL) => {
    // Regex to match URLs inside and outside quotation marks, capturing the entire URL
    const regex = /(?:"|')(https?:\/\/\S+?\.(jpeg|jpg|gif|png))(?:"|')|(https?:\/\/\S+?\.(jpeg|jpg|gif|png))/ig;
    const urls = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Extract URL and check if it includes quotes, remove them if necessary
        const url = match[1] || match[3]; // match[1] for quoted, match[3] for non-quoted URLs
        // Replace the localhost base URL with the provided backend base URL
        const updatedUrl = url.replace("http://localhost:8000", backendBaseUrl);
        urls.push(updatedUrl);
    }

    return urls.length > 0 ? urls : [];
};

