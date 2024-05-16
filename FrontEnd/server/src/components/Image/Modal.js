import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1300
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position: 'relative', // This is needed to position the close button
        maxHeight: '90%', maxWidth: '90%', overflow: 'auto', backgroundColor: 'white', borderRadius: '10px'
      }}>
        <button onClick={onClose} style={{
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            border: 'none', 
            background: 'rgba(255, 255, 255, 0.8)', // Slightly opaque white background
            color: 'black', 
            cursor: 'pointer',
            fontSize: '24px', // Larger font size for better visibility
            fontWeight: 'bold',
            padding: '5px 8px', // Padding to increase clickable area
        }}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
