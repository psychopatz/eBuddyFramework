import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import {
  List, ListItem as MuiListItem, ListItemAvatar, Avatar, ListItemText,
  IconButton, Menu, MenuItem, FormControl, InputLabel, Select, Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { QuestionContext } from './QuestionContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ScrollableContainer = styled.div(props => ({
  maxHeight: props.height ? `${props.height}px` : '100%',
  overflow: 'auto',
  width: '100%',
  backgroundColor: 'skyblue',
}));

const ListItem = styled(MuiListItem)(({ theme, selected }) => ({
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  backgroundColor: selected ? '#ddd' : 'transparent',
}));

function QuestionsListView({ listHeight }) {
  const { items, handleListItemClick, handleUpdate, handleDelete, currentId, setCurrentId } = useContext(QuestionContext);
  const [filter, setFilter] = useState('unanswered'); 
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);  // To control the menu's position
    // To track the current item ID for menu operations

  const handleMenuClick = (event, id) => {
    console.log("Opening menu for item:", id);
    event.stopPropagation();  // This should come before any other action
    setAnchorEl(event.currentTarget);
    setCurrentId(id);
};


  const handleClose = () => {
    console.log("Closing menu");  // Log when the menu is closed
    setAnchorEl(null);
  };

  const handleClick = (id) => {
    console.log("Item clicked:", id);  // Log when an item is clicked
    setSelectedItemId(id);
    handleListItemClick(id);
  };

  const sortedItems = [...items].sort((a, b) => b.id - a.id);


  return (
    <ScrollableContainer height={listHeight}  >
      <Box sx={{ marginTop: '10px' }}>
      <FormControl fullWidth>
        <InputLabel id="filter-label"  >Filter Questions</InputLabel>
        <Select
          labelId="filter-label"
          value={filter}
          label="Filter Questions"
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginBottom: '20px' }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="answered">Answered</MenuItem>
          <MenuItem value="unanswered">Unanswered</MenuItem>
          <MenuItem value="unknown">Unknowned to AI</MenuItem>
          <MenuItem value="incorrect">Incorrect Answers</MenuItem>
          <MenuItem value="irrelevant">Irrelevant Answers</MenuItem>

        </Select>
      </FormControl>
      <List>
        {sortedItems.filter(item => 
          filter === 'all' || 
          (filter === 'answered' && item.isResolved) || 
          (filter === 'unanswered' && !item.isResolved) ||
          (filter === 'unknown' && item.tags === 'unknown') ||
          (filter === 'incorrect' && item.tags === 'incorrect') ||
          (filter === 'irrelevant' && item.tags === 'irrelevant')
          ).map(item => (
          <ListItem
            key={item.id}
            selected={selectedItemId === item.id}
            onClick={() => handleClick(item.id)}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="details"
                onClick={(e) => handleMenuClick(e, item.id)}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              {item.isResolved ? <CheckCircleIcon style={{ color: 'green' }} /> : <CancelIcon style={{ color: 'red' }} /> }
            </ListItemAvatar>
            <ListItemText primary={item.summary} secondary={"Type: "+item.tags+", Date Created: " + item.dateCreated} />
          </ListItem>
        ))}
      </List>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { 
          console.log("Set for Resolved:", currentId);
          handleUpdate(currentId);
          handleClose(); 
          }}>Set Question Resolved</MenuItem>
        <MenuItem onClick={() => {
              console.log("Delete action for:", currentId);
              handleDelete(currentId);
              handleClose();
          }}>Delete</MenuItem>
      </Menu>
      </Box>
    </ScrollableContainer>
  );
}

export default QuestionsListView;
