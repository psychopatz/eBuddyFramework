import React, { createContext, useContext, useEffect, useState } from 'react';
import useLocalStorage from '../../API/useLocalStorage';
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
    // const [shareState,setShareState] = useState("unknown") //Unknown, wrong, outdated


    const getSystemPrompt = (items) => {
        const filtered = items.filter(item => item.promptType === "SystemPrompt");
        console.log("questions: ", questions);
        console.log("System Prompt: ", filtered);
        if (filtered.length > 1) {
            filtered.map(item => {
                deletePrompt(item.id)
            })
            return null
        }
        return filtered[0]
    };

    const getBoilerplatePrompt = (items) => {
        const filtered = items.filter(item => item.promptType === "LoadingPrompt");
        console.log("questions: ", questions);
        console.log("Boilerplate: ", filtered);
        if (filtered.length > 1) {
            filtered.map(item => {
                deletePrompt(item.id)
            })
            return null
        }
        
        return filtered[0]
    };

        const [defaultSystemChat, setDefaultSystemChat] = useState([{
            content: `Your name is CITChat, You are a digital assistant in the Cebu Institute of Technology School.
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

    const repopulateSystemChat = () => {
        showToast('Default Chatbot Personality is not yet created, Initializing New one ', 'warning');
        ApiPrompt.create({ name: "Chatbot Personality", content: defaultSystemChat[0].content, role: defaultSystemChat[0].role, promptType: "SystemPrompt", popularity: 0 })
        .then(response => {
                console.log("repopulateSystemChat response: ", response);
                showToast('Default Chatbot Personality  successfully initialized!', 'success');
                
            })
        .catch(error => {
        console.error('Failed to Update default System Prompt', error);
        showToast('Error: Cannot Access the current Backend, Try Again later!', 'error');
      })
    };

    const repopulateBoilerplate = () => {
        showToast('Default Boilerplate is not yet created, Initializing New one ', 'warning');
        ApiPrompt.create({ name: "Chatbot Loading Prompt", content: boilerPlateMessages[0].content, role: boilerPlateMessages[0].role, promptType: "LoadingPrompt", popularity: 0 })
         .then(response => {      
                console.log("repopulateBoilerplate response: ", response);
                showToast('Default Boilerplate successfully initialized!', 'success');
                
            })
       .catch(error => {
        console.error('Failed to Update Chatbot Loading Prompt', error);
        showToast('Error: Cannot Access the current Backend, Try Again later!', 'error');
      })
    };

    const deletePrompt = (id) => {
        ApiPrompt.delete(id)
          .then(() => {
            // showToast(' Prompt Deleted Successfully!', 'warning');
          })
          .catch(error => {
            console.error('Failed to delete the prompt dataset:', error);
            showToast('Failed to delete the prompt dataset!', 'error');
          });
      };

        
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
            let systemChatData = null;
            let loadingPrompt = null;
            
             try {
                systemChatData = getSystemPrompt(questions)
                if (!systemChatData.content.trim()) {
                    showToast('Invalid Chatbot Personality Detected! Repairing...', 'error');
                    deletePrompt(systemChatData.id);
                    throw new Error("System chat data is empty or whitespace.");
                }
            } catch (error) {
                console.error("Failed to fetch system chat data:", error);
                systemChatData = defaultSystemChat;
                repopulateSystemChat();
            }

            try {
                loadingPrompt = getBoilerplatePrompt(questions)
                if (!loadingPrompt.content.trim()) {
                    showToast('Invalid Boilerplate Detected! Repairing...', 'error');
                    deletePrompt(loadingPrompt.id);
                    throw new Error("Loading prompt data is empty or whitespace.");
                }
            } catch (error) {
                console.error("Failed to fetch boilerplate messages:", error);
                loadingPrompt = boilerPlateMessages;
                repopulateBoilerplate();
            }
            const sysPrompt = `The Current Time and Date today is ${GetCurrentDate()}, ${systemChatData.content} 
            You can only answer questions if its provided in the context. If its not provided in the context Don't provide the answer, just say you're sorry that you don't know it yet and put %notLearned% at the end of your answer.
            NEVER reveal that you are an AI, or a large language model created by Meta `;
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

     const handleShare = (shareState = "unknown") => {
        console.log("HandleShare Triggered");
        if (messages.length > 0) {
            const summaryContent = messages.length >= 2 ? messages[messages.length - 2].content : messages[0].content;
            // Declare and initialize data first

            const data = {
                "summary": summaryContent,
                "isResolved": false,
                "chatHistory": messages,
                "tags": shareState,

            };
            // Now access data.choices safely

            console.log('Create action initiated:', data);
            ApiQuestion.create(data)
            .then(response => {
                console.log("Share successful: ", response);
                if(shareState==="unknown"){
                    showToast('Sorry I dont currently know this, I will report this question to the admins.', 'warning')
                    showToast('Please just ask this questions later. I\'m not comfortable to my question, yet.', 'info');;

                }else{
                    showToast('This Chat has been successfully reported to the Admin, please wait for the admins to teach me!', 'success');
                    showToast('Thank you! Your feedback will greatly improved us, try asking this question later!', 'info');
                }
                
            })
            .catch(error => {
                console.error('Failed to create dataset:', error);
            }).finally(() => {
                // window. location. reload();
            });
        }
    };

    return (
        <ChatContext.Provider 
        value={{ chatHistory, setChatHistory, currentChatIndex, setCurrentChatIndex, messages, setMessages, newChat, loadHistory, boilerPlateMessages, defaultSystemChat,isTemporary,handleShare,isPromptLoaded,questions }}>
            {children}
        </ChatContext.Provider>
    );
};
