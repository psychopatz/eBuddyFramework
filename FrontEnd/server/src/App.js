import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentManager from './Admin/DocumentManager';
import './App.css';
import IngestDocuments from './components/IngestDocuments';
import Login from './Admin/Login';
import DocxEditor from './components/DocumentHandling/DocxEditor';
import ChatPage from './User/ChatPage';
import Register from './Admin/register';





function App() {
  
  return (
    <BrowserRouter>
    <>
    <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/admin/register' element={<Register />} />
        <Route path='/DocumentEditor' element={<DocxEditor/>} />
        <Route path="/document-manager" element={<DocumentManager />} />
        <Route path="/ingest-documents" element={<IngestDocuments />} />
      </Routes>
    </>
      
    
    </BrowserRouter>
      
  );
}

export default App;
