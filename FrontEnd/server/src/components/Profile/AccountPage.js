import React, { useEffect, useState } from 'react';
import { Button, Avatar, Stack, Typography, Paper, Box, TextField, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import useLocalStorage from '../../API/useLocalStorage';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { uploadFile } from '../../API/ApiUpload';
import { ApiAdmin } from '../../API/ApiAdmin';
import ChangePasswordDialog from './ChangePasswordDialog';
import BtnCustom from '../BtnCustom';
import DelayedReload from '../../Tools/DelayedReload';
import { useToast } from '../Notification/Toast';
import { Canvas } from '@react-three/fiber';
import Pseudo3dImage from '../Image/Pseudo3dImage';

const ProfilePicture = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(25),
    height: theme.spacing(25),
    border: `4px solid ${theme.palette.background.paper}`
}));
const CustomTextField = styled(TextField)({
    '& .MuiInputBase-root.Mui-disabled': {
        color: 'black', // Change text color
        '-webkit-text-fill-color': 'black', // Ensure text color on webkit browsers
        opacity: 1 // Override any opacity changes by Material-UI
    },
    '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: 'black', // Additional target for Webkit browsers
        opacity: 1 // Ensure text does not have reduced opacity
    }
});

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

function AccountPage() {
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const delayedReload = DelayedReload({ delay: 3000 });
    const showToast = useToast();
    const [isLoading,setIsLoading] = useState(false)
    const [profile, setProfile] = useState({
        email: '',
        firstName: '',
        lastName: '',
        profile_picture: ''
    });

    useEffect(() => {
        setProfile(adminCredentials);
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        console.log("file: ",file);
        console.log("filename: ", file.name)
        if (file) {
            try {
                setIsLoading(true)
                showToast('Uploading your image, Please Wait...', 'info');
                const uploadedData = await uploadFile(file);
                console.log("Uploaded Data: ", uploadedData);
                let updatedProfile = {
                    ...profile
                }
                updatedProfile.profile_picture = uploadedData.filename
                setProfile(updatedProfile);
                console.log("UpdatedProfile: ", updatedProfile)
                console.log("profile: ", profile);

                // Update server data
                const response = await ApiAdmin.update(adminCredentials.id, updatedProfile);
                setAdminCredentials(response.data);
                console.log('Update response:', response);
                showToast('Profile Picture Changed Successfully!', 'success');
                

            } catch (error) {
                console.error('Error uploading file:', error);
                showToast(error, 'error');
            }
            finally{
                delayedReload.triggerReload();
            }
        }
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 1000, mx: 'auto', overflow: 'hidden' }}>
            <Canvas style={{
                position: 'fixed', // Fixed position
                top: 0, // Align to the top of the viewport
                left: 0, // Align to the left of the viewport
                width: '100vw', // Full viewport width
                height: '100vh', // Full viewport height
                zIndex: -1, // Ensure it stays behind other content
                filter: 'blur(12px)'
            }}>
                <Pseudo3dImage imageUrl="/landingImage.jpg" depthMapUrl="/landingImage_depth.jpg" />
            </Canvas>
            <Box sx={{ bgcolor: 'primary.main', height: 240, position: 'relative' }} />
            <Stack direction="column" spacing={2} sx={{ p: 3 }}>
                <Box sx={{ position: 'absolute', top: 80, left: '50%', transform: 'translateX(-50%)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <ProfilePicture alt="Profile Picture" src={`${process.env.REACT_APP_BACKEND_URL}/photos/get/${profile.profile_picture}` || "/imagePlaceholder.jpeg"} />
                    
                    <UploadButton isLoading={isLoading} component="label">
                        <input type="file" disabled={isLoading} hidden onChange={handleFileChange} />
                        <PhotoCamera />
                    </UploadButton>
                </Box>
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h3" gutterBottom>
                        {profile.firstName} {profile.lastName} 
                    </Typography>
                    <CustomTextField
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={profile.email}
                        fullWidth
                        disabled
                        sx={{ mb: 2, padding: '10px' }}
                    />
                    <CustomTextField
                        label="First Name"
                        variant="outlined"
                        name="firstName"
                        value={profile.firstName}
                        fullWidth
                        disabled
                        sx={{ mb: 2, padding: '10px' }}
                    />
                    <CustomTextField
                        label="Last Name"
                        variant="outlined"
                        name="lastName"
                        value={profile.lastName}
                        fullWidth
                        disabled
                        sx={{ mb: 2, padding: '10px' }}
                    />
                   
                   <ChangePasswordDialog
                        adminId={adminCredentials.id}
                        email={adminCredentials.email}
                        open={isDialogOpen}
                        onClose={handleDialogClose}
                />
                <BtnCustom onClick={handleDialogOpen}>Change Password</BtnCustom>
                </Box>
            </Stack>
        </Paper>
    );
}

export default AccountPage;
