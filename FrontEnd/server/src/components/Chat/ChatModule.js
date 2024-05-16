import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import InputBox from '../InputBox';
import useChatCompletion from '../../API/useChatCompletion';
import { Box, Button } from '@mui/material';
import { useChat } from './ChatContext';
const ChatModule = () => {
    const [shouldFetch, setShouldFetch] = useState(false);
    const [inputText, setInputText] = useState('');

    const { fetchData, data, isLoading, error, setMessages: updateApiMessages } = useChatCompletion();
    const { chatHistory, currentChatIndex, setChatHistory,messages,setMessages,boilerPlateMessages,defaultSystemChat,handleShare } = useChat();
    const [isUnfinished, setIsUnfinished] = useState(false);
 
    const updateMessageInHistory = (index, newMessage) => {
        setChatHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            updatedHistory[index] = newMessage;
            console.log("Updating history at index", index, ": ", newMessage);
            return updatedHistory;
    });
};


     const resumeChat =()=>{
            const newMessages = [...defaultSystemChat,...messages];
            console.log("resumedChat: ", newMessages);
            updateApiMessages(newMessages);
            console.log("Server Data: ", data);
            setShouldFetch(true);
            setIsUnfinished(false);
        
     }




    useEffect(() => {
       if (chatHistory[currentChatIndex]) {
        setMessages(chatHistory[currentChatIndex]);
        if (chatHistory[currentChatIndex].length > 0) {
            const isUnfinished = chatHistory[currentChatIndex][chatHistory[currentChatIndex].length - 1].role === "user";
            console.log("Is conversation unfinished: ", isUnfinished);
            setIsUnfinished(isUnfinished);
        } else {
            setIsUnfinished(false);
        }
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
        //When getting the response from the server add the response to the chat history
       if(data && data.choices[0].message.content !== "" && !isLoading) {
            let { content, role } = data.choices[0].message;
            console.log("Server Response: ", content);
            
            // Check if the content includes the "%notLearned%" string Send the content to the shared
            if (content.includes("%notLearned%")) {
                // Remove the "%notLearned%" string from the content and send to the shared
                console.log("AI Unlearned context Found: ", content);
                content = content.replace(/%notLearned%/g, "");
                addMessage(content, role);
                handleShare()
            }else{
                addMessage(content, role);

            }

            
            console.log("currentIndex: ", currentChatIndex);

            // Scroll to the bottom of the page
            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'  // Smooth scroll makes the transition gradual but not working since bubble is currently dynamic
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
            
             {!isUnfinished && <InputBox 
                value={inputText}
                placeholder="Type your message here..."
                onChange={handleInputChange}
                onSend={handleSubmit}
                isDisabled={isLoading}
            />}
            {isUnfinished && <Button sx={{
                position: 'fixed',
                bottom: 0,
                left: '45%', 
                }} onClick={()=>resumeChat()}>Resume Chat</Button>}
            
            </Box>
           
        </>
    );
}

export default ChatModule;
