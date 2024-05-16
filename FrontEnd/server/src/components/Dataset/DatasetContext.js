import React, { useState, useEffect, createContext } from 'react';
import { ApiDataset } from '../../API/ApiDataset'; // Adjust the path as necessary
import { ApiIngest } from '../../API/ApiIngest';

export const DatasetContext = createContext(); // Export context if needed elsewhere

export const DatasetProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [ingestsDocs, setIngestsDocs] = useState([]);
  const [isCreating, setIsCreating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    question: '',
    answer: '',
    context: '',
    ingestId: ''
  });

  useEffect(() => {

    //Get all datasets
    ApiDataset.get()
      .then(response => {
        const mappedItems = response.data.map(item => ({
          id: item.id,
          name: item.name,
          question: item.Question,
          answer: item.Answer,
          context: item.Context,
          ingestId: item.IngestId
        }));
        setItems(mappedItems);
        console.log('Datasets fetched:', response.data);
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      });

      //Get all ingests List
      ApiIngest.list()
      .then(response => {
        setIngestsDocs(response.data); // Assuming the response data is the array of ingests
        console.log("Ingests fetched:", response.data);
      })
      .catch(err => {
        console.error("Failed to fetch ingests", err);
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
      "name": formData.name,
      "Question": formData.question,
      "Answer": formData.answer,
      "Context": formData.context
    };
    console.log('Create action initiated:', data);
    ApiIngest.create(data)
      .then(response => {
        setIsCreating(false);
        setFormData({ id: 0, name: '', question: '', answer: '', context: '',  }); // Reset form data
        
      })
      .catch(error => {
        console.error('Failed to create dataset:', error);
        setIsCreating(false);
      }).finally(() => {
        window. location. reload();
      })
      ;
  };

  const handleUpdate = (id) => {
    setIsEditing(true);
    ApiIngest.update(id, formData)
      .then(() => {
        setIsEditing(false);
        setFormData({ id: 0, name: '', question: '', answer: '', context: '', ingestId: '' }); // Reset form data
      })
      .catch(error => {
        console.error('Failed to update dataset:', error);
        setIsEditing(false);
      });
  };

  const handleDelete = (id) => {
    ApiIngest.delete(id)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
      })
      .catch(error => {
        console.error('Failed to delete the dataset:', error);
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
    ingestsDocs
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};
