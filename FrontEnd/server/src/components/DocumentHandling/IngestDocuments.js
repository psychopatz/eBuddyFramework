import React from 'react';
import BtnIngestDocument from './BtnIngestDocument';

const IngestDocuments = () => {
  const handleUploadSuccess = (data) => {
    console.log('Upload successful:', data);
  };

  const handleUploadError = (error) => {
    console.error('Upload failed:', error);
  };

  return (
    <div>
      <h1>File Upload</h1>
      <BtnIngestDocument onUploadComplete={handleUploadSuccess} onError={handleUploadError} />

    </div>
  );
};

export default IngestDocuments;
