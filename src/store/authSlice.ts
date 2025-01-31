import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  username: string;
  email?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  users: User[];
  token: string | null;
  loading: boolean;
  error: string | null;
}

const getTokenExpiration = () => {
  const expiration = localStorage.getItem('tokenExpiration');
  return expiration ? parseInt(expiration, 10) : null;
};

const isTokenExpired = () => {
  const expiration = getTokenExpiration();
  return expiration ? Date.now() > expiration : true;
};

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token') && !isTokenExpired(),
  user: null,
  users: [],
  token: localStorage.getItem('token') && !isTokenExpired() ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
};

const apiUrl = import.meta.env.VITE_API_URL;

const setToken = (token: string) => {
  const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  localStorage.setItem('token', token);
  localStorage.setItem('tokenExpiration', expirationTime.toString());
};

const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiration');
};

export const login = createAsyncThunk<
  { token: string; user: User },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${apiUrl}/login`, credentials, { timeout: 5000 });
      const { token, user } = response.data;
      setToken(token);
      return { token, user };
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        return thunkAPI.rejectWithValue('Request timed out');
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const addUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string; role: string },
  { rejectValue: string }
>(
  'auth/addUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${apiUrl}/add_user`, userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeToken();
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
        state.loading = false;
      })
      .addCase(addUser.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add user';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
