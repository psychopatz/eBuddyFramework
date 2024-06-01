import React, { useState, useEffect, createContext } from 'react';
import { ApiDataset } from '../../API/ApiDataset'; // Adjust the path as necessary
import { ApiIngest } from '../../API/ApiIngest';
import { useToast } from '../Notification/Toast';
import DelayedReload from '../../Tools/DelayedReload';

export const DatasetContext = createContext(); // Export context if needed elsewhere

export const DatasetProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [ingestsDocs, setIngestsDocs] = useState([]);
  const [isCreating, setIsCreating] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const showToast = useToast();
  const delayedReload = DelayedReload({ delay: 3000 });
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
        // console.log('Datasets fetched:', response.data);
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      });

      //Get all ingests List
      ApiIngest.list()
      .then(response => {
        setIngestsDocs(response.data); // Assuming the response data is the array of ingests
        // console.log("Ingests fetched:", response.data);
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
      "name": formData.name.replace(/[^\x00-\x7F]/g,""),
      "Question": formData.question.replace(/[^\x00-\x7F]/g,""),
      "Answer": formData.answer.replace(/[^\x00-\x7F]/g,""),
      "Context": formData.context.replace(/[^\x00-\x7F]/g,"")
    };
    console.log('Create action initiated:', data);
    ApiIngest.create(data)
      .then(response => {
        setIsCreating(false);
        showToast('Dataset Added to Queue Successfully!', 'success');
        setFormData({ id: 0, name: '', question: '', answer: '', context: '',  }); // Reset form data
        
      })
      .catch(error => {
        console.error('Failed to create dataset:', error);
        showToast('Error Creating Dataset, Try Again later!', 'error');
        setIsCreating(false);
      }).finally(() => {
        delayedReload.triggerReload();
      })
      ;
  };

  const handleUpdate = (id) => {
    const data = {
      "name": formData.name.replace(/[^\x00-\x7F]/g,""),
      "Question": formData.question.replace(/[^\x00-\x7F]/g,""),
      "Answer": formData.answer.replace(/[^\x00-\x7F]/g,""),
      "Context": formData.context.replace(/[^\x00-\x7F]/g,"")
    };
    // console.log('Form Data: Sent to API', data);
    setIsEditing(true);
    ApiIngest.update(id, data)
      .then(() => {
        // console.log('Form Data updated:', data);
        showToast('Dataset Updated Successfully!', 'success');
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Failed to update dataset:', error);
        showToast('Error Updating Dataset, Try Again later!', 'error');
        setIsEditing(false);
      });
  };

  const handleDelete = (id) => {
    ApiIngest.delete(id)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
        showToast('Dataset Deleted Successfully!', 'success');
      })
      .catch(error => {
        console.error('Failed to delete the dataset:', error);
        showToast('Error Deleting Dataset, Try Again later!', 'error');
      });
  };

  const handleUnlearn = (id) => {
    ApiIngest.unlearn(id)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
        showToast('The AI successfully unlearned the Topic!', 'warning');
        delayedReload.triggerReload();
        
      })
      .catch(error => {
        console.error('Failed to unlearn the dataset:', error);
        showToast('Error Deleting Dataset, Try Again later!', 'error');
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
    handleUnlearn,
    showToast
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};
