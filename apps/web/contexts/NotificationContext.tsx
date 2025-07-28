import React, {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

import { Alert, Snackbar } from '@mui/material';

type NotificationContextType = {
  showNotification: (
    message: string,
    severity?: 'success' | 'error' | 'warning' | 'info',
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');

  const showNotification = (
    msg: string,
    sev: 'success' | 'error' | 'warning' | 'info' = 'info',
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Snackbar
        open={open}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
