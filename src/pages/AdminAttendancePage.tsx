import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store/store';

import LiveAttendanceTable from 'src/components/attendance/LiveAttendanceTable';
import DailyAttendanceTable from 'src/components/attendance/DailyAttendanceTable';
import MonthlySummaryTable from 'src/components/attendance/MonthlySummaryTable';

const AdminAttendancePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Box  sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Admin Attendance Dashboard
        </Typography>

        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Today" />
            <Tab label="By Date" />
            <Tab label="Monthly Summary" />
          </Tabs>

          <Divider />

          <Box p={3}>
            {tabIndex === 0 && <LiveAttendanceTable />}
            {tabIndex === 1 && <DailyAttendanceTable />}
            {tabIndex === 2 && <MonthlySummaryTable />}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default AdminAttendancePage;
