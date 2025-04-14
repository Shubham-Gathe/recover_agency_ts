import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from 'src/store/store';
import { fetchTodayAttendance } from 'src/store/attendanceSlice';
import AttendanceCard from 'src/components/AttendanceCard';
import { DashboardContent } from 'src/layouts/dashboard';

const UserDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state?.auth?.user);

  useEffect(() => {
    if (user) dispatch(fetchTodayAttendance(user.id));
  }, [dispatch, user]);

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>
      {user?.type && <AttendanceCard user={user as { id: number; name: string; type: string }} />}
    </DashboardContent>
  );
};

export default UserDashboard;