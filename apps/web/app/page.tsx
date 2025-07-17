'use client';

import { useNotification } from "@/contexts/NotificationContext";
import { Box, Button } from "@mui/material";

export default function Home() {

  const { showNotification } = useNotification();

  return (
    <Box>
      <Button variant='contained' onClick={() => showNotification('test', 'info')}>Info</Button>
      <Button variant='contained' onClick={() => showNotification('test', 'warning')}>Warning</Button>
      <Button variant='contained' onClick={() => showNotification('test', 'success')}>Success</Button>
      <Button variant='contained' onClick={() => showNotification('test', 'error')}>Error</Button>
    </Box>
  );
}
