import * as React from 'react';
import { TextField } from '@mui/material';

function InputField({ label, name, type, autoComplete, required, autoFocus }) {
  return (
    <TextField
      margin="normal"
      required={required}
      fullWidth
      id={name}
      label={label}
      name={name}
      autoComplete={autoComplete}
      type={type}
      autoFocus={autoFocus}
    />
  );
}

export default InputField;
