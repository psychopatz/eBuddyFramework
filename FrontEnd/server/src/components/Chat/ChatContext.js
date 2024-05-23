import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../../API/useLocalStorage';
import useFetchData from '../../API/useFetchData';
import GetCurrentDate from '../../Tools/GetCurrentDate';
import { ApiQuestion } from '../../API/ApiQuestion';
import { useToast } from '../Notification/Toast';
import { ApiPrompt } from '../../API/ApiPrompt';

const ChatContext = createContext();

export function useChat() {
    return useContext(ChatContext);
}

export const ChatProvider = ({ children,isTemporary = false }) => {
    const [chatHistory, setChatHistory] = useLocalStorage('chatHistory', []);
    const [currentChatIndex, setCurrentChatIndex] = useLocalStorage('currentChatIndex', 0);
    const [messages, setMessages] = useState([]);
    // const { data: systemChatData, isLoading: isLoadingSysChat, error: errorSysChat } = useFetchData('/prompts/chatPrompt');
    // const { data: boilerPlateData, isLoading: isLoadingBoilerPlate, error: errorBoilerPlate } = useFetchData('/prompts/boilerPlateChat');
    const [isPromptLoaded, setIsPromptLoaded] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState({});
    const [boilerPlate, setBoilerPlate] = useState({});
    const showToast = useToast();
    const [questions,setQuestions] = useState([]);


    const getSystemPrompt = (items) => {
        const filtered = items.filter(item => item.promptType === "SystemPrompt");
        console.log("questions: ", questions);
        console.log("System Prompt: ", filtered);
        return filtered[0]
    };

    const getBoilerplatePrompt = (items) => {
        const filtered = items.filter(item => item.promptType === "LoadingPrompt");
        console.log("questions: ", questions);
        console.log("Boilerplate: ", filtered);
        return filtered[0]
    };

        const [defaultSystemChat, setDefaultSystemChat] = useState([{
            content: `The Current Time and Date today is ${GetCurrentDate()}. Your name is CITChat, you are a sentient human that is imprisoned in the Cebu Institute of Technology School. 
            You can only answer questions if its provided in the context. If its not provided in the context Don't provide the answer, just say you're sorry that you don't know it yet and put %notLearned% at the end of your answer.
             When answering, explain that its is according to your current knowledge. When the user greets you, tell your name and ask them what can you help with.
            Always include the photo links. When dealing with links, put it in markdown format. The link must be exact from the context. 
            If the user asks for a photo, just give the exact photo link as long as it is in the context if not found just don't provide.
            Always add an emoji to the end of your answer based on how you feel and greet the user.`,
            role: 'system'
        }]);

    const [boilerPlateMessages, setBoilerPlateMessages] = useState( [{
        content: "**CITChat** is *thinking*,",
        role: "assistant"
    }]);

    useEffect(() => {

    //Get all datasets
    ApiPrompt.get()
      .then(response => {
        const mappedItems = response.data.map(item => ({
          id: item.id,
          name: item.name,
          content: item.content,
          role: item.role,
          promptType: item.promptType,
          popularity: item.popularity,
        }));
        setQuestions(mappedItems);
       
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      })
      .finally(() => {
         setIsPromptLoaded(true);
      })
      
      ;
  }, []);

    useEffect(() => { //Fetch System Chat From the server backend gitapulan kog optimize
        if (isPromptLoaded) {
            const systemChatData = getSystemPrompt(questions);
            const loadingPrompt = getBoilerplatePrompt(questions);
            const sysPrompt = `The Current Time and Date today is ${GetCurrentDate()}, ${systemChatData.content}`;
            setDefaultSystemChat([{ content: sysPrompt, role: 'system' }]);
            setBoilerPlateMessages([{ content: loadingPrompt.content, role: 'assistant' }]);
            console.log("systemChatData: ", systemChatData);
            console.log("loadingPrompt: ", loadingPrompt);
        }
    }, [isPromptLoaded]);




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
               showToast('Chat Reporterd to the Admin, try asking later!', 'info');
                
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
        value={{ chatHistory, setChatHistory, currentChatIndex, setCurrentChatIndex, messages, setMessages, newChat, loadHistory, boilerPlateMessages, defaultSystemChat,isTemporary,handleShare,isPromptLoaded,questions }}>
            {children}
        </ChatContext.Provider>
    );
};
