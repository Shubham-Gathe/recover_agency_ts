import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
    Dialog,
    Button,
    MenuItem,
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
// const apiUrl = '/api';
const apiUrl = import.meta.env.VITE_API_URL;

export function AddUserDialog({ open, onClose, onAddUser, editingUser }: AddUserDialogProps) {
    const [newUser, setNewUser] = useState<UserProps>({
        id: '',
        name: '',
        email: '',
        role: 'Executive', // Default type
        password: '', // Add password to the state
    });

    // Pre-fill the form fields when editingUser is available
    useEffect(() => {
        if (editingUser) {
            setNewUser(editingUser);
        }
    }, [editingUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const addUser = async () => {
        const postUser = {...newUser,type:newUser.role}
        try {
            await axios.post(`${apiUrl}/sign_up`, postUser);
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleSubmit = () => {
        if (editingUser) {
            onAddUser({ ...newUser });
        } else {
            onAddUser({ ...newUser, id: Date.now().toString() });
            
            addUser();
        }
        onClose();
    };

    // Reset form when dialog is closed
    useEffect(() => {
        if (!open) {
            setNewUser({
                id: '',
                name: '',
                email: '',
                role: 'Executive',
                password: '', // Reset the password field
            });
        }
    }, [open]);

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
                    value={newUser.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    fullWidth
                    value={newUser.email}
                    onChange={handleChange}
                />
                <TextField
                    select
                    margin="dense"
                    name="type"
                    label="Role"
                    fullWidth
                    value={newUser.role}
                    onChange={handleChange}
                >
                    <MenuItem value="UserBlock::Admin">Admin</MenuItem>
                    <MenuItem value="UserBlock::Caller">Caller</MenuItem>
                    <MenuItem value="UserBlock::Executive">Executive</MenuItem>
                </TextField>
                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password" // Make sure to hide the password input
                    fullWidth
                    value={newUser.password}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">
                    {editingUser ? 'Update User' : 'Add User'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
