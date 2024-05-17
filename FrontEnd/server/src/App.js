import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Admin/Login';
import Logout from './Admin/Logout';
import Register from './Admin/Register';
import Dashboard from './Admin/Dashboard';
import ViewQuestionsPage from './Admin/ViewQuestionsPage';
import ManageDatasetsPage from './Admin/ManageDatasetsPage';
import AdminChatPage from './Admin/AdminChatPage';
import ChatPage from './User/ChatPage';
import NotFound from './NotFound';
import NavBar from './components/Navbar/Navbar';
import AccountPage from './components/Profile/AccountPage';

// Navigation component that includes NavBar based on current path
function Navigation() {
  const location = useLocation();
  const showNavBar = ['/admin/','/admin', '/admin/manage-questions', '/admin/train-ai', '/admin/test-chatbot', '/admin/account'].includes(location.pathname);
  
  return showNavBar ? <NavBar /> : null;
}

function App() {
  return (
    <BrowserRouter>
      <Navigation /> {/* This component now handles showing the NavBar conditionally */}
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-questions" element={<ProtectedRoute><ViewQuestionsPage /></ProtectedRoute>} />
        <Route path="/admin/train-ai" element={<ProtectedRoute><ManageDatasetsPage /></ProtectedRoute>} />
        <Route path="/admin/test-chatbot" element={<ProtectedRoute><AdminChatPage /></ProtectedRoute>} />
        <Route path='/admin/account' element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
