import React, { useState } from 'react';
import { Button, Box } from '@mui/material';

function Carousel({ items, onItemClick }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleButtonClick = (index) => {
    setActiveIndex(index);
    onItemClick(items[index]); // Call the callback function with the item data
  };

  return (
    <Box sx={{ maxWidth: '90%', margin: 'auto', overflowX: 'auto', padding: '10px' }}>  
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        
        {items.map((item, index) => (
          <Button
            key={index}
            variant="contained"
            color={index === activeIndex ? 'primary' : 'primary'}  // Different color for inactive buttons
            onClick={() => handleButtonClick(index)}
            sx={{ marginBottom: 2 }} // Space between rows if wrapping occurs
          >
            {item.name}
          </Button>
        ))}
      </Box>

    </Box>
  );
}

export default Carousel;
