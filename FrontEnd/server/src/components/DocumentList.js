import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { deleteIngestedDocument } from '../API/useDeleteIngested';

const DocumentList = ({ documents }) => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setStatus('');
    try {
      const message = await deleteIngestedDocument(selectedDocId);
      setStatus(message);
      console.log("Document deleted:", selectedDocId);
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setIsLoading(false);
      setOpenDialog(false);  // Close the dialog
    }
  };

  const handleOpenDialog = (docId) => {
    setSelectedDocId(docId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <h1>Document List</h1>
      {documents.map((doc) => (
        <div key={doc.doc_id} style={{ marginBottom: "10px" }}>
          <Button onClick={() => handleOpenDialog(doc.doc_id)} disabled={isLoading} variant="outlined" color="primary">
            Delete
          </Button>
          <span>{doc.doc_metadata.file_name} </span>
        </div>
      ))}
      {status && <p>{status}</p>}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentList;
