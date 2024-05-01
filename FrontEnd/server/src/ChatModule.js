import React, { useState, useEffect } from 'react';
import ChatBubble from './components/ChatBubble';
import InputBox from './components/InputBox';
import useApi from './API/useAPI';

const ChatModule = () => {
    const [shouldFetch, setShouldFetch] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const { fetchData, data, isLoading, error, setMessages: updateApiMessages } = useApi();

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
            console.log("messages: ", messages);
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
        console.log("data: ", data);
        setShouldFetch(true);
        setInputText('');
    };

    return (
        <>
            <p>Data</p>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <p>Error</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
            {messages.map((message, index) => (
                <ChatBubble key={index} message={message} isLoading={isLoading} />
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
