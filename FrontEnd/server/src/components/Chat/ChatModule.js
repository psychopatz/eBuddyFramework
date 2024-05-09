import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import InputBox from '../InputBox';
import useChatCompletion from '../../API/useChatCompletion';
// import getCurrentDate from '../../Tools/getCurrentDate';
// import useLocalStorage, { setItem, getItem, removeItem } from '../../API/useLocalStorage';
import { Box, Button } from '@mui/material';
import { useChat } from './ChatContext';
const ChatModule = () => {
    const [shouldFetch, setShouldFetch] = useState(false);
    // const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const { fetchData, data, isLoading, error, setMessages: updateApiMessages } = useChatCompletion();
    const { chatHistory, currentChatIndex, setChatHistory,messages,setMessages,boilerPlateMessages,defaultSystemChat } = useChat();
    // const [chatHistory, setChatHistory] = useLocalStorage('chatHistory', []);
    // const [currentChatIndex, setCurrentChatIndex] = useLocalStorage('currentChatIndex', 0);

    // const [boilerPlateMessages] = useState([
    //     {
    //     content: "**CITChat** is *thinking*, \nPlease Wait",
    //     role: "assistant"
    // }]);

    // const defaultSystemChat =[{
    //     content: `Current Date: ${getCurrentDate()}, Your name is CITChat. You can only answer questions about the provided context.
    //               If you know the answer but it is not based in the provided context, don't provide the answer and say youre sorry you don't know yet.
    //               Avoid saying "The context provided " say "My current knowledge"
    //               just state the answer is not in the context provided. Always add an emoji to the end of your answer based on how you feel and greet the user.`,
    //     role: 'system'
    // }];

    
    //Save ChatHistory to localStorage
    const updateMessageInHistory = (index, newMessage) => {
        setChatHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            updatedHistory[index] = newMessage;
            console.log("Updating history at index", index, ": ", newMessage);
            return updatedHistory;
    });
};


    //  const newChat =()=>{
    //      setMessages([]);
    //      setCurrentChatIndex(chatHistory.length-1);
    //      setChatHistory([]);
        
    //  }


    useEffect(() => {
        if(chatHistory[currentChatIndex]) {
            setMessages(chatHistory[currentChatIndex]);
        }
       
    }, []);

    useEffect(() => {
        if (shouldFetch) {
            fetchData();
            setShouldFetch(false);
        }
        console.log("currentIndex: ",currentChatIndex );
    }, [shouldFetch, fetchData]);

        
    useEffect(() => {
        if(data && data.choices[0].message.content !== "" && !isLoading) {
            const { content, role } = data.choices[0].message;
            addMessage(content, role);
            console.log("currentIndex: ",currentChatIndex );
            // Scroll to the bottom of the page
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'  // Smooth scroll makes the transition gradual
                });
            }, 1000);
            
            
        }

    }, [data]);

    

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const addMessage = (content, role = "user") => {
        const newMessages = [...messages, { content, role }];
        setMessages(newMessages);
        updateMessageInHistory(currentChatIndex,newMessages);
    };


    const handleSubmit = () => {
        if (!inputText.trim()) return;
        addMessage(inputText);
        const newMessages = [...defaultSystemChat,...messages, { content: inputText, role: "user" }];
        console.log("newMessages: ", newMessages);
        updateApiMessages(newMessages);
        console.log("messages: ", messages);
        console.log("Boilerplate message: ", boilerPlateMessages);
        console.log("Server Data: ", data);
        setShouldFetch(true);
        setInputText('');
    };


    return (
        <>

            <Box sx={{ paddingBottom: '100px', overflow: 'auto'}}>
                {messages.map((message, index) => (
                <>
                
                {index === messages.length - 1 && isLoading ? 
                <><ChatBubble key={index} message={message} isLoading={false}/><ChatBubble key={index} message={boilerPlateMessages[0]} isLoading={true}/></> : 
                <ChatBubble key={index} message={message} isLoading={false}/>}                
                </>
                
            ))}
             <InputBox 
                value={inputText}
                placeholder="Type your message here..."
                onChange={handleInputChange}
                onSend={handleSubmit}
                isDisabled={isLoading}
            />
            
            </Box>
           
        </>
    );
}

export default ChatModule;
