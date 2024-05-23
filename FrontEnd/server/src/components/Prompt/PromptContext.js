import React, { useState, useEffect, createContext } from 'react';
import { ApiPrompt } from '../../API/ApiPrompt'; // Adjust the path as necessary
import { useToast } from '../Notification/Toast';
import DelayedReload from '../../Tools/DelayedReload';

export const PromptContext = createContext(); // Export context if needed elsewhere

export const PromptProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [promptType, setPromptType] = useState("CommonQuestion");
  const [ingestsDocs, setIngestsDocs] = useState([]);
  const [isCreating, setIsCreating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const delayedReload = DelayedReload({ delay: 3000 });
  const showToast = useToast();
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    content: '',
    role: '',
    promptType: '',
    popularity: 0
  });

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
        setItems(mappedItems);
        console.log('Datasets fetched:', response.data);
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      });

     

      
  }, []);
   const handleListItemClick = (id) => {
    const selectedItem = items.find(item => item.id === id);
    setIsCreating(false);
    if (selectedItem) {
      setFormData(selectedItem);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    const data = {
      "name": formData.name.replace(/[^\x00-\x7F]/g,""),
      "content": formData.content.replace(/[^\x00-\x7F]/g,""),
      "role": promptType === "SystemPrompt" ? "system" : promptType === "LoadingPrompt" ? "assistant" : "user",
      "promptType": promptType,
      "popularity": formData.popularity
    };
    console.log('Create action initiated:', data);
    ApiPrompt.create(data)
      .then(response => {
        setIsCreating(false);
        showToast('Prompt Added successfully!', 'success');
        // setFormData({ id: 0, name: '', question: '', answer: '', context: '',  }); // Reset form data
        
      })
      .catch(error => {
        console.error('Failed to create dataset:', error);
        showToast('Error Creating Prompt , Try Again later!', 'error');
        setIsCreating(false);
      }).finally(() => {
          delayedReload.triggerReload();
      })
      ;
  };

  const handleUpdate = (id) => {
    const data = {
      "name": formData.name.replace(/[^\x00-\x7F]/g,""),
      "content": formData.content.replace(/[^\x00-\x7F]/g,""),
      "role": promptType === "SystemPrompt" ? "system" : promptType === "LoadingPrompt" ? "assistant" : "user",
      "promptType": promptType,
      "popularity": formData.popularity
    };
    console.log('Form Data: Sent to API', data);
    setIsEditing(true);
    ApiPrompt.update(id, data)
      .then(() => {
        console.log('Form Data updated:', data);
        showToast('Chatbot Prompt Updated Successfully!', 'success');
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Failed to update dataset:', error);
        showToast('Error Updating Chatbot Prompt, Try Again later!', 'error');
        setIsEditing(false);
      });
  };


  const handleDelete = (id) => {
    ApiPrompt.delete(id)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
        showToast('Chatbot Prompt Deleted Successfully!', 'success');
      })
      .catch(error => {
        console.error('Failed to delete the dataset:', error);
        showToast('Error Deleting Chatbot Prompt, Try Again later!', 'error');
      });
  };

  const value = {
    items,
    formData,
    setItems,
    currentId,
    setCurrentId,
    setFormData,
    handleListItemClick,
    handleCreate,
    handleUpdate,
    handleDelete,
    isEditing,
    setIsEditing,
    isCreating,
    setIsCreating,
    ingestsDocs,
    promptType, 
    setPromptType

  };

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>;
};
