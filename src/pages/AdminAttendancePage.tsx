import type { AppDispatch } from 'src/store/store';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Box,
  Tab,
  Tabs,
  Paper,
  Divider,
  Typography,
} from '@mui/material';

import LiveAttendanceTable from 'src/components/attendance/LiveAttendanceTable';
import MonthlySummaryTable from 'src/components/attendance/MonthlySummaryTable';
import DailyAttendanceTable from 'src/components/attendance/DailyAttendanceTable';

const AdminAttendancePage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
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
  );
};

export default AdminAttendancePage;
