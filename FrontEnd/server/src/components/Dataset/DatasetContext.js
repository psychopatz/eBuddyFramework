import React, { useState, useEffect, createContext } from 'react';
import { ApiDataset } from '../../API/ApiDataset'; // Adjust the path as necessary

export const DatasetContext = createContext(); // Export context if needed elsewhere

export const DatasetProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    question: '',
    answer: '',
    context: '',
    ingestId: ''
  });

  useEffect(() => {
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
      })
      .catch(error => {
        console.error('Failed to fetch datasets:', error);
      });
  }, []);

  const handleListItemClick = (id) => {
    const selectedItem = items.find(item => item.id === id);
    if (selectedItem) {
      setFormData(selectedItem);
    }
  };

  const value = {
    items,
    formData,
    setItems,
    setFormData,
    handleListItemClick,
    handleEdit: () => {},
    handleDelete: () => {}
  };

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};
