import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Chip,
  Typography,
  Box,
  Checkbox,
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { formatTime } from 'src/utils/formatDate';
import { AppDispatch, RootState } from 'src/store/store';
import { fetchTodayAttendanceList } from 'src/store/adminAttendanceSlice';

const statusColorMap: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  present: 'success',
  late: 'warning',
  absent: 'error',
  on_leave: 'info',
};

const LiveAttendanceTable = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  // Handle individual selection
  const handleSelectUser = (id: number) => {
    setSelectedUsers((prev:any) =>
      prev.includes(id) ? prev.filter((uid: any) => uid !== id) : [...prev, id]
    );
  };

  const { today, loading, error } = useSelector(
    (state: RootState) => state.adminAttendance
  );

  useEffect(() => {
    dispatch(fetchTodayAttendanceList());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (!today.length) {
    return (
      <Typography align="center" sx={{ my: 4 }}>
        No attendance data for today.
      </Typography>
    );
  }
// Handle select all
const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.checked) {
    const allIds = today.map((user) => user.id);
    setSelectedUsers(allIds);
  } else {
    setSelectedUsers([]);
  }
};

// Check if all are selected
const allSelected = today.length > 0 && selectedUsers.length === today.length;
  return (
    <Box>
      <Box mb={3}>
      { selectedUsers.length !== 0 && 
      (
        <FormControl sx={{'width': '20%'}}>
          <InputLabel id="attendance-select-label">Select Action</InputLabel>
          <Select
            labelId="attendance-select-label"
            id="attendance-select"
            label="Change Status"
            // value={''}
            onChange={() => {console.log('bebo');}}
          >
            <MenuItem value=''>Please Select</MenuItem>
            <MenuItem value='present'>Mark as Present</MenuItem>
            <MenuItem value='on_leave'>Mark as On Leave</MenuItem>
            <MenuItem value='absent'>Mark as Absent</MenuItem>
          </Select>
        </FormControl>
      )}
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={allSelected}
                indeterminate={
                  selectedUsers.length > 0 && selectedUsers.length < today.length
                }
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell><strong>Role</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Check-In</strong></TableCell>
            <TableCell><strong>Check-Out</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {today.map((user) => (
            <TableRow key={user.id}>
              <TableCell padding="checkbox">
          <Checkbox
            checked={selectedUsers.includes(user.id)}
            onChange={() => handleSelectUser(user.id)}
          />
        </TableCell>
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
    </Box>
  );
};

export default LiveAttendanceTable;
