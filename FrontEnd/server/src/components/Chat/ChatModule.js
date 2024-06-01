import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import InputBox from '../InputBox';
import useChatCompletion from '../../API/useChatCompletion';
import { Box, Button, Typography } from '@mui/material';
import { useChat } from './ChatContext';
import ToggleableBox from '../Notification/ToggleableBox';
import theme from '../../theme';
import Carousel from '../Notification/Carousel';
import { ApiPrompt } from '../../API/ApiPrompt';


const ChatModule = () => {
    const [shouldFetch, setShouldFetch] = useState(false);
    const [inputText, setInputText] = useState('');

    const { fetchData, data, isLoading, error, setMessages: updateApiMessages } = useChatCompletion();
    const { chatHistory, currentChatIndex, setChatHistory,messages,setMessages,boilerPlateMessages,defaultSystemChat,handleShare,isTemporary,questions,isPromptLoaded } = useChat();
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
            console.log("Server Response: ", data.choices);
            console.log("Docs Source: ", data.choices[0].sources);
            
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

     const handleItemClick = async (item) => {
        console.log('Clicked item ID:', item.content);
        setInputText(item.content);
        handleSubmit(item.content);
        try {
            await ApiPrompt.incrementPopularity(item.id);
            } catch (error) {
            console.error('Error incrementing popularity:', error);
            }
  };
    const sortToPopular = (items) => {
        const sortedItems = [...items].sort((a, b) => b.popularity - a.popularity);
        return sortedItems;
    }



    return (
        <>

            <Box sx={{ 
                paddingBottom: '150px', 
                overflow: 'auto',
                width: 'auto'
            
        }}>
                    {isPromptLoaded && messages.length === 0 && <Box sx={{
                        position: 'fixed',
                        top: '50%',  // Adjust to place the carousel vertically center
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        zIndex: 10  // Ensures it stays above other content
                    }}>
                        <img src="/banner.png" alt="Logo" style={{ 
                                display: 'block',  // Makes the image block level to take width properties
                                margin: '0 auto',  // Automatically adjust margin to center the image
                                width: '130px', 
                                marginBottom: '100px' 
                            }}  />
                        <Carousel items={sortToPopular(questions.filter(item => item.promptType === "CommonQuestion"))} onItemClick={handleItemClick} />
                    </Box>}
                
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
                bottom: 50,
                left: '45%', 
                color: 'white'
                }} onClick={()=>resumeChat()}>Resume Chat</Button>}

            <Box sx={{
                    zIndex: 4930,
                    position: 'fixed',  // Corrected from 'fix' to 'fixed'
                    bottom: '1%',  // Adjusted for consistency
                    width: 'auto',
                    overflow: 'true',
                }}>
                    {(isTemporary && data) && (
                        <ToggleableBox title="Ingested Source">
                            {data && data.choices[0].sources.map((source, index) => (
                            <div key={index}>
                                <Typography>-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-</Typography>
                                <Typography variant="h6">Dataset File Name:</Typography>
                                <Typography>{source.document.doc_metadata.file_name}</Typography>

                                <Typography variant="h6">Ingested Document ID:</Typography>
                                <Typography>{source.document.doc_id}</Typography>
                                        
                                <Typography variant="h6">Part Where AI Read the Text:</Typography>
                                <Typography>{source.text}</Typography>

                                <Typography variant="h6">Confidence Score:</Typography>
                                <Typography>{source.score}</Typography>
                                <Typography>-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-</Typography>
                                
                            </div>
                            ))}
                        </ToggleableBox>
                        )}

                </Box>
            
            </Box>
           
        </>
    );
}

export default ChatModule;
