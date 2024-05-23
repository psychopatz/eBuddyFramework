import React, { useState, useEffect, createContext } from 'react';
import { ApiQuestion } from '../../API/ApiQuestion';
import { useToast } from '../Notification/Toast';
import DelayedReload from '../../Tools/DelayedReload';


export const QuestionContext = createContext(); // Export context if needed elsewhere

export const QuestionProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCreating, setIsCreating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const delayedReload = DelayedReload({ delay: 3000 });
  const [currentId, setCurrentId] = useState(null);
  const showToast = useToast();
  const [formData, setFormData] = useState({
    id: 0,
    summary: '',
    tags: '',
    dateCreated: '',
    isResolved: '',
    chatHistory: [{}],
    // ingestId: ''
  });



  useEffect(() => {
    ApiQuestion.get()
      .then(response => {
        const mappedItems = response.data.map(item => ({
          id: item.id,
          summary: item.summary,
          tags: item.tags,
          dateCreated: item.dateCreated,
          isResolved: item.isResolved,
          chatHistory: item.chatHistory
        }));
        setItems(mappedItems);
        console.log('Datasets fetched:', response.data);
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      })
      ;
  }, []);
  
   const handleListItemClick = (id) => {
    const selectedItem = items.find(item => item.id === id);
    if (selectedItem) {
      setFormData(selectedItem);
    }
  };



  const handleUpdate = (id) => {
    setIsEditing(true);
    let data = {
      ...formData  
    }
    data.isResolved = true
    ApiQuestion.update(id, data)
      .then(() => {
        showToast('Question Updated Successfully!', 'success');
        delayedReload.triggerReload();
      })
      .catch(error => {
        console.error('Failed to update question database:', error);
        showToast('Error Updating Question, Try Again later!', 'error');
      });
  };

  const handleDelete = (id) => {
    ApiQuestion.delete(id)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
        showToast('Question Deleted Successfully!', 'success');
      })
      .catch(error => {
        console.error('Failed to Delete the Question:', error);
        showToast('Error Deleting Question, Try Again later!', 'error');
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
    handleUpdate,
    handleDelete,
    setIsEditing,
    setIsCreating
  };

  return <QuestionContext.Provider value={value}>{children}</QuestionContext.Provider>;
};
