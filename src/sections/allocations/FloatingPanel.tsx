import React from "react";
import { Filter } from "lucide-react";
import Draggable from "react-draggable";

import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Fab, Checkbox, IconButton, Typography, FormControlLabel } from '@mui/material'; // Or any close icon from MUI Icons

interface FloatingPanelProps {
  defaultColumns: { field: string; headerName: string }[];
  visibleColumns: { field: string; headerName: string }[];
  onChange: (field: string, isVisible: boolean) => void;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({ defaultColumns, visibleColumns, onChange }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <Draggable>
      <Box
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 99,
          overflow: "hidden",
        }}
      >
        {/* Floating Button */}
        {!isExpanded && (
          <Fab
            color="primary"
            aria-label="filter"
            onClick={toggleExpand}
            sx={{
              width: 60,
              height: 60,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Filter size={24} color="#fff" />
          </Fab>
        )}

        {/* Expandable Panel */}
        {isExpanded && (
          <Box
            sx={{
              width: "300px",
              height: "400px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              padding: "16px",
              position: "relative",
              cursor: "default",
              overflowY: 'scroll'
            }}
          >
            <IconButton
              aria-label="close"
              onClick={toggleExpand}
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px",
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ marginTop: "40px" }}>
              <Typography variant="h6" sx={{ marginBottom: "16px", fontWeight: "bold", fontSize: "18px" }}>
                Manage Columns
              </Typography>
              {defaultColumns.map((col) => (
                <Box key={col.field} sx={{ marginBottom: "8px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.some(
                          (visibleCol) => visibleCol.field === col.field
                        )}
                        onChange={(e) => onChange(col.field, e.target.checked)}
                        sx={{ marginRight: "8px" }}
                      />
                    }
                    label={col.headerName}
                    sx={{ display: "flex", alignItems: "center" }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Draggable>
  );
};

export default FloatingPanel;