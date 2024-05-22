import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; 
import ProtectedRoute from './components/ProtectedRoute';
import Login from './Admin/Login';
import Logout from './Admin/Logout';
import Register from './Admin/Register';
import DashboardPage from './Admin/DashboardPage';
import ViewQuestionsPage from './Admin/ViewQuestionsPage';
import ManageDatasetsPage from './Admin/ManageDatasetsPage';
import AdminChatPage from './Admin/AdminChatPage';
import ChatPage from './User/ChatPage';
import NotFound from './NotFound';
import NavBar from './components/Navbar/Navbar';
import AccountPage from './components/Profile/AccountPage';
import LandingPage from './User/LandingPage';
import DocumentEditor from './Admin/DocumentEditor';


// Navigation component that includes NavBar based on current path
function Navigation() {
  const location = useLocation();
  const showNavBar = ['/admin/','/admin', '/admin/manage-questions', '/admin/train-ai', '/admin/test-chatbot', '/admin/account'].includes(location.pathname);
  
  return showNavBar ? <NavBar /> : null;
}

function App() {
  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline /> 
    <BrowserRouter>
      <Navigation /> 
      <main style={{ position: 'relative', flex: 1 }}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/manage-questions" element={<ProtectedRoute><ViewQuestionsPage /></ProtectedRoute>} />
        <Route path="/admin/train-ai" element={<ProtectedRoute><ManageDatasetsPage /></ProtectedRoute>} />
        <Route path="/admin/test-chatbot" element={<ProtectedRoute><AdminChatPage /></ProtectedRoute>} />
        <Route path='/admin/account' element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path='/docs' element={<DocumentEditor />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      </main>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
