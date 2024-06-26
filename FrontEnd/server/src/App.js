import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; 
import LandingPage from './Pages/User/LandingPage';
import Login from './Pages/Admin/Login';
import Logout from './Pages/Admin/Logout';
import Register from './Pages/Admin/Register';
import DashboardPage from './Pages/Admin/DashboardPage';
import ViewQuestionsPage from './Pages/Admin/ViewQuestionsPage';
import ManageDatasetsPage from './Pages/Admin/ManageDatasetsPage';
import AdminChatPage from './Pages/Admin/AdminChatPage';
import NotFound from './Pages/NotFound';
import NavBar from './components/Navbar/Navbar';
import AccountPage from './components/Profile/AccountPage';
import ProtectedRoute from './Tools/ProtectedRoute';
import ToastProvider from './components/Notification/Toast';
import ManagePromptsPage from './Pages/Admin/ManagePromptsPage';



// Navigation component that includes NavBar based on current path
function Navigation() {
  const location = useLocation();
  const showNavBar = ['/admin/','/admin', '/admin/manage-questions', '/admin/train-ai', '/admin/test-chatbot', '/admin/account','/admin/manage-prompts'].includes(location.pathname);
  
  return showNavBar ? <NavBar /> : null;
}

function App() {
  return (
    <ThemeProvider theme={theme}> 
    <ToastProvider>
      <CssBaseline /> 
    <BrowserRouter>
      <Navigation /> 
      <main style={{ position: 'relative', flex: 1 , overflow: 'hidden'}}>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<AdminChatPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/logout' element={<Logout />} />
        <Route path='/register' element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/admin/manage-questions" element={<ProtectedRoute><ViewQuestionsPage /></ProtectedRoute>} />
        <Route path="/admin/manage-prompts" element={<ProtectedRoute><ManagePromptsPage /></ProtectedRoute>} />
        <Route path="/admin/train-ai" element={<ProtectedRoute><ManageDatasetsPage /></ProtectedRoute>} />
        <Route path="/admin/test-chatbot" element={<ProtectedRoute><AdminChatPage /></ProtectedRoute>} />
        <Route path='/admin/account' element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        {/* <Route path='/docs' element={<DocumentEditor />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      </main>
    </BrowserRouter>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
