import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
  Grid,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

type UserProps = {
  id: string;
  name: string;
  email: string;
  type: string;
  avatar?: string;
  password?: string | null;
  mobile_number?: string;
  alt_mobile_number?: string;
  status?: string;
  verified?: boolean;
};

interface ViewUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: UserProps | null;
  // onEdit: (user: UserProps) => void;
  // onSuspend: (userId: string) => void;
  // onDeactivate: (userId: string) => void;
}

const ViewUserDialog: React.FC<ViewUserDialogProps> = ({
  open,
  onClose,
  user,
  // onEdit,
  // onSuspend,
  // onDeactivate,
}) => {
  if (!user) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        User Details
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="subtitle1">Name:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{user.name}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="subtitle1">Email:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{user.email}</Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="subtitle1">Type:</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography>{user.type}</Typography>
          </Grid>

          {user.mobile_number && (
            <>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Mobile Number:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{user.mobile_number}</Typography>
              </Grid>
            </>
          )}

          {user.alt_mobile_number && (
            <>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Alt. Mobile Number:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{user.alt_mobile_number}</Typography>
              </Grid>
            </>
          )}

          {user.status && (
            <>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Status:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{user.status}</Typography>
              </Grid>
            </>
          )}

          {user.verified !== undefined && (
            <>
              <Grid item xs={4}>
                <Typography variant="subtitle1">Verified:</Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography>{user.verified ? 'Yes' : 'No'}</Typography>
              </Grid>
            </>
          )}
          {/* You can add more user details here using the same Grid structure */}
        </Grid>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={() => onEdit(user)} color="primary">
          Edit
        </Button>
        <Button onClick={() => onSuspend(user.id)} color="warning">
          Suspend
        </Button>
        <Button onClick={() => onDeactivate(user.id)} color="error">
          Deactivate
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserDialog;