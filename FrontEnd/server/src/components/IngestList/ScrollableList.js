import React from 'react';
import styled from '@emotion/styled';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemIcon, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const ScrollableContainer = styled.div`
  max-height: ${props => props.height || 300}px;
  overflow: auto;
  width: 100%; // Ensures the container takes full width of its parent
`;

function ScrollableList({ items, listHeight }) {
  return (
    <ScrollableContainer height={listHeight}>
      <List>
        {items.map(item => (
          <ListItem key={item.id} secondaryAction={
            <IconButton edge="end" aria-label="details">
              <MoreVertIcon />
            </IconButton>
          }>
            <ListItemAvatar>
              <Avatar>{item.primary.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={item.primary} secondary={item.secondary} />
          </ListItem>
        ))}
      </List>
    </ScrollableContainer>
  );
}

export default ScrollableList;
