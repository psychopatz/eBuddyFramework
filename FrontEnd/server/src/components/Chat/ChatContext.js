import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../../API/useLocalStorage';
import useFetchData from '../../API/useFetchData';
import GetCurrentDate from '../../Tools/GetCurrentDate';
import { ApiQuestion } from '../../API/ApiQuestion';

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export const ChatProvider = ({ children,isTemporary = false }) => {
    const [chatHistory, setChatHistory] = useLocalStorage('chatHistory', []);
    const [currentChatIndex, setCurrentChatIndex] = useLocalStorage('currentChatIndex', 0);
    const [messages, setMessages] = useState([]);
    const { data: systemChatData, isLoading: isLoadingSysChat, error: errorSysChat } = useFetchData('/prompts/chatPrompt');
    const { data: boilerPlateData, isLoading: isLoadingBoilerPlate, error: errorBoilerPlate } = useFetchData('/prompts/boilerPlateChat');



        const [defaultSystemChat, setDefaultSystemChat] = useState([{
            content: `The Current Time and Date today is ${GetCurrentDate()}. Your name is CITChat. You can only answer questions if its provided in the context. 
            If its not provided in the context Don't provide the answer, just say you're sorry that you don't know it yet and put %notLearned% at the end of your answer.
            Instead of saying "The context provided" say "My current knowledge" instead of stating if its not in the context. 
            If the user asks for a photo's or Logo, just give the exact photo link as long as it is in the context, if not found just don't provide.
            Always add an emoji to the end of your answer based on how you feel and greet the user.`,
            role: 'system'
        }]);

    const [boilerPlateMessages, setBoilerPlateMessages] = useState( [{
        content: "**CITChat** is *thinking*,",
        role: "assistant"
    }]);

    useEffect(() => { //Fetch System Chat From the server backend gitapulan kog optimize
        if (!isLoadingSysChat && systemChatData && !errorSysChat) {
            const newContent = `The Current Time and Date today is ${GetCurrentDate()}, ${systemChatData.content}`;
            setDefaultSystemChat([{ content: newContent, role: 'system' }]);
        }
    }, [systemChatData, isLoadingSysChat, errorSysChat]);

    useEffect(() => { //Fetch Boilerplate From the server backend gitapulan kog optimize
        if (!isLoadingBoilerPlate && boilerPlateData && !errorBoilerPlate) {
            const newContent = boilerPlateData.content || boilerPlateMessages[0].content;
            setBoilerPlateMessages([{ content: newContent, role: 'assistant' }]);
        }
    }, [boilerPlateData, isLoadingBoilerPlate, errorBoilerPlate]);


    const newChat = () => {
        if (messages.length !== 0) {
            setMessages([]);
            console.log("isTemporary: ",isTemporary);
            if(!isTemporary){ 
                setChatHistory([[], ...chatHistory]);
                setCurrentChatIndex(0); 
            }
            
        }
    };

    const loadHistory = (index) => {
        setCurrentChatIndex(index);
        // setMessages(chatHistory[index] || []);
        console.log("Loading history at index: ", index);
        window.location.reload();
    };

      const handleShare = () => {
        if (messages.length > 0) {
            const summaryContent = messages.length >= 2 ? messages[messages.length - 2].content : messages[0].content;
            const data = {
            "summary": summaryContent,
            "isResolved": false,
            "chatHistory": messages,
            };
            console.log('Create action initiated:', data);
            ApiQuestion.create(data)
            .then(response => {
               console.log("Share successful: ", response);
                
            })
            .catch(error => {
                console.error('Failed to create dataset:', error);
            }).finally(() => {
                // window. location. reload();
            })
            ;
            
        }
            
        };

    return (
        <ChatContext.Provider 
        value={{ chatHistory, setChatHistory, currentChatIndex, setCurrentChatIndex, messages, setMessages, newChat, loadHistory, boilerPlateMessages, defaultSystemChat,isTemporary,handleShare }}>
            {children}
        </ChatContext.Provider>
    );
};
