import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Paper from '@mui/material/Paper';
import useIngestDocument from '../../API/useIngestDocument';
import LoadingAnimation from '../../Tools/LoadingAnimation';

const BtnIngestDocument = ({ onUploadComplete, onError }) => {
  const { uploadDocument, isLoading, error, data } = useIngestDocument();
  const inputRef = useRef(null);

  const handleUploadClick = () => {
    inputRef.current.click();  // Triggers the file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadDocument(file);
    }
  };

  // Handle upload completion and errors via prop functions
  React.useEffect(() => {
    if (data && !error) {
      onUploadComplete(data);
    }
    if (error) {
      onError(error);
    }
  }, [data, error, onUploadComplete, onError]);

  return (
    <Paper elevation={4} sx={{ padding: .3, display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={isLoading}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={handleUploadClick}
        disabled={isLoading}
      >
        Ingest Document
      </Button>
      {isLoading && <LoadingAnimation />}
    </Paper>
  );
};

export default BtnIngestDocument;
