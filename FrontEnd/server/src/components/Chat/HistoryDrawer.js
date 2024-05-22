import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useChat } from './ChatContext';
import ChatIcon from '@mui/icons-material/Chat';

const StyledBox = styled(Box)(({ theme, hovered, currentIndex, itemIndex }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  color:  hovered ? theme.palette.secondary.main : itemIndex === currentIndex ? "white" : 'inherit',
  backgroundColor: hovered ? "darkred" : itemIndex === currentIndex ? "transparent" : 'inherit',
  overflow: 'hidden',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main, 
  width: '90%',
  alignContent: 'center',
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  margin: '8px',
}));

function HistoryDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const { setChatHistory, setCurrentChatIndex, currentChatIndex, chatHistory, newChat, loadHistory,handleShare, isTemporary } = useChat();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);  
  };

  const handleClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setHoveredItemIndex(index);
    setSelectedItemIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    if (action === 'delete') {
      setChatHistory(chatHistory.filter((_, index) => index !== selectedItemIndex));
      if(currentChatIndex > selectedItemIndex){
        setCurrentChatIndex(currentChatIndex - 1);
      }
      if(currentChatIndex === selectedItemIndex){
        newChat();
      }
    }else if (action === 'share') {
      handleShare();
    }
    handleClose();
  };

  return (
    <>
    <IconButton onClick={toggleDrawer} sx={{ mr: 2 }}>
        {drawerOpen ? <ChatIcon /> : <ChatIcon />} 
      </IconButton>
    <Drawer
       open={drawerOpen}
        onClose={toggleDrawer}
        variant="temporary"
      sx={{
        width: '240px', // Adjusted width for consistency
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '240px', // Adjusted width for consistency
          boxSizing: 'border-box',
          backgroundColor: 'primary.main',  // Adjusted Whole background color
        },
      }}
    >
      <List>
        <StyledButton onClick={newChat} startIcon={<ChatIcon />}>New Chat</StyledButton>
        {chatHistory.map((item, index) => (
          <ListItem
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pr: 1 // Padding right to ensure space for the icon button in case magbutang ko
            }}
            onMouseEnter={() => setHoveredItemIndex(index)}
            onMouseLeave={() => setHoveredItemIndex(null)}
            onClick={() => loadHistory(index)}
          >
            <StyledBox hovered={hoveredItemIndex === index} currentIndex={currentChatIndex} itemIndex={index}>
              <ListItemText primary={item && item.length > 0 ? item[0].content : 'New Chat History'} noWrap sx={{
                maxWidth: "100%",//'calc(100% - 40px)', // Leave space for the IconButton
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',

              }} />
            </StyledBox>
            <IconButton
              onClick={(e) => handleClick(e, index)}
              size="small"
              sx={{ visibility: hoveredItemIndex === index ? 'visible' : 'hidden' }}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleMenuAction('share')}>Report Chat</MenuItem>
        <MenuItem onClick={() => handleMenuAction('delete')}>Delete chat</MenuItem>
      </Menu>
    </Drawer>
    </>
  );
}

export default HistoryDrawer;
