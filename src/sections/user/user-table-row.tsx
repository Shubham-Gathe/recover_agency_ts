import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
export type UserProps = {
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

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectUser: () => void;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
  avatar?: string;  // Add avatar to the row props
};

export function UserTableRow({ row, onSelectUser, selected, onSelectRow, onEdit, onDelete, avatar }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>
        <TableCell>
          {avatar ? (
            <Avatar src={avatar} alt={row.name} />
          ) : (
            <Avatar>{row.name[0]}</Avatar>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          <Box display="flex" alignItems="center">
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.email}</TableCell>
        <TableCell>{row.type}</TableCell>
        <TableCell>{row.mobile_number}</TableCell>
        {
          (row.verified) ? (
            <TableCell>
              <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'success.main' }} />
            </TableCell>
          ) : (
            <TableCell>
              <Iconify icon="eva:close-circle-fill" sx={{ color: 'error.main' }} />
            </TableCell>
          )
        }
        <TableCell>{row.status}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={onSelectUser}>
            <Iconify icon="solar:user-id-bold" />
            View
          </MenuItem>

          <MenuItem onClick={onEdit}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={() => {
              if (window.confirm(`Are you sure you want to delete user "${row.name}"?`)) {
                onDelete();
              }
            }} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

