import React, { useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box, Paper, Table, Stack, Button, Dialog, TableRow, TableBody, TableCell, TableHead,
  Accordion, TextField, Typography, IconButton, DialogTitle, DialogContent, DialogActions, TableContainer, CircularProgress,
  AccordionSummary, AccordionDetails, DialogContentText
} from '@mui/material';

import api from 'src/utils/api';

interface FinancialEntity {
  id: number;
  name: string;
  code: string;
  contact_number: string | null;
  email: string | null;
}

const AdminSettings: React.FC = () => {
  const [entities, setEntities] = useState<FinancialEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<FinancialEntity | null>(null);
  const [newEntity, setNewEntity] = useState<Omit<FinancialEntity, 'id'>>({
    name: '',
    code: '',
    contact_number: '',
    email: '',
  });

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<boolean>(false);
  const [entityToDelete, setEntityToDelete] = useState<FinancialEntity | null>(null);

  const fetchFinancialEntities = async () => {
    try {
      const response = await api.get<FinancialEntity[]>('/financial_entities');
      setEntities(response.data);
    } catch (error) {
      console.error('Failed to fetch financial entities', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialEntities();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedEntity(null);
    setNewEntity({ name: '', code: '', contact_number: '', email: '' });
    setOpenModal(true);
  };

  const handleOpenEditModal = (entity: FinancialEntity) => {
    setSelectedEntity(entity);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEntity(null);
    setOpenModal(false);
  };

  const handleSaveEntity = async () => {
    if (selectedEntity) {
      // Update
      try {
        const response = await api.put<FinancialEntity>(`/financial_entities/${selectedEntity.id}`, selectedEntity);
        setEntities((prev) =>
          prev.map((e) => (e.id === selectedEntity.id ? response.data : e))
        );
        handleCloseModal();
      } catch (error) {
        console.error('Failed to update financial entity', error);
      }
    } else {
      // Create
      try {
        const response = await api.post<FinancialEntity>('/financial_entities', newEntity);
        setEntities((prev) => [...prev, response.data]);
        handleCloseModal();
      } catch (error) {
        console.error('Failed to add financial entity', error);
      }
    }
  };

  const handleRequestDelete = (entity: FinancialEntity) => {
    setEntityToDelete(entity);
    setOpenDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (entityToDelete) {
      try {
        await api.delete(`/financial_entities/${entityToDelete.id}`);
        setEntities((prev) => prev.filter((e) => e.id !== entityToDelete.id));
        setOpenDeleteConfirm(false);
        setEntityToDelete(null);
      } catch (error) {
        console.error('Failed to delete financial entity', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteConfirm(false);
    setEntityToDelete(null);
  };

  const isEditMode = Boolean(selectedEntity);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Admin Settings
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="financial-entities-content"
            id="financial-entities-header"
            sx={{ flexDirection: 'row-reverse' }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
              <Typography variant="h6" fontWeight={500}>
                Financial Entities
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAddModal();
                }}
              >
                Add Entity
              </Button>
            </Stack>
          </AccordionSummary>

          <AccordionDetails>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID</strong></TableCell>
                      <TableCell><strong>Bank Name</strong></TableCell>
                      <TableCell><strong>Code</strong></TableCell>
                      <TableCell><strong>Contact Number</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entities.map((entity) => (
                      <TableRow key={entity.id}>
                        <TableCell>{entity.id}</TableCell>
                        <TableCell>{entity.name}</TableCell>
                        <TableCell>{entity.code}</TableCell>
                        <TableCell>{entity.contact_number || 'N/A'}</TableCell>
                        <TableCell>{entity.email || 'N/A'}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton color="primary" size="small" onClick={() => handleOpenEditModal(entity)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton color="error" size="small" onClick={() => handleRequestDelete(entity)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Add/Edit Entity Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'Edit Financial Entity' : 'Add New Financial Entity'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Bank Name"
              value={isEditMode ? selectedEntity?.name : newEntity.name}
              onChange={(e) =>
                isEditMode
                  ? setSelectedEntity((prev) => prev ? { ...prev, name: e.target.value } : null)
                  : setNewEntity((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Code"
              value={isEditMode ? selectedEntity?.code : newEntity.code}
              onChange={(e) =>
                isEditMode
                  ? setSelectedEntity((prev) => prev ? { ...prev, code: e.target.value } : null)
                  : setNewEntity((prev) => ({ ...prev, code: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Contact Number"
              value={isEditMode ? selectedEntity?.contact_number ?? '' : newEntity.contact_number ?? ''}
              onChange={(e) =>
                isEditMode
                  ? setSelectedEntity((prev) => prev ? { ...prev, contact_number: e.target.value } : null)
                  : setNewEntity((prev) => ({ ...prev, contact_number: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={isEditMode ? selectedEntity?.email ?? '' : newEntity.email ?? ''}
              onChange={(e) =>
                isEditMode
                  ? setSelectedEntity((prev) => prev ? { ...prev, email: e.target.value } : null)
                  : setNewEntity((prev) => ({ ...prev, email: e.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEntity}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete{' '}
            <strong>{entityToDelete?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;
