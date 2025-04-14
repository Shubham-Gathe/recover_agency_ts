import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Chip, CircularProgress, Snackbar, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from 'src/store/store';
import { checkIn, checkOut } from 'src/store/attendanceSlice';

type AttendanceStatus = 'present' | 'late' | 'absent' | 'on_leave' | 'not_found';

interface AttendanceCardProps {
  user: {
    id: number;
    name: string;
    type: string;
  };
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ user }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, loading, checkInTime, checkOutTime, error } = useSelector(
    (state: RootState) => state.attendance
  );

  const handleCheckIn = () => dispatch(checkIn(user.id));
  const handleCheckOut = () => dispatch(checkOut(user.id));

  const statusColorMap: Record<AttendanceStatus, 'success' | 'warning' | 'error' | 'info'> = {
    present: 'success',
    late: 'warning',
    absent: 'error',
    on_leave: 'info',
    not_found: 'info',
  };

  // const statusColor = statusColorMap[(status as AttendanceStatus) || 'absent'];
  const statusColor = status && statusColorMap[status as AttendanceStatus] || 'error';

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6">Attendance</Typography>
        <Divider />
        <Typography variant="h3">{user.name}</Typography>
        <Typography variant="body2">{user.type}</Typography>

        <Stack direction="row" spacing={2} alignItems="center" mt={2} mb={2}>
          { status === 'not_found' ? (
            <Chip label={`Status: 'Not marked'`} color={statusColor as any} />
          ):(
            <Chip label={`Status: ${status || 'Not marked'}`} color={statusColor as any} />
          )}
          {checkInTime && (
            <Chip
              label={`Check In: ${new Date(checkInTime).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}`}
            />
          )}
          {checkOutTime && (
            <Chip
              label={`Check Out: ${new Date(checkOutTime).toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}`}
            />
          )}
        </Stack>

        {loading ? (
          <CircularProgress />
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckIn}
              disabled={!!checkInTime}
            >
              Check In
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCheckOut}
              disabled={!checkInTime || !!checkOutTime}
            >
              Check Out
            </Button>
          </Stack>
        )}

        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          message={error}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceCard;
