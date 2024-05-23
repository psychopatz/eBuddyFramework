import React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';

// Create a hook to use the snackbar
export function useToast() {
  const { enqueueSnackbar } = useSnackbar();
  return (message, variant = 'default') => {
    enqueueSnackbar(message, { variant });
  };
}

// Create a component that provides the context
function ToastProvider({ children }) {
  return (
    <SnackbarProvider maxSnack={3}>
      {children}
    </SnackbarProvider>
  );
}

export default ToastProvider;
