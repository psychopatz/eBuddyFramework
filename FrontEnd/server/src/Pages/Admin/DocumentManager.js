import React from 'react';
import DocumentList from '../components/DocumentList';
import useListIngest from '../API/useListIngest';

const DocumentManager = () => {
  const { data, loading, error } = useListIngest();

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>Error loading documents: {error.message}</p>;

  return (
    <div>
      <h1>Managed Documents</h1>
      {data && data.data ? (
        <h1>Document List</h1>
        // <DocumentList documents={data.data} />
      ) : (
        <p>No documents to display.</p>
      )}
    </div>
  );
};

export default DocumentManager;
