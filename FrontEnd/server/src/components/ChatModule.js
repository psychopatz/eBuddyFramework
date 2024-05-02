import React, { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import InputBox from './InputBox';
import useChatCompletion from '../API/useChatCompletion';
import getCurrentDate from '../Tools/getCurrentDate';

const ChatModule = () => {
    const [shouldFetch, setShouldFetch] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const { fetchData, data, isLoading, error, setMessages: updateApiMessages } = useChatCompletion();

    const [boilerPlateMessages] = useState([
        {
        content: "**CITChat** is *thinking*, \nPlease Wait",
        role: "assistant"
    }]);

    const defaultSystemChat =[{
        content: `Youre name is CITChat. Date: ${getCurrentDate()} You can only answer questions about the provided context.
                  If you know the answer but it is not based in the provided context, dont provide the answer, 
                  just state the answer is not in the context provided. Always add an emoji to the end of your answer based on how you feel and greet the user.`,
        role: 'system'
        }]
    

    useEffect(() => {
        if (shouldFetch) {
            fetchData();
            setShouldFetch(false);
        }
    }, [shouldFetch, fetchData]);

    useEffect(() => {
        if(data && data.choices[0].message.content !== "" && !isLoading) {
            const { content, role } = data.choices[0].message;
            addMessage(content, role);
        }

    }, [data]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const addMessage = (content, role = "user") => {
        const newMessages = [...messages, { content, role }];
        setMessages(newMessages);
    }

    const handleSubmit = () => {
        if (!inputText.trim()) return;
        addMessage(inputText);
        updateApiMessages([...messages, { content: inputText, role: "user" }]);
        console.log("messages: ", messages);
        console.log("Boilerplate message: ", boilerPlateMessages);
        console.log("Server Data: ", data);
        setShouldFetch(true);
        setInputText('');
    };

    useEffect(() => {
        addMessage(defaultSystemChat[0].content, defaultSystemChat[0].role)
    },[])

    return (
        <>
            <p>Data</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <p>Error</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
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
        </>
    );
}

export default ChatModule;
