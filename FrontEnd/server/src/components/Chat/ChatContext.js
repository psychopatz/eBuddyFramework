import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../../API/useLocalStorage';
import useFetchData from '../../API/useFetchData';
import getCurrentDate from '../../Tools/getCurrentDate';

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
    const [chatHistory, setChatHistory] = useLocalStorage('chatHistory', []);
    const [currentChatIndex, setCurrentChatIndex] = useLocalStorage('currentChatIndex', 0);
    const [messages, setMessages] = useState([]);
    const { data: systemChatData, isLoading: isLoadingSysChat, error: errorSysChat } = useFetchData('/prompts/chatPrompt');
    const { data: boilerPlateData, isLoading: isLoadingBoilerPlate, error: errorBoilerPlate } = useFetchData('/prompts/boilerPlateChat');

    const [defaultSystemChat, setDefaultSystemChat] = useState([{
        content: `Your name is CITChat. You can only answer questions about the provided context. If you know the answer but it is not based in the provided context, 
        don't provide the answer and say you're sorry you don't know yet. Don't say "The context provided" say "My current knowledge" just state the answer is not in the context provided. Always add an emoji to the end of your answer based on how you feel and greet the user.`,
        role: 'system'
    }]);

    const [boilerPlateMessages, setBoilerPlateMessages] = useState( [{
        content: "**CITChat** is *thinking*,",
        role: "assistant"
    }]);

    useEffect(() => {
        if (!isLoadingSysChat && systemChatData && !errorSysChat) {
            const newContent = `Current Date: ${getCurrentDate()}, ${systemChatData.content}`;
            setDefaultSystemChat([{ content: newContent, role: 'system' }]);
        }
    }, [systemChatData, isLoadingSysChat, errorSysChat]);

    useEffect(() => {
        if (!isLoadingBoilerPlate && boilerPlateData && !errorBoilerPlate) {
            const newContent = boilerPlateData.content || boilerPlateMessages[0].content;
            setBoilerPlateMessages([{ content: newContent, role: 'assistant' }]);
        }
    }, [boilerPlateData, isLoadingBoilerPlate, errorBoilerPlate]);


    const newChat = () => {
        if (messages.length !== 0) {
            setMessages([]);
            setChatHistory([[], ...chatHistory]);
            setCurrentChatIndex(0);
        }
    };

    const loadHistory = (index) => {
        setCurrentChatIndex(index);
        setMessages(chatHistory[index] || []);
    };

    return (
        <ChatContext.Provider value={{ chatHistory, setChatHistory, currentChatIndex, setCurrentChatIndex, messages, setMessages, newChat, loadHistory, boilerPlateMessages, defaultSystemChat }}>
            {children}
        </ChatContext.Provider>
    );
};
