import React, { useState } from 'react';
import { deleteIngestedDocument } from '../api/ingestApi';
import useListIngest from '../API/useListIngest';

const RemoveIngestedDocs = () => {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data, loading, error } = useListIngest();

  const handleDelete = async (docId) => {
    setIsLoading(true);
    setStatus('');
    try {
      const message = await deleteIngestedDocument(docId);
      setStatus(message);
      console.log("Document deleted:", docId);
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>Error loading documents: {error.message}</p>;

  return (
    <div>
      <h1>Document List</h1>
      {documents.map((doc) => (
        <div key={doc.doc_id} style={{ marginBottom: "10px" }}>
          <span>{doc.doc_metadata.file_name} </span>
          <button onClick={() => handleDelete(doc.doc_id)} disabled={isLoading}>
            Delete
          </button>
        </div>
      ))}
      {status && <p>{status}</p>}
    </div>
  );
};

export default RemoveIngestedDocs;
