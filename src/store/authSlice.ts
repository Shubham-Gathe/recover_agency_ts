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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  users: [],
  token: null,
  loading: false,
  error: null,
};

// Thunk for login
export const login = createAsyncThunk<{ token: string; user: User }, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post('http://16.171.247.65:3000/login', credentials, { timeout: 5000 });
      return response.data; // Assuming response has { token, user } structure
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        return thunkAPI.rejectWithValue('Request timed out');
      }
      return thunkAPI.rejectWithValue(error.response?.message || 'Login failed');
    }
  }
);


// Thunk for adding a user
export const addUser = createAsyncThunk<User, { name: string; email: string; password: string; role: string }, { rejectValue: string }>(
  'auth/addUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://16.171.247.65:3000/add_user', userData);
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
    logout: (state) => initialState,
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

