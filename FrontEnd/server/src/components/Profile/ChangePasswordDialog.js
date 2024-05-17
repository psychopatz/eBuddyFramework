import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, FormControl } from '@mui/material';
import { ApiAdmin } from '../../API/ApiAdmin';

function ChangePasswordDialog({ adminId, open, onClose, email }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [retypedPassword, setRetypedPassword] = useState('');

    const [loginError, setLoginError] = useState("");


    const handleCurrentPasswordChange = (event) => {
        setCurrentPassword(event.target.value);
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleRetypedPasswordChange = (event) => {
    setRetypedPassword(event.target.value);
};


    const verifyAndUpdatePassword = async (event) => {
    event.preventDefault();
    if (newPassword == currentPassword) {
        setLoginError("Do not use your current password as your new password.");
        return;
    }
    if (newPassword !== retypedPassword) {
        setLoginError("The passwords do not match.");
        return;
    }

    try {
        const response = await ApiAdmin.login({ email, password: currentPassword });
        if (response.status === 200) {
            await updatePassword();
        } else {
            throw new Error('Invalid Password');
        }
    } catch (error) {
        setLoginError(error.response ? error.response.data.detail : "An unexpected error occurred");
    }
};


    const updatePassword = async () => {
        try {
            const response = await ApiAdmin.update(adminId, { password: newPassword });
            console.log('Password update response:', response);
            onClose(); // Close dialog on successful update
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={verifyAndUpdatePassword}>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To update your password, please enter your current password and a new password.
                    </DialogContentText>
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        id="currentPassword"
                        label="Current Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={currentPassword}
                        onChange={handleCurrentPasswordChange}
                    />
                    <TextField
                        margin="dense"
                        id="newPassword"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newPassword}
                        onChange={handleNewPasswordChange}
                    />
                    <TextField
                        margin="dense"
                        id="retypedPassword"
                        label="Retype New Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={retypedPassword}
                        onChange={handleRetypedPasswordChange}
                    />
                    {loginError && (
                        <Typography color="error" sx={{textAlign: 'center'}}>{loginError}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default ChangePasswordDialog;
