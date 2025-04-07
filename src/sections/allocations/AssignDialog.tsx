import React, { useState, useEffect } from 'react';

// Adjust the import path

import {
  Alert,
  Dialog,
  Button,
  Select,
  MenuItem,
  Snackbar,
  TextField,
  InputLabel,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import api from 'src/utils/api';


interface User {
  id: number;
  name: string;
  email?: string;
  type?: string;
}

interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRows: { id: number;[key: string]: any }; // Selected rows to assign
  refreshData: () => void;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error' | undefined;
}

const AssignDialog: React.FC<AssignDialogProps> = ({ open, onClose, selectedRows, refreshData }) => {
  const [userType, setUserType] = useState<'caller' | 'executive'>('caller');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Removed error and openErrorSnackbar
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: undefined,
  });

  // Fetch users from the API
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/user_block/users`, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setUsers(response.data.users);
      } catch (error: any) {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to load users.',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [open]);

  // Filter users based on the selected user type
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        (user && userType === 'caller') ? user.type?.includes('Caller') : user.type?.includes('Executive')
      )
    );
    setSelectedUser(null); // Reset the selected user when user type changes
  }, [userType, users]);

  const handleAssign = async () => {
    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: 'Please select a user.',
        severity: 'warning',
      });
      return;
    }

    setIsLoading(true);
    let payload; let endPoint;
    if (userType === 'caller') {
      payload = {
        caller_id: selectedUser.id, // The selected user's ID
        allocation_draft_ids: selectedRows, // Array of selected row IDs
      };
      endPoint = 'caller';
    } else {
      payload = {
        executive_id: selectedUser.id, // The selected user's ID
        allocation_draft_ids: selectedRows, // Array of selected row IDs
      };
      endPoint = 'executive';
    }

    try {
      const response = await api.post(`/allocation_drafts/assign_${endPoint}`,
        payload
      );
      refreshData();
      setSnackbar({
        open: true,
        message: response.data.message || 'Rows assigned successfully!',
        severity: 'success',
      });
      onClose();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Failed to assign rows. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Assign Rows</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'caller' | 'executive')}
            >
              <MenuItem value="caller">Caller</MenuItem>
              <MenuItem value="executive">Executive</MenuItem>
            </Select>
          </FormControl>
          <Autocomplete
            options={filteredUsers}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            value={selectedUser}
            onChange={(event, newValue) => setSelectedUser(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={isLoading ? 'Loading users...' : 'Select User'}
                margin="normal"
                fullWidth
              />
            )}
            disabled={isLoading}
          />
          {snackbar.severity === 'warning' && <p style={{ color: 'orange' }}>{snackbar.message}</p>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isLoading || !selectedUser}>
            {isLoading ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {snackbar.severity && (
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default AssignDialog;