import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Box, Button, Typography, styled, IconButton } from '@mui/material';
import BtnCustom from '../BtnCustom';
import DisplayImage from './DisplayImage';
import { uploadFile } from '../../API/ApiUpload';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useToast } from '../Notification/Toast';
import useLocalStorage from '../../API/useLocalStorage';
import { findImageUrls } from './findImageUrls';
import PastePopup from '../../Tools/PastePopup';




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
  const [isLoading,setIsLoading] = useState(false)
  const [foundLinks, setFoundLinks] = useState([])
  const [photoLink, setPhotoLink] = useState("");

  const showToast = useToast();
   const [uploadedPhoto, setUploadedPhoto] = useLocalStorage('recentUploadedPhoto', "");



  const toggleDrawer = (open) => (event) => {
    event.stopPropagation();
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  useEffect(() => {
    setFoundLinks(findImageUrls(uploadedPhoto))
  }, [imageUrls])



  const handleFileChange = async (event) => {
        const file = event.target.files[0];
        console.log("file: ",file);
        console.log("filename: ", file.name)
        setPhotoLink("")
        if (file) {
            try {
                setIsLoading(true)
                showToast('Uploading your image, Please Wait...', 'info');
                const uploadedData = await uploadFile(file);
                console.log("Uploaded Data: ", uploadedData);
                const photo = uploadedData.filename
                console.log("Uploaded: ", photo)
                const data = `[${file.name}](${uploadedData.url})`;
                setUploadedPhoto([data + " "+ uploadedPhoto])
                setPhotoLink(data)

                showToast('Upload Success, now copy and paste it.', 'success');

                

            } catch (error) {
                console.error('Error uploading file:', error);
                showToast(error, 'error');
            }
            finally{
               setIsLoading(false)
            }
        }
    };

  return (
    <div>
      <BtnCustom onClick={(e) => {
        e.stopPropagation();
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

        >
          <Typography variant="h6">Current Photos</Typography>
          <ImageContainer>
            <DisplayImage imageUrls={imageUrls} onImageClick={()=>{showToast("clicked", 'error')}} />
          </ImageContainer>
          <Typography variant="h6">Your Uploaded Photos</Typography>
          <ImageContainer>
            <DisplayImage imageUrls={foundLinks} onImageClick={()=>{showToast("clicked", 'error')}} /> 
          </ImageContainer>
          <PastePopup textData={photoLink} settextData={setPhotoLink}/>
          
          <UploadButton isLoading={isLoading} component="label">
              <input type="file" disabled={isLoading} hidden onChange={handleFileChange} />
              <PhotoCamera />
          </UploadButton>
        </Box>
      </StyledDrawer>
    </div>
  );
}

export default ManageCurrentImages;
