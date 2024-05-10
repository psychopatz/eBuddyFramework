import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import {
  List, ListItem as MuiListItem, ListItemAvatar, Avatar, ListItemText,
  IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DatasetContext } from './DatasetContext';

const ScrollableContainer = styled.div(props => ({
  maxHeight: props.height ? `${props.height}px` : '100%',
  overflow: 'auto',
  width: '100%',
  backgroundColor: 'red',
}));

const ListItem = styled(MuiListItem)(({ theme, selected }) => ({
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
  backgroundColor: selected ? '#ddd' : 'transparent',
}));

function DatasetsListView({ listHeight }) {
  const { items, handleListItemClick, handleEdit, handleDelete } = useContext(DatasetContext);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);  // To control the menu's position
  const [currentId, setCurrentId] = useState(null);  // To track the current item ID for menu operations

  const handleMenuClick = (event, id) => {
    console.log("Opening menu for item:", id);  // Log when the menu is opened
    setAnchorEl(event.currentTarget);
    setCurrentId(id);  // Store the ID of the item for which the menu was opened
    event.stopPropagation();  // Prevent triggering the onItemClick
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

  return (
    <ScrollableContainer height={listHeight}>
      <List>
        {items.map(item => (
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
              <Avatar>{item.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.name} secondary={item.question} />
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
        <MenuItem onClick={() => { console.log("Edit action for:", currentId); handleEdit(currentId); handleClose(); }}>Edit</MenuItem>
        <MenuItem onClick={() => { console.log("Delete action for:", currentId); handleDelete(currentId); handleClose(); }}>Delete</MenuItem>
      </Menu>
    </ScrollableContainer>
  );
}

export default DatasetsListView;
