import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import {
  List, ListItem as MuiListItem, ListItemAvatar, Avatar as MuiAvatar, ListItemText,
  IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PromptContext } from './PromptContext';

import PsychologyIcon from '@mui/icons-material/Psychology';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import { setItem } from '../../API/useLocalStorage';
import BtnCustom from '../component/BtnCustom';

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


function PromptListView({ listHeight }) {
  const { items,setItems, handleListItemClick,setFormData, handleEdit, handleDelete, currentId, setCurrentId,ingestsDocs, promptType, setPromptType} = useContext(PromptContext);
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



const setSystemPrompt = (items) => {
    const filtered = items.filter(item => item.promptType === "SystemPrompt");
    setPromptType("SystemPrompt");
    console.log("Items: ", items);
    console.log("System Prompt: ", filtered);
    filtered[0].id && handleListItemClick(filtered[0].id);
  };

const setBoilerplatePrompt = (items) => {
    const filtered = items.filter(item => item.promptType === "LoadingPrompt");
    setPromptType("LoadingPrompt");
    console.log("Items: ", items);
    console.log("Boilerplate: ", filtered);
    filtered[0].id &&handleListItemClick(filtered[0].id);
  };

  const sortedItems = [...items].sort((a, b) => b.popularity - a.popularity);

  return (
    <>
    <BtnCustom variant="contained" color="primary" onClick={() => setSystemPrompt(items)}>Edit Chatbot Personality</BtnCustom>
      <BtnCustom variant="contained" color="primary" onClick={() => setBoilerplatePrompt(items)}>Edit Chatbot Boilerplate</BtnCustom>
    
    <ScrollableContainer height={listHeight}>
      
      <List>
        { sortedItems.filter(item => item.promptType === "CommonQuestion").map(item => (
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
            {/* <ListItemAvatar>
              <StyledAvatar isFound={checkIngestIdExists(item.ingestId)} >{checkIngestIdExists(item.ingestId) ? <PsychologyIcon/> : <PsychologyAltIcon/>}</StyledAvatar>
            </ListItemAvatar> */}
            {(item.promptType === "CommonQuestion") && <ListItemText primary={item.name} secondary={`Popularity: ${item.popularity}`} />}
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
        {/* <MenuItem onClick={() => { 
          console.log("Edit action for:", selectedItemId);
          handleClose(); 
          }}>Unlearn</MenuItem> */}
        <MenuItem onClick={() => {
          console.log("Delete action for:", currentId);
          handleDelete(currentId);
          handleClose();
        }}>Delete</MenuItem>
      </Menu>
    </ScrollableContainer>
    </>
  );
}

export default PromptListView;
