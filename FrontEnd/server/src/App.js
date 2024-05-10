import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DocumentManager from './Admin/DocumentManager';
import './App.css';
import IngestDocuments from './components/IngestDocuments';
import Login from './Admin/Login';
import DocxEditor from './components/DocumentHandling/DocxEditor';
import ChatPage from './User/ChatPage';
import Register from './Admin/Register';
import AdminChatPage from './Admin/AdminChatPage';
import Dashboard from './Admin/Dashboard';
import NotFound from './NotFound';
import Logout from './Admin/Logout';
import ManageDatasetsPage from './Admin/ManageDatasetsPage';






function App() {
  
  return (
    <BrowserRouter>
    <>
    <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/train-ai" element={<ProtectedRoute><ManageDatasetsPage /></ProtectedRoute>} />
        <Route path="/admin/test-chatbot" element={<ProtectedRoute><AdminChatPage /></ProtectedRoute>} />
        <Route path='/DocumentEditor' element={<DocxEditor/>} />
        <Route path="/document-manager" element={<DocumentManager />} />
        <Route path="/ingest-documents" element={<IngestDocuments />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
      
    
    </BrowserRouter>
      
  );
}

export default App;
