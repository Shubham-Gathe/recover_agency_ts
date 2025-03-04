import React, { useState } from 'react';
import { Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import api from 'src/utils/api';
import { Iconify } from 'src/components/iconify';
import IosShareIcon from '@mui/icons-material/IosShare';

const ExportAllocation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`dashboards/get_allocations?export=true`, {
        responseType: 'blob', // Ensures we receive binary data
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Create a Blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Export_Allocation.xlsx'); // Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Something went wrong.');
      setOpenErrorSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleExport} disabled={isLoading}
        variant="outlined"
        color="primary"
        startIcon={<IosShareIcon />}
        sx={{maxWidth:'max-content'} }
      >
        {isLoading ? <CircularProgress size={24} /> : 'Export Allocation'}
      </Button>

      <Snackbar open={openErrorSnackbar} autoHideDuration={4000} onClose={() => setOpenErrorSnackbar(false)}>
        <Alert severity="error" onClose={() => setOpenErrorSnackbar(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportAllocation;
