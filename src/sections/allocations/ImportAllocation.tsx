import React, { useState } from "react";
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import api from "src/utils/api";

interface ImportAllocation {
  open: boolean;
  onClose: () => void;
  refreshData: () => void;
}

const ImportAllocation: React.FC<ImportAllocation> = ({open, onClose, refreshData}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // @ts-expect-error
  const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" }>({ message: "", severity: null });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const handleImport = async () => {

    if (!file) {
      setSnackbar({ message: "Please select a file to import.", severity: "error" });
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

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
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Import Allocation Drafts</DialogTitle>
        <DialogContent>
          <div className="mb-4">
            <input
              type="file"
              accept=".csv, .xlsx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
            />
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
