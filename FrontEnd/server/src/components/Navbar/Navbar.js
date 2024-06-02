import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Avatar, Menu, MenuItem, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import useLocalStorage from '../../API/useLocalStorage';

const StyledToolbar = styled(Toolbar)({
    justifyContent: 'space-between',  // Ensures that the logo and navigation items are spaced out
});

const StyledButton = styled(Button)(({ theme, isActive }) => ({
    color: isActive ? theme.palette.secondary.main : theme.palette.common.white,
}));

const StyledAvatar = styled(Avatar)({
    width: 40,
    height: 40,
});

function NavBar() {
    const [adminCredentials, setAdminCredentials] = useLocalStorage('adminCredentials', {});
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const user = {
        name: adminCredentials.firstName, 
        imageUrl: `${process.env.REACT_APP_BACKEND_URL}/photos/get/${adminCredentials.profile_picture}`
    };

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
        { label: 'Manage Datasets', path: '/admin/train-ai' },
        { label: 'Manage Prompts', path: '/admin/manage-prompts'},
        { label: 'Test Chatbot', path: '/admin/test-chatbot' },
    ];

    return (
        <AppBar position="sticky" >
            <StyledToolbar>
                <Box sx={{ width: '150px', height: 'auto', cursor: 'pointer' }} onClick={() => navigate('/admin')}>
                    <img src="/logoText.png" alt="Company Logo" style={{ width: '100%', height: 'auto', filter: 'drop-shadow(2px 2px 2px rgba(255,255,25,0.3))' }} />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
                    {endpoints.map((endpoint) => (
                        <StyledButton 
                            key={endpoint.path} 
                            onClick={() => navigate(endpoint.path)}
                            isActive={location.pathname === endpoint.path}
                        >
                            {endpoint.label}
                        </StyledButton>
                    ))}
                    
                    <IconButton
                        edge="end"
                        aria-label="account of current user"
                        onClick={handleClick}
                    >
                        <StyledAvatar
                            alt={user.name}
                            src={user.imageUrl}
                        />
                    </IconButton>
                </Box>
                
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
                    <MenuItem onClick={() => handleNavigate('/admin/account')}>Manage Account</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/logout')}>Logout</MenuItem>
                </Menu>
            </StyledToolbar>
        </AppBar>
    );
}

export default NavBar;
