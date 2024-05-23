import React from 'react';

const DelayedReload = ({ delay = 10000 }) => {

  const triggerReload = () => {
    console.log(`Page will reload in ${delay / 1000} seconds...`);
    setTimeout(() => {
      window.location.reload();
    }, delay);
  };

  // Expose the trigger function
  return { triggerReload };
};

export default DelayedReload;
