import React, { useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BtnCustom from '../BtnCustom';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { ApiIngest } from '../../API/ApiIngest';
import DelayedReload from '../../Tools/DelayedReload';

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

const DatasetsForm = () => {
  // const { isEditing, setIsEditing,isCreating,handleDelete, handleUpdate } = useContext(DatasetContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
    const [formData, setFormData] = useState({
    id: 0,
    name: '',
    question: '',
    answer: '',
    context: '',
    ingestId: ''
  });
    const delayedReload = DelayedReload({ delay: 3000 });

    const handleCreate = () => {
    setIsCreating(true);
    const data = {
      "name": formData.name,
      "Question": formData.question,
      "Answer": formData.answer,
      "Context": formData.context
    };
    console.log('Create action initiated:', data);
    ApiIngest.create(data)
      .then(response => {
        setIsCreating(false);
        setFormData({ id: 0, name: '', question: '', answer: '', context: '',  }); // Reset form data
        
      })
      .catch(error => {
        console.error('Failed to create dataset:', error);
        setIsCreating(false);
      }).finally(() => {
        delayedReload.triggerReload();
      })
      ;
  };
  
const isFormDataEmpty = () => {
    return !formData.name && !formData.question && !formData.answer && !formData.context;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form Data:', formData);
     if (isCreating) {
        console.log('Create action initiated');
        handleCreate(); // Call create specific logic
    } 
  console.log('Form Data:', formData);
    setIsEditing(false);
  };



  const handleEditMode = () => {
    console.log('Update action initiated');
    setIsEditing(true);
  };

  return (
    <StyledForm
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >

      <StyledTextField
        label="Name"
        name="name"
        required
        disabled={!isEditing && !isCreating}
        variant="outlined"
        value={formData.name}
        onChange={handleChange}
      />

      <StyledTextField
        label="Question"
        name="question"
        multiline
        required
        disabled={!isEditing && !isCreating}
        variant="outlined"
        value={formData.question}
        onChange={handleChange}
        InputProps={{
          inputComponent: AutoExpandTextField,
          inputProps: {
            minRows: 2,
          }
        }}
      />

      <StyledTextField
        label="Answer"
        name="answer"
        multiline
        required
        disabled={!isEditing && !isCreating}
        variant="outlined"
        value={formData.answer}
        onChange={handleChange}
        InputProps={{
          inputComponent: AutoExpandTextField,
          inputProps: {
            minRows: 2,
          }
        }}
      />

      <StyledTextField
        label="Context"
        name="context"
        multiline
        required

        disabled={!isEditing && !isCreating}
        variant="outlined"
        value={formData.context}
        onChange={handleChange}
        InputProps={{
          inputComponent: AutoExpandTextField,
          inputProps: {
            minRows: 2,
          }
        }}
      />

      <ButtonContainer>
        {formData.name && !isCreating && !isEditing && <BtnCustom onClick={() => handleEditMode()} sx={btnStyles.update}>Edit</BtnCustom>}
        {(isCreating || isEditing) && (
        <BtnCustom type="submit" sx={isCreating ? btnStyles.create : btnStyles.submit}>
          {isFormDataEmpty() && isCreating && isEditing ? "Create" : "Submit"}
        </BtnCustom>
      )}
      </ButtonContainer>
      {formData.ingestId && <Typography variant="subtitle"><b>IngestID</b>: {formData.ingestId}</Typography>}
    </StyledForm>
  );
}

export default DatasetsForm;
