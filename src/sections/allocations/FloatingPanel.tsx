import React from "react";
import Draggable from "react-draggable";
import { Filter } from "lucide-react"; // Import the filter icon

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
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 99,
          overflow: "hidden",
        }}
      >
        {/* Floating Button */}
        {!isExpanded && (
          <button
            onClick={toggleExpand}
            style={{
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <Filter size={24} />
          </button>
        )}

        {/* Expandable Panel */}
        {isExpanded && (
          <div
            style={{
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
            <button
              onClick={toggleExpand}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Filter size={24} style={{ color: "#333" }} />
            </button>

            <div style={{ marginTop: "40px" }}>
              <h4 style={{ marginBottom: "16px", fontWeight: "bold", fontSize: "18px" }}>
                Manage Columns
              </h4>
              {defaultColumns.map((col) => (
                <div key={col.field} style={{ marginBottom: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      style={{ marginRight: "8px" }}
                      checked={visibleColumns.some(
                        (visibleCol) => visibleCol.field === col.field
                      )}
                      onChange={(e) => onChange(col.field, e.target.checked)}
                    />
                    {col.headerName}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default FloatingPanel;
