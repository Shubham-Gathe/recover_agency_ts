import React from 'react';

import { Box, Backdrop, Typography, CircularProgress } from '@mui/material';

interface LoadingScreenProps {
  open: boolean;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ open, message = 'Loading...' }) => (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      <Box mt={2}>
        <Typography variant="h6">{message}</Typography>
      </Box>
    </Backdrop>
  );

export default LoadingScreen;
