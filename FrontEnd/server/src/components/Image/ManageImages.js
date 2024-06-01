import React, { useState, useRef } from 'react';
import { Drawer, Box, Button, Typography, styled, IconButton } from '@mui/material';
import BtnCustom from '../BtnCustom';
import DisplayImage from './DisplayImage';
import { uploadFile } from '../../API/ApiUpload';
import { useToast } from '../Notification/Toast';
import useLocalStorage from '../../API/useLocalStorage';

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 'auto',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'scroll',
  padding: theme.spacing(1),
  border: '1px solid lightgrey',
  borderRadius: theme.shape.borderRadius,
}));

const UploadButton = styled(IconButton)(({ isLoading }) => ({
    position: 'absolute',
    bottom: 0,
    right: '52%',
    backgroundColor: isLoading ? 'darkred' : 'white',
    color: isLoading ? 'white' : 'grey',
    '&:hover': {
        backgroundColor: isLoading ? 'red' : '#f4f4f4',
        color: 'black'
    }
}));

function ManageCurrentImages({ buttonLabel, imageUrls, drawerWidth }) {
  const [isOpen, setIsOpen] = useState(false);
  const showToast = useToast();
  const fileInputRef = useRef(null);
  const [userImages, setUserImages] = useLocalStorage('userUploadedImages', []);
  const [isLoading,setIsLoading] = useState(false)

  const toggleDrawer = (open) => (event) => {
    event.stopPropagation(); // Prevent parent event handlers from being triggered
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const handleFileChange = async (event) => {
    console.log("INA")
    const file = event.target.files[0];
    if (file) {
      try {
        showToast('Uploading your image, please wait...', 'info');
        const uploadedData = await uploadFile(file);
        setUserImages([...userImages, uploadedData.filename]); // Assuming 'filename' is the key that contains the URL
        showToast('Image uploaded successfully!', 'success');
      } catch (error) {
        console.error('Error uploading file:', error);
        showToast('Error uploading image', 'error');
      }
    }
  };




  return (
    <div>
      <BtnCustom onClick={(e) => {
        e.stopPropagation(); // Prevent parent event handlers from being triggered
        toggleDrawer(true)(e);
      }}>{buttonLabel}</BtnCustom>
      <StyledDrawer
        anchor="bottom"
        open={isOpen}
        onClose={toggleDrawer(false)}
        sx={{ width: drawerWidth || 'auto' }}
      >
        <Box
          sx={{ width: drawerWidth || 'auto' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6">Current Photos</Typography>
          <ImageContainer>
            <DisplayImage imageUrls={imageUrls} onImageClick={() => {}} />
          </ImageContainer>
          <Typography variant="h6">Your Uploaded Photos</Typography>
          <ImageContainer>
            <DisplayImage imageUrls={userImages} />
          </ImageContainer>
          {/* <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </Button> */}

          <UploadButton isLoading={isLoading} component="label">
                        <input type="file" disabled={isLoading}  onChange={handleFileChange} />

                    </UploadButton>
        </Box>
      </StyledDrawer>
    </div>
  );
}

export default ManageCurrentImages;
