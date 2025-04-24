import type { Dayjs } from 'dayjs';
import type { RootState, AppDispatch } from 'src/store/store';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Chip,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { formatTime } from 'src/utils/formatDate';

import { fetchDailyAttendance } from 'src/store/adminAttendanceSlice';

import AttendanceSummary from './AttendanceSummary';


const statusColorMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  present: 'success',
  late: 'warning',
  absent: 'error',
  on_leave: 'info',
};

const DailyAttendanceTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  const { daily, loading, error } = useSelector(
    (state: RootState) => state.adminAttendance
  );

  useEffect(() => {
    dispatch(fetchDailyAttendance(selectedDate.format('YYYY-MM-DD')));
  }, [dispatch, selectedDate]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = dayjs(event.target.value);
    if (newDate.isValid()) {
      setSelectedDate(newDate);
    }
  };

  function countStatusWise(attendanceData: any[]): Record<string, number> {
    const statusCounts: Record<string, number> = {};
  
    attendanceData.forEach((employee) => {
      const {status} = employee;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
  
    return statusCounts;
  }

  const summaryTitle = `Total: ${daily.length}`;
  const summaryData = countStatusWise(daily);

  return (
    <Box>
      <Box mb={3} display='flex'>
        <Box mr={3}>
          <AttendanceSummary totalText={summaryTitle} data={summaryData} />
        </Box>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate.format('YYYY-MM-DD')}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && !daily.length && (
        <Typography align="center" sx={{ my: 4 }}>
          No attendance data for selected date.
        </Typography>
      )}

      {!loading && daily.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Check-In</strong></TableCell>
              <TableCell><strong>Check-Out</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {daily.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status.replace('_', ' ')}
                    color={statusColorMap[user.status] || 'default'}
                    sx={{
                      '& .MuiChip-label': {
                        textTransform: 'capitalize',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>{formatTime(user.check_in_time) || '-'}</TableCell>
                <TableCell>{formatTime(user.check_out_time) || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default DailyAttendanceTable;
