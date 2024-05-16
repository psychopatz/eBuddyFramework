import React, { useState, useEffect, createContext } from 'react';
import { ApiQuestion } from '../../API/ApiQuestion';


export const QuestionContext = createContext(); // Export context if needed elsewhere

export const QuestionProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isCreating, setIsCreating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    summary: '',
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
    formData.isResolved = true
    ApiQuestion.update(id, formData)
      .then(() => {

        window. location. reload();
      })
      .catch(error => {
        console.error('Failed to update question database:', error);
      });
  };

  const handleDelete = (id) => {
    ApiQuestion.delete(id)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error('Failed to delete the question:', error);
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
