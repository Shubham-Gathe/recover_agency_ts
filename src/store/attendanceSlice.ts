// src/store/attendanceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

interface AttendanceState {
  loading: boolean;
  error: string | null;
  status: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
}

const initialState: AttendanceState = {
  loading: false,
  error: null,
  status: null,
  checkInTime: null,
  checkOutTime: null,
};

// Fetch today's attendance
export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/attendance/today`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching attendance');
    }
  }
);

// Check In
export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await api.post(
        `/attendance/check_in`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Check-in failed');
    }
  }
);

// Check Out
export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (userId: number, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/attendance/check_out`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Check-out failed');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.checkInTime = action.payload.check_in_time;
        state.checkOutTime = action.payload.check_out_time;
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(checkIn.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.checkInTime = action.payload.check_in_time;
        state.error = null;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(checkOut.fulfilled, (state, action) => {
        state.status = action.payload.status;
        state.checkOutTime = action.payload.check_out_time;
        state.error = null;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default attendanceSlice.reducer;
