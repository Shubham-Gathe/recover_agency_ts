import React, { useEffect, useState } from 'react';
import { RootState, AppDispatch } from 'src/store/store'; // Adjust the import path
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  CircularProgress,
  FormControl,
  InputLabel,
  Autocomplete,
  TextField,
  Snackbar,
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { UserProps } from '../user/user-table-row';

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRows: { id: number; [key: string]: any }[]; // Selected rows to assign
  apiUrl: 'http://localhost:3001'; // Base API URL
}

const AssignDialog: React.FC<AssignDialogProps> = ({ open, onClose, selectedRows, apiUrl }) => {
  const [userType, setUserType] = useState<'caller' | 'executive'>('caller');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  // Fetch users from the API
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/user_block/users`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setUsers(response.data.users);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [open, apiUrl]);

  // Filter users based on the selected user type
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        userType === 'caller' ? user.type.includes('Caller') : user.type.includes('Executive')
      )
    );
    setSelectedUser(null); // Reset the selected user when user type changes
  }, [userType, users]);

  const handleAssign = async () => {
    if (!selectedUser) {
      setError('Please select a user.');
      return;
    }

    setIsLoading(true);
    setError('');
    let payload, endPoint;
    if(userType === 'caller') {
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

    const headers = {
      Authorization: token,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    }
    try {
      await axios.post(`${apiUrl}/allocation_drafts/assign_${endPoint}`,
        payload,
        {headers}
      ).then((response) => {
        console.log('assign response', response);
        window.location.reload();
        setOpenErrorSnackbar(true);
        setTimeout(() => {
          setOpenErrorSnackbar(false);
        }, 3000);
        setError(response.data.message);
      });
      onClose();
    } catch (err) {
      setError(err);
      setOpenErrorSnackbar(true);
      setTimeout(() => {
        setOpenErrorSnackbar(false);
      }, 3000);
      setError('Failed to assign rows. Please try again.');
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
          {error && <p style={{ color: 'red' }}>{error}</p>}
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
        open={openErrorSnackbar}
        autoHideDuration={3000} // Automatically hide after 3 seconds
        onClose={() => setOpenErrorSnackbar(false)}
        message={error} // Display the message
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          backgroundColor: '', // Error background color
          color: 'error', // White text color
          borderRadius: 1,
        }}
      />
    </>
  );
};

export default AssignDialog;
