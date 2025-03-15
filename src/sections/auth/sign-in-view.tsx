import type { SubmitHandler } from 'react-hook-form';
import type { RootState, AppDispatch } from 'src/store/store';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { login } from 'src/store/authSlice'; // ✅ Improved Error UI
import { Iconify } from 'src/components/iconify';

interface LoginFormValues {
  email: string;
  password: string;
}

export function SignInView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // @ts-ignore
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    dispatch(login(data));
  };

  useEffect(() => {
    if (error) {
      setOpenErrorSnackbar(true);
    }

    if (isAuthenticated) {
        console.log('user', user);
        navigate('/dashboard');      
    }
  }, [error, isAuthenticated, navigate, user]);

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Log In</Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {/* Email Field (Auto Focus) */}
          <TextField
            {...register('email', { required: 'Email is required' })}
            fullWidth
            label="Email"
            InputLabelProps={{ shrink: true }}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoFocus
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
            color="primary"
            variant="contained"
            loading={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </LoadingButton>
        </Box>
      </form>

      {/* Error Snackbar - Improved UI */}
      <Snackbar 
        open={openErrorSnackbar} 
        autoHideDuration={3000} 
        onClose={() => setOpenErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          sx={{ width: '100%' }} 
          onClose={() => setOpenErrorSnackbar(false)}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
