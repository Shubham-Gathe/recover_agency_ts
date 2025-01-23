import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from 'src/store/authSlice'; // Adjust the import path
import { RootState, AppDispatch } from 'src/store/store'; // Adjust the import path

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar for error display
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Iconify } from 'src/components/iconify';
import process from "process";

interface LoginFormValues {
  email: string;
  password: string;
}
export function SignInView() {
  const apiUrl = import.meta.env.VITE_API_URL

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); 
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);  
  const [showPassword, setShowPassword] = React.useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false); 

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    dispatch(login(data)); 
  };

  useEffect(() => {
    if (error) {
      setOpenErrorSnackbar(true);
      setTimeout(() => {
        setOpenErrorSnackbar(false);
      }, 3000);
    }
    if (isAuthenticated) {
      console.log('dashboard auth true');
      navigate('/dashboard'); 
    }
  }, [error, isAuthenticated, navigate]); 

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Log In</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {/* Username Field */}
          <TextField
            {...register('email', { required: 'email is required' })}
            fullWidth
            label="User Name"
            InputLabelProps={{ shrink: true }}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 3 }}
          />

          {/* Password Field */}
          <TextField
            {...register('password', { 
              required: 'Password is required', 
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            InputLabelProps={{ shrink: true }}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Submit Button */}
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
            loading={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </LoadingButton>
        </Box>
      </form>

      {/* Error Snackbar */}
      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={3000} // Automatically hide after 3 seconds
        onClose={() => setOpenErrorSnackbar(false)}
        message={error} // Display the error message
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          backgroundColor: '', // Error background color
          color: 'error', // White text color
          borderRadius: 1,
        }}
      />
    </>
  );
}
