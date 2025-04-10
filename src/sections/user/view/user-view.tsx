import React, { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';

import api from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { AddUserDialog } from './AddUserDialog';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';
import ViewUserDialog from './ViewUserDialog';

// ----------------------------------------------------------------------
export function UserView() {
  const table = useTable();
  const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" }>({ message: "", severity: 'error' });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [openViewUserDialog, setOpenViewUserDialog] = useState(false);
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/user_block/users', {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenAddUserDialog = (user?: UserProps) => {
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
    setSelectedUser(null);
  };

  const handleAddOrEditUser = (newUser: UserProps) => {
    if (selectedUser) {
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, ...newUser } : user)));
    } else {
      setUsers([...users, newUser]);
    }
    handleCloseAddUserDialog();
  };

  const handleDeleteUser = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.delete(`/user_block/users/${id}`);
      setSnackbar({ message: response.data.message || 'User deleted successfully', severity: 'success' });
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({ message: error.data.message || 'something went wrong', severity: 'error' });
      setOpenSnackbar(true);
      setUsers(users.filter((user) => user.id !== id));
    } finally {
      setLoading(false);
    }

  };

  const handleViewUserDialog = (user: UserProps) => {
    setOpenViewUserDialog(true);
    setSelectedUser(user);
  }

  const handleCloseViewUserDialog = () => {
    setOpenViewUserDialog(false);
    setSelectedUser(null);
  }

  return (
    <>
      <DashboardContent>
        <Box display="flex" alignItems="center" mb={5}>
          <Typography variant="h4" flexGrow={1}>
            Users
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenAddUserDialog()}
          >
            New user
          </Button>
        </Box>

        <Card>
          <UserTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              {loading ? (
                <Typography align="center">Loading...</Typography>
              ) : (
                <Table sx={{ minWidth: 800 }}>
                  <UserTableHead
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={users.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        users.map((user) => user.id)
                      )
                    }
                    headLabel={[
                      { id: "avatar" },
                      { id: 'name', label: 'Name' },
                      { id: 'email', label: 'Email' },
                      { id: 'type', label: 'UserType' },
                      { id: 'mobile_number', label: 'Mobile' },
                      { id: 'verified', label: 'Verified?' },
                      { id: 'status', label: 'Status' },
                      { id: 'action', label: 'Actions' },
                    ]}
                  />
                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <UserTableRow
                          key={row.id}
                          row={row}
                          onSelectUser={() => handleViewUserDialog(row)}
                          selected={table.selected.includes(row.id)} // Check if row is selected
                          onSelectRow={() => table.onSelectRow(row.id)} // Update selection on row click
                          onEdit={() => handleOpenAddUserDialog(row)}
                          onDelete={() => handleDeleteUser(row.id)}
                          avatar={row.avatar}
                        />
                      ))}

                    <TableEmptyRows
                      height={68}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                    />

                    {notFound && <TableNoData searchQuery={filterName} />}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={users.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25,200]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        <AddUserDialog
          open={openAddUserDialog}
          onClose={handleCloseAddUserDialog}
          onAddUser={handleAddOrEditUser}
          editingUser={selectedUser}
        />

        <ViewUserDialog
          open={openViewUserDialog}
          onClose={handleCloseViewUserDialog}
          user={selectedUser}
          // onEdit={() => selectedUser}
          // onSuspend={() => null}
          // onDeactivate={() => null}
        />
      </DashboardContent>
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
    </>
  );
}


// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
