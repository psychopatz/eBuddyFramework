import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentManager from './Admin/DocumentManager';
import './App.css';
import IngestDocuments from './components/IngestDocuments';
import Login from './Admin/Login';
import DocxEditor from './components/DocumentHandling/DocxEditor';
import ChatPage from './User/ChatPage';
import Register from './Admin/register';
import AdminChatPage from './Admin/AdminChatPage';





function App() {
  
  return (
    <BrowserRouter>
    <>
    <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path='/admin/register' element={<Register />} />
        <Route path='/admin/test-chatbot' element={<AdminChatPage />} />
        <Route path='/DocumentEditor' element={<DocxEditor/>} />
        <Route path="/document-manager" element={<DocumentManager />} />
        <Route path="/ingest-documents" element={<IngestDocuments />} />
      </Routes>
    </>
      
    
    </BrowserRouter>
      
  );
}

export default App;
