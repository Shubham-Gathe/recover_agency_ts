import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/store/store';
import { fetchMonthlyAttendance } from 'src/store/adminAttendanceSlice';

import dayjs from 'dayjs';
import AttendanceSummary from './AttendanceSummary';

const MonthlySummaryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().format('YYYY-MM'));

  const { monthly, loading, error } = useSelector(
    (state: RootState) => state.adminAttendance
  );

  useEffect(() => {
    const [year, month] = selectedMonth.split('-');
    dispatch(fetchMonthlyAttendance({ year: parseInt(year, 10), month: parseInt(month, 10) }));
  }, [dispatch, selectedMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
  };
  
  // const totalEmployees = 0;
  // // attendanceData.present + attendanceData.late + attendanceData.absent + attendanceData.onLeave;
  // const summaryTitle = `Total working days: ${123}`;
  // const summaryData = {
  //   present: 150,
  //   late: 25,
  //   absent: 10,
  //   onLeave: 5,
  // };
  return (
    <Box>
      <Box mb={3} display='flex'>
        {/* <Box mr={6}>
          <AttendanceSummary totalText={summaryTitle} data={summaryData} />
        </Box> */}
        <TextField
          label="Select Month"
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
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

      {!loading && !monthly.length && (
        <Typography align="center" sx={{ my: 4 }}>
          No summary data for selected month.
        </Typography>
      )}

      {!loading && monthly.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="right">Present</TableCell>
              <TableCell align="right">Late</TableCell>
              <TableCell align="right">Absent</TableCell>
              <TableCell align="right">On Leave</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthly.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">{user.present}</TableCell>
                <TableCell align="right">{user.late}</TableCell>
                <TableCell align="right">{user.absent}</TableCell>
                <TableCell align="right">{user.on_leave}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default MonthlySummaryTable;