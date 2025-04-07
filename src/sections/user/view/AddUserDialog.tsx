import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
    Alert,
    Dialog,
    Button,
    MenuItem,
    Snackbar,
    TextField,
    DialogTitle,
    DialogActions,
    DialogContent,
} from '@mui/material';

import type { UserProps } from '../user-table-row';

type AddUserDialogProps = {
    open: boolean;
    onClose: () => void;
    onAddUser: (user: UserProps) => void;
    editingUser: UserProps | null;
};

const apiUrl = import.meta.env.VITE_API_URL;

type FieldValues = { [field: string]: string };
type FieldErrors = { [field: string]: string };

export function AddUserDialog({ open, onClose, onAddUser, editingUser }: AddUserDialogProps) {
    const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" }>({ message: "", severity: 'error' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [fieldValues, setFieldValues] = useState<FieldValues>({
        name: '',
        email: '',
        type: 'Executive',
        password: '',
        mobile_number: '',
        alt_mobile_number: '',
        status: 'pending',
    });
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [newUser, setNewUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        type: 'Executive',
        password: '',
        mobile_number: '',
        alt_mobile_number: '',
        status: 'pending',
    });

    useEffect(() => {
        if (editingUser) {
            setNewUser(editingUser);
            setFieldValues({
                name: editingUser.name,
                email: editingUser.email,
                type: editingUser.type,
                password: editingUser.password || '',
                mobile_number: editingUser.mobile_number || '',
                alt_mobile_number: editingUser.alt_mobile_number || '',
                status: editingUser.status || '',
            });
        } else {
            setNewUser({
                id: '',
                name: '',
                email: '',
                type: 'Executive',
                password: '',
                mobile_number: '',
                alt_mobile_number: '',
                status: 'pending',
            });
            setFieldValues({
                name: '',
                email: '',
                type: 'Executive',
                password: '',
                mobile_number: '',
                alt_mobile_number: '',
                status: 'pending',
            });
            setFieldErrors({});
        }
    }, [editingUser, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
        setFieldValues({ ...fieldValues, [name]: value });
        setFieldErrors(prevErrors => ({ ...prevErrors, [name]: ''})); // Clear any previous error for this field
    };

    // const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpenSnackbar(false);
    // };

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `${token}`,
        };

        try {
            if (editingUser) {
                // Update existing user using PUT or PATCH
                await axios.put(`${apiUrl}/user_block/users/${editingUser.id}`, newUser, { headers });
                onAddUser(newUser); // Notify parent component about the update
                setSnackbar({ message: 'User updated successfully', severity: 'success' });
                setOpenSnackbar(true);
            } else {
                // Add new user using POST
                const response = await axios.post(`${apiUrl}/sign_up`, newUser, { headers });
                onAddUser({ ...newUser, id: response.data.id }); // Notify parent component with the new user and generated ID
                setSnackbar({ message: response.data.message || 'User added successfully', severity: 'success' });
                setOpenSnackbar(true);
            }
            onClose();
        } catch (error: any) {
            console.error('Error:', error);
            console.log(error.response.data);
            if (error.response?.data?.errors) {
                // Handle validation errors from the API
                const apiErrors = error.response.data.errors;
                console.log('apiErrors', apiErrors);
                setFieldErrors(apiErrors);
                setSnackbar({ message: error.response.data.message || 'Invalid details', severity: 'error' });
                setOpenSnackbar(true);
            } else {
                // Handle other errors
                setSnackbar({ message: 'An unexpected error occurred', severity: 'error' });
                setOpenSnackbar(true);
            }
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    fullWidth
                    value={fieldValues.name}
                    onChange={handleChange}
                    error={!!fieldErrors.name}
                    helperText={fieldErrors.name && Array.isArray(fieldErrors.name) ? fieldErrors.name.join(', ') : (fieldErrors.name ? fieldErrors.name : '')}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    value={fieldValues.email}
                    onChange={handleChange}
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email && Array.isArray(fieldErrors.email) ? fieldErrors.email.join(', ') : (fieldErrors.email ? fieldErrors.email : '')}
                />
                <TextField
                    margin="dense"
                    name="mobile_number"
                    label="Mobile Number"
                    fullWidth
                    value={fieldValues.mobile_number}
                    type="number"
                    onChange={handleChange}
                    error={!!fieldErrors.mobile_number}
                    helperText={fieldErrors.mobile_number && Array.isArray(fieldErrors.mobile_number) ? fieldErrors.mobile_number.join(', ') : (fieldErrors.mobile_number ? fieldErrors.mobile_number : '')}
                />
                <TextField
                    margin="dense"
                    name="alt_mobile_number"
                    label="Alternate Mobile Number"
                    fullWidth
                    value={fieldValues.alt_mobile_number}
                    type="number"
                    onChange={handleChange}
                    error={!!fieldErrors.alt_mobile_number}
                    helperText={fieldErrors.alt_mobile_number && Array.isArray(fieldErrors.alt_mobile_number) ? fieldErrors.alt_mobile_number.join(', ') : (fieldErrors.alt_mobile_number ? fieldErrors.alt_mobile_number : '')}
                />
                <TextField
                    select
                    margin="dense"
                    name="type"
                    label="Type"
                    fullWidth
                    value={fieldValues.type}
                    onChange={handleChange}
                    error={!!fieldErrors.type}
                    helperText={fieldErrors.type && Array.isArray(fieldErrors.type) ? fieldErrors.type.join(', ') : (fieldErrors.type ? fieldErrors.type : '')}
                >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Caller">Caller</MenuItem>
                    <MenuItem value="Executive">Executive</MenuItem>
                </TextField>
                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    value={fieldValues.password}
                    onChange={handleChange}
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password && Array.isArray(fieldErrors.password) ? fieldErrors.password.join(', ') : (fieldErrors.password ? fieldErrors.password : '')}
                />
                <TextField
                    select
                    margin="dense"
                    name="status"
                    label="Status"
                    fullWidth
                    value={fieldValues.status}
                    onChange={handleChange}
                    placeholder="Optional status"
                    error={!!fieldErrors.status}
                    helperText={fieldErrors.status && Array.isArray(fieldErrors.status) ? fieldErrors.status.join(', ') : (fieldErrors.status ? fieldErrors.status : '')}
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">
                    {editingUser ? 'Update User' : 'Add User'}
                </Button>
            </DialogActions>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {snackbar.severity && (
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
                )}
            </Snackbar>
        </Dialog>
    );
}