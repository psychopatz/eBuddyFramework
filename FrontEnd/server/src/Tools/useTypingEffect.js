import { useState, useEffect } from 'react';

const useTypingEffect = (text, speed = 100, mode = 'words') => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [blink, setBlink] = useState(true);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [blinkCount, setBlinkCount] = useState(0);

    useEffect(() => {
        let cursorBlinkInterval;
        if (isTypingComplete && blinkCount < 6) {
            cursorBlinkInterval = setInterval(() => {
                setBlink(prev => !prev);
                setBlinkCount(prevCount => prevCount + 1);
            }, 500);
        }

        return () => clearInterval(cursorBlinkInterval);
    }, [isTypingComplete, blinkCount]);

    useEffect(() => {
        const tokens = mode === 'words' ? text.match(/\S+\s*/g) : text.split("");
        if (index < tokens.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(prev => prev + tokens[index]);
                setIndex(prevIndex => prevIndex + 1);
            }, speed);
            return () => clearTimeout(timeoutId);
        } else {
            setIsTypingComplete(true);
        }
    }, [text, speed, mode, index, displayedText]);

    return `${displayedText}${blink && blinkCount < 6 ? '✏️' : ' '}`;
};

export default useTypingEffect;
