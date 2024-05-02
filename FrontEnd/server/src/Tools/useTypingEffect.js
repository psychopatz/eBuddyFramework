import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 100, mode = 'words') => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Split text according to the selected mode, preserving whitespace for 'words' mode
        const tokens = mode === 'words' ? text.match(/\S+\s*/g) : text.split("");
        if (index < tokens.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(prev => prev + tokens[index]);
                setIndex(prevIndex => prevIndex + 1);
            }, speed);
            return () => clearTimeout(timeoutId);
        }
    }, [text, speed, mode, index, displayedText]);

    return displayedText;
};

export default useTypingEffect;
