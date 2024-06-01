import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function PastePopup({ textData, settextData }) {
    const [open,setOpen] = useState(false);


    useEffect(() => {
        if (textData.trim()) {  
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [textData]);

      const handleClose = () => {
        settextData('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Copy this Text"
                    sx={{
                        color: 'white',
                    }}
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={textData}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <Button onClick={handleClose} color="primary" sx={{color: 'white'}}>
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default PastePopup;
