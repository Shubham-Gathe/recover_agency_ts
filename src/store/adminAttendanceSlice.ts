import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from 'src/utils/api';

export interface AttendanceUser {
  id: number;
  name: string;
  role: string;
  status: 'present' | 'late' | 'absent' | 'on_leave';
  check_in_time?: string | null;
  check_out_time?: string | null;
}

export interface MonthlyAttendanceUser {
  id: number;
  name: string;
  role: string;
  present: number;
  late: number;
  absent: number;
  on_leave: number;
}

interface AdminAttendanceState {
  today: AttendanceUser[];
  daily: AttendanceUser[];
  monthly: MonthlyAttendanceUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminAttendanceState = {
  today: [],
  daily: [],
  monthly: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTodayAttendanceList = createAsyncThunk(
  'adminAttendance/fetchToday',
  async () => {
    const response = await api.get(`/attendances/today_all`);
    return response.data;
  }
);

export const fetchDailyAttendance = createAsyncThunk(
  'adminAttendance/fetchDaily',
  async (date: string) => {
    const response = await api.get(`/attendances/daily?date=${date}`);
    return response.data;
  }
);

export const fetchMonthlyAttendance = createAsyncThunk(
  'adminAttendance/fetchMonthly',
  async ({ year, month }: { year: number; month: number }) => {
    const response = await api.get(`/attendances/monthly?year=${year}&month=${month}`);
    return response.data;
  }
);

// Slice
const adminAttendanceSlice = createSlice({
  name: 'adminAttendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Today
      .addCase(fetchTodayAttendanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayAttendanceList.fulfilled, (state, action) => {
        state.today = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodayAttendanceList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load today\'s data';
      })

      // Daily
      .addCase(fetchDailyAttendance.fulfilled, (state, action) => {
        state.daily = action.payload;
      })

      // Monthly
      .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
        state.monthly = action.payload;
      });
  },
});

export default adminAttendanceSlice.reducer;
