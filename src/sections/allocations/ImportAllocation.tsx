import React, { useState, useEffect } from "react";

import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Alert,
  Dialog,
  Button,
  Select,
  Snackbar,
  MenuItem,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import api from "src/utils/api";

interface ImportAllocationProps {
  open: boolean;
  onClose: () => void;
  refreshData: () => void;
}

interface FinancialEntity {
  id: number;
  name: string;
}

const ImportAllocation: React.FC<ImportAllocationProps> = ({ open, onClose, refreshData }) => {
  const [file, setFile] = useState<File | null>(null);
  const [entityId, setEntityId] = useState<number | "">("");
  const [entities, setEntities] = useState<FinancialEntity[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  // @ts-expect-error
  const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" }>({ message: "", severity: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (open) {
      fetchEntities();
    }
  }, [open]);

  const fetchEntities = async () => {
    setLoadingEntities(true);
    try {
      const response = await api.get<FinancialEntity[]>('/financial_entities');
      setEntities(response.data);
    } catch (error) {
      console.error('Failed to fetch financial entities', error);
    } finally {
      setLoadingEntities(false);

    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!entityId) {
      setSnackbar({ message: "Please select a Financial Entity.", severity: "error" });
      setOpenSnackbar(true);
      return;
    }

    if (!file) {
      setSnackbar({ message: "Please select a file to import.", severity: "error" });
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("financial_entity_id", String(entityId));

    try {
      const response = await api.post(
        `/allocation_drafts/import_allocation`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      if (response.status === 200) {
        setSnackbar({ message: response.data.message || "File imported successfully.", severity: "success" });
        refreshData();
        onClose();
        setEntityId("");
        setFile(null);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Something went wrong.";
      setSnackbar({ message: errorMessage, severity: "error" });
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Import Allocation Drafts</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="entity-select-label">Select Financial Entity</InputLabel>
            <Select
              labelId="entity-select-label"
              value={entityId}
              label="Select Financial Entity"
              onChange={(e) => setEntityId(e.target.value as number)}
              disabled={loadingEntities}
            >
              {loadingEntities ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    Loading Entities...
                  </Typography>
                </MenuItem>
              ) : (
                entities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <div className="mb-4">
          <FormControl fullWidth sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadFileIcon />}
          >
            {file ? file.name : 'Choose File'}
            <input
              type="file"
              accept=".csv, .xlsx"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isLoading}
            color="primary"
            variant="contained"
          >
            {isLoading ? "Uploading..." : "Import File"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {snackbar.severity && (
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default ImportAllocation;
