import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import {
  List, ListItem as MuiListItem, ListItemAvatar, Avatar as MuiAvatar, ListItemText,
  IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DatasetContext } from './DatasetContext';

import PsychologyIcon from '@mui/icons-material/Psychology';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';

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

const StyledAvatar = styled(MuiAvatar)(({ isFound }) => ({
  backgroundColor: isFound ? 'green' : 'red', // Green if active, otherwise red
  color: 'white',
}));


function DatasetsListView({ listHeight }) {
  const { items, handleListItemClick, handleEdit, handleDelete, currentId, setCurrentId,ingestsDocs,handleUnlearn } = useContext(DatasetContext);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event, id) => {
    console.log("Opening menu for item:", id);
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setCurrentId(id);
  };

  const handleClose = () => {
    console.log("Closing menu");
    setAnchorEl(null);
  };

  const handleClick = (id) => {
    console.log("Item clicked:", id);
    setSelectedItemId(id);
    handleListItemClick(id);
  };

 const checkIngestIdExists = (ingestId) => {
    console.log("checkIngestIdExists:", ingestId);
    console.log("ingestsDocs:", ingestsDocs);

    // Check if 'documents' is available and is an array
    if (ingestsDocs && Array.isArray(ingestsDocs.documents)) {
      const ingestIds = new Set(ingestsDocs.documents.map(ingest => ingest.doc_id));
      return ingestIds.has(ingestId);
    }

    return false; // Return false if 'documents' is not available
};




const sortedItems = [...items].sort((a, b) => b.id - a.id);
  return (
    <ScrollableContainer height={listHeight}>
      <List>
        {sortedItems.map(item => (
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
              <StyledAvatar isFound={checkIngestIdExists(item.ingestId)} >{checkIngestIdExists(item.ingestId) ? <PsychologyIcon/> : <PsychologyAltIcon/>}</StyledAvatar>
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
        <MenuItem onClick={() => { 
          console.log("Unlearn action for:", currentId);
          handleUnlearn(currentId)
          handleClose(); 
          }}>Unlearn</MenuItem>
        <MenuItem onClick={() => {
          console.log("Delete action for:", currentId);
          handleDelete(currentId);
          handleClose();
        }}>Delete Dataset</MenuItem>
      </Menu>
    </ScrollableContainer>
  );
}

export default DatasetsListView;
