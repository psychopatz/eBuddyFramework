import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import useLocalStorage from '../../API/useLocalStorage';

const StyledToolbar = styled(Toolbar)({
    // add styles if needed
});

const StyledButton = styled(Button)(({ theme, isActive }) => ({
    color: isActive ? "red" : theme.palette.common.white,
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
        { label: 'Home', path: '/admin' },
        { label: 'Manage Questions', path: '/admin/manage-questions' },
        { label: 'Manage Datasets', path: '/admin/train-ai' },
        { label: 'Test Chatbot', path: '/admin/test-chatbot' },
    ];

    return (
        <AppBar position="sticky" sx={{ top: 0 }}>
            <StyledToolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    CITChat
                </Typography>
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
                    color="inherit"
                    aria-label="account of current user"
                    aria-controls={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    sx={{ ml: 2 }}
                >
                    <StyledAvatar
                        alt={user.name}
                        src={user.imageUrl}
                    >
                        {user.imageUrl ? '' : user.name[0]}
                    </StyledAvatar>
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
                    <MenuItem onClick={() => handleNavigate('/admin/account')}>Manage Account</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/logout')}>Logout</MenuItem>
                </Menu>
            </StyledToolbar>
        </AppBar>
    );
}

export default NavBar;
