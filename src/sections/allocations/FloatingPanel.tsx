import React from 'react';
import Draggable from "react-draggable";
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
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
                width: isExpanded ? "600px" : "300px", // Adjust width based on expanded state
                height: isExpanded ? "400px" : "40px", // Adjust height based on expanded state
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                cursor: "move", // Show drag cursor
                overflow: "hidden",
                position: "absolute",
                zIndex: 99
            }}
        >
            <button onClick={toggleExpand}>
                {isExpanded ? "Collapse" : "Expand"}
            </button>
            <div style={{
                    height: "100%",
                    overflow: "scroll"
                  }}>
              {/* <div style={{ position: 'absolute', top: 50, right: 20, width: '300px', background: '#f4f4f4', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}> */}
                <h4>Manage Columns</h4>
                {defaultColumns.map((col) => (
                  <div key={col.field}>
                    <label>
                      <input
                        type="checkbox"
                        checked={visibleColumns.some((visibleCol) => visibleCol.field === col.field)}
                        onChange={(e) => onChange(col.field, e.target.checked)}
                      />
                      {col.headerName}
                    </label>
                  </div>
                ))}
              {/* </div> */}
            </div>
        </div>
    </Draggable>
  );
};

export default FloatingPanel;
