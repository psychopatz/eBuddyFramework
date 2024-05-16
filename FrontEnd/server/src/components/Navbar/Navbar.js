import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { Menu, MenuItem } from '@mui/material';
import useLocalStorage from '../../API/useLocalStorage';

function NavBar() {
     const [adminCredentials,setAdminCredentials] = useLocalStorage('adminCredentials', {});
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const user = {
        name: adminCredentials.firstName, 
        imageUrl: `${process.env.REACT_APP_BACKEND_URL}/photos/get/${adminCredentials.profile_picture}`
    }
    console.log("user: ",user)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleClose();
    };

    const endpoints = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Manage Questions', path: '/admin/manage-questions' },
        { label: 'Train AI', path: '/admin/train-ai' },
        { label: 'Test Chatbot', path: '/admin/test-chatbot' },
    ];

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    CITChat
                </Typography>
                {endpoints.map((endpoint) => (
                    <Button 
                        key={endpoint.path} 
                        color="inherit" 
                        onClick={() => navigate(endpoint.path)}
                    >
                        {endpoint.label}
                    </Button>
                ))}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="account of current user"
                    aria-controls={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ ml: 2 }}
                >
                    {/* Display either the image or the first letter of the name */}
                    <Avatar
                        alt={user.name}
                        src={user.imageUrl}
                        sx={{ width: 40, height: 40 }}
                    >
                        {user.imageUrl ? '' : user.name[0]}
                    </Avatar>
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top', 
                      horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={() => handleNavigate('/profile')}>Profile</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/account')}>My account</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/logout')}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
