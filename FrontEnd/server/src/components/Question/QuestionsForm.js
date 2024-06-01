import React, { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BtnCustom from '../BtnCustom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {QuestionContext} from './QuestionContext';
import ChatBubble from '../Chat/ChatBubble';
import DatasetsForm from './DatasetsForm';
import { Navigate, useLocation } from 'react-router-dom';

const StyledForm = styled(Box)(({ theme }) => ({
  maxWidth: "100%",
  margin: 'auto',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));


const StyledTextField = styled(TextField)({
  margin: '8px',
  width: 'calc(100% - 16px)',
  '& .MuiInputBase-inputMultiline': {  // Ensures the input grows with content
    minHeight: '100px',
  },
});

const AutoExpandTextField = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  fontSize: '1rem',
  fontFamily: 'Roboto, sans-serif',
  lineHeight: 1.5,
  borderColor: 'rgba(0, 0, 0, 0.23)',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  }
}));

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between', // Spread buttons across the container
  margin: '8px',
});

const btnStyles = {
  create: {
    bgcolor: 'green',
    ':hover': { bgcolor: 'darkgreen' }
  },
  submit: {
    bgcolor: 'primary.main',
    ':hover': { bgcolor: 'primary.dark' }
  },
  update: {
    bgcolor: 'secondary.main',
    ':hover': { bgcolor: 'secondary.dark' }
  },
  delete: {
    bgcolor: 'error.main',
    ':hover': { bgcolor: 'error.dark' }
  }
};

const QuestionsForm = () => {
  const { formData, setFormData, isEditing, setIsEditing,isCreating,handleDelete, handleCreate, handleUpdate } = useContext(QuestionContext);
  console.log("Form Data: ", formData);
  const location = useLocation();
  const [redirectTo, setRedirectTo] = useState(false);
  

  if (redirectTo) {
    return <Navigate to="/admin/train-ai" state={{ from: location }} replace />;
  }

       return (
    <>
    {formData.chatHistory[0].role && formData.chatHistory.map((chat, index) => (
        <ChatBubble key={index} message={chat} />
      ))}
    
    <BtnCustom
        variant="contained"
        color="primary"
        sx={{
          position: 'fixed',
          width: 'calc(30% - 40px)',
          bottom: 20, // Adjust based on required distance from the bottom
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={() => setRedirectTo(true)}
      >
        Answer this Question
      </BtnCustom>

    
    </>
    
  );
    // }

 
}

export default QuestionsForm;
