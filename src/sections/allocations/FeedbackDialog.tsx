import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Bold } from "lucide-react";
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

interface FeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

type FieldValues = { [field: string]: string };

// Options for the Resolution dropdown (used for PAID code)
const resolutionOptions = [
  { label: "Stable", value: "stab" },
  { label: "Normalize", value: "norm" },
  { label: "Rollback", value: "rb" },
  { label: "Flow", value: "flow" },
];

// Configuration for Feedback Codes
const codeConfigurations: {
  [code: string]: {
    useSubCode: boolean;
    fields?: string[];
    subCodeOptions?: { [subCode: string]: string[]; };
    category: 'CALLING' | 'VISIT' | 'BOTH'; // Define categories for role-based visibility
  }
} = {
  PAID: {
    useSubCode: false,
    fields: ["Paid Amount", "Remarks"], // Resolution dropdown is handled separately
    category: 'BOTH',
  },
  PPD: {
    useSubCode: false,
    fields: ["Amount", "Next Payment Date", "Remarks"],
    category: 'BOTH',
  },

  // CALLING CODES - Visible to Callers and Admins
  FTP: {
    useSubCode: false,
    fields: ["Promise to Pay Date", "Amount"],
    category: 'CALLING',
  },
  BPTP: {
    useSubCode: false,
    fields: ["Promise to Pay Date", "Amount", "Remarks"],
    category: 'CALLING',
  },
  BNR: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'CALLING',
  },
  DISC: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'CALLING',
  },
  CLB: {
    useSubCode: false,
    fields: ["Callback Date"],
    category: 'CALLING',
  },
  SW: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'CALLING',
  },
  NI: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'CALLING',
  },
  DISPUTE: {
    useSubCode: false,
    fields: ["Dispute Details"],
    category: 'CALLING',
  },
  LMG: {
    useSubCode: false,
    fields: ["Left Message To", "Remarks"],
    category: 'CALLING',
  },
  RTP: {
    useSubCode: false,
    fields: ["Detailed Feedback", "PTP Date"],
    category: 'CALLING',
  },
  SET: {
    useSubCode: false,
    fields: ["Settlement Amount", "Settlement Date"],
    category: 'CALLING',
  },
  SETTLED: {
    useSubCode: false,
    fields: ["Settlement Amount", "Settled Date"],
    category: 'CALLING',
  },
  FRD: {
    useSubCode: false,
    fields: ["Details"],
    category: 'CALLING',
  },
  NC: {
    useSubCode: true,
    subCodeOptions: {
      "ANF": ["Remarks"],
      "SKIP/SHIFTED": ["Time Skip", "Confirmed By"],
      "NSP": ["Remarks"],
      "WRONG/INCOMPLETE ADDRESS": ["Remarks"],
      "RING": ["Calling Remarks"],
      "SO": ["Calling Remarks"],
      "NR": ["Calling Remarks"],
    },
    category: 'CALLING',
  },
  WIP: {
    useSubCode: true,
    subCodeOptions: {
      "CB": ["Callback Date/Time"],
      "LM": ["Left Message To"],
      "HLK": ["Lock Details"],
      "OST": ["Out of Station Details"],
      "Settlement": ["Settlement Details"],
      "BPTP": ["Reason", "Next PTP Date"],
    },
    category: 'CALLING',
  },

  // VISIT CODES - Visible to Executives and Admins
  BFTP: {
    useSubCode: false,
    fields: ["Promise to Pay Date", "Amount"],
    category: 'VISIT',
  },
  DLC: {
    useSubCode: false,
    fields: ["Door Lock Details"],
    category: 'VISIT',
  },
  SHIFTED: {
    useSubCode: false,
    fields: ["New Address", "Remarks"],
    category: 'VISIT',
  },
  SKIP: {
    useSubCode: false,
    fields: ["Skip Details"],
    category: 'VISIT',
  },
  ANF: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'VISIT',
  },
  SA: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'VISIT',
  },
  WA: {
    useSubCode: false,
    fields: ["Remarks"],
    category: 'VISIT',
  },
  DISPUTE_VISIT: { // Renamed to distinguish from CALLING DISPUTE if needed to handle differently
    useSubCode: false,
    fields: ["Dispute Details"],
    category: 'VISIT',
  },
  LMG_VISIT: { // Renamed to distinguish from CALLING LMG if needed to handle differently
    useSubCode: false,
    fields: ["Left Message To", "Remarks"],
    category: 'VISIT',
  },
  RTP_VISIT: { // Renamed to distinguish from CALLING RTP if needed to handle differently
    useSubCode: false,
    fields: ["Detailed Feedback"],
    category: 'VISIT',
  },
  SET_VISIT: { // Renamed to distinguish from CALLING SET if needed to handle differently
    useSubCode: false,
    fields: ["Settlement Amount", "Settlement Date"],
    category: 'VISIT',
  },
  SETTLED_VISIT: { // Renamed to distinguish from CALLING SETTLED if needed to handle differently
    useSubCode: false,
    fields: ["Settlement Amount", "Settled Date"],
    category: 'VISIT',
  },
};

const FeedbackDialog: React.FC<FeedbackProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [subCode, setSubCode] = useState("");
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const user = useSelector((state: any) => state.auth.user); // Access user role from Redux store

  // Handler for Code dropdown change
  const handleCodeChange = (event: any) => {
    const selectedCode = event.target.value;
    setCode(selectedCode);
    // Reset subCode and field values when code changes
    setSubCode("");
    setFieldValues({});
  };

  // Handler for SubCode dropdown change
  const handleSubCodeChange = (event: any) => {
    const selectedSubCode = event.target.value;
    setSubCode(selectedSubCode);
    // Reset field values when subcode changes
    setFieldValues({});
  };

  // Handler for dynamic field changes
  const handleFieldChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  // Determine required fields based on selected code and subcode
  let requiredFields: string[] = [];
  if (code) {
    const config = codeConfigurations[code];
    if (config) {
      if (config.useSubCode) {
        if (subCode) {
          requiredFields = config.subCodeOptions?.[subCode] || [];
        }
      } else {
        requiredFields = config.fields || [];
      }
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    console.log('requiredFields >>>> ', requiredFields);
    // Fields to validate, initially same as requiredFields
    let fieldsToValidate = [...requiredFields];

    // Conditionally add "resolution" to validation for PAID code
    if (code === "PAID") {
      fieldsToValidate.push("resolution");
    }

    console.log('fieldsToValidate >>>> ', fieldsToValidate); // Debugging log

    // Validate that all required fields (and resolution for PAID) are filled
    const isValid = fieldsToValidate.every((field) => {
      if (field === "resolution" && code !== "PAID") return true; // Exclude resolution validation for non-PAID codes
      return fieldValues.hasOwnProperty(field) && fieldValues[field] !== "";
    });

    console.log("Submitted Data:", { code, subCode, fieldValues });
    if (!isValid && fieldsToValidate.length > 0) { // Only show alert if there are fields to validate
      alert("Please fill all required fields...\n" + "Invalid Fields: " + fieldsToValidate.join(", "));
      return;
    }
    console.log("Submitted Data:", { code, subCode, fieldValues });
    onClose(); // Close the dialog after successful submission
  };

  // Function to filter codes based on user role
  const getFilteredCodes = () => {
    const allCodes = Object.keys(codeConfigurations);
    if (user && user.role.toLowerCase() === 'caller') {
      return allCodes.filter(codeKey => codeConfigurations[codeKey].category === 'CALLING' || codeConfigurations[codeKey].category === 'BOTH'); // Callers see CALLING and BOTH codes
    } else if (user && user.role.toLowerCase() === 'executive') {
      return allCodes.filter(codeKey => codeConfigurations[codeKey].category === 'VISIT' || codeConfigurations[codeKey].category === 'BOTH'); // Executives see VISIT and BOTH codes
    } else { // Admin and other roles see all codes
      return allCodes;
    }
  };

  const filteredCodes = getFilteredCodes(); // Get codes filtered by user role
  const orderedCodes = ["PAID", "PPD", ...filteredCodes.filter(codeKey => codeKey !== "PAID" && codeKey !== "PPD").sort()]; // Order codes: PAID, PPD first, then others alphabetically

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Feedback</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Code Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="code-select-label">Select Code</InputLabel>
              <Select
                labelId="code-select-label"
                value={code}
                label="Select Code"
                onChange={handleCodeChange}
              >
                {/* Map through ordered and filtered codes for the dropdown */}
                {orderedCodes.map((codeKey) => {
                  const codeConfig = codeConfigurations[codeKey];
                  let itemStyle = {};
                  // Apply different colors for admin to categorize codes visually
                  if (user && user.role.toLowerCase() === 'admin') {
                    itemStyle = codeConfig.category === 'CALLING' ? { color: 'blue' } : (codeConfig.category === 'VISIT' ? { color: 'green' } : { color: 'black' }); // Color CALLING blue, VISIT green, BOTH black
                  }
                  return (
                    <MenuItem key={codeKey} value={codeKey} sx={itemStyle}>
                      {codeKey}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>

          {/* SubCode Dropdown (Conditional rendering based on code config) */}
          {code && codeConfigurations[code]?.useSubCode && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="subcode-select-label">Select Sub Code</InputLabel>
                <Select
                  labelId="subcode-select-label"
                  value={subCode}
                  label="Select Sub Code"
                  onChange={handleSubCodeChange}
                >
                  {/* Render SubCode options based on code configuration */}
                  {codeConfigurations[code].subCodeOptions &&
                    Object.keys(codeConfigurations[code].subCodeOptions).map((sub) => (
                      <MenuItem key={sub} value={sub}>
                        {sub}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {/* Dynamic Fields - Render fields based on selected Code/SubCode */}
          {requiredFields.map((field) => {
            // Determine if field is for amount or date for input type
            const isAmountField = ["Amount", "Emi Amount", "BCC Amount", "Total Amount", "Settlement Amount", "Paid Amount"].includes(field);
            const isDateField = ["Promise to Pay Date", "Callback Date", "Next Payment Date", "Settlement Date", "Settled Date", "PTP Date", "Callback Date/Time", "Next PTP Date", "Settlement Date"].includes(field);

            return (
              <React.Fragment key={field}>
                <Grid item xs={12} >
                  {/* Use TextareaAutosize for 'Remarks' and similar fields */}
                  {(field === "Remarks" || field === "Detailed Feedback" || field === "Dispute Details" || field === "Door Lock Details" || field === "Skip Details") ? (
                    <>
                      <Typography variant="body1" flexGrow={1}>
                        {field}
                      </Typography>
                      <TextareaAutosize
                        minRows={4}
                        placeholder={`Enter ${field}`}
                        value={fieldValues[field] || ""}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        style={{ width: "100%", padding: "8px", fontSize: "16px", borderRadius: "4px", borderColor: "#ccc" }}
                      />
                    </>
                  ) : (
                    // Use TextField for other fields, with type determined by field name
                    <TextField
                      fullWidth
                      label={field}
                      value={fieldValues[field] || ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      type={isAmountField ? "number" : isDateField ? "date" : "text"} // Set input type based on field type
                      inputProps={isAmountField ? { step: "0.01" } : {}} // Allow decimal input for amount fields
                      InputLabelProps={isDateField ? { shrink: true } : {}} // Ensure DatePicker label doesn't overlap
                    />
                  )}
                </Grid>
              </React.Fragment>
            )
          })}

          {/* Resolution Dropdown - Conditionally rendered for PAID code */}
          {code === "PAID" && (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Resolution</InputLabel>
                <Select
                  value={fieldValues["resolution"] || ""}
                  onChange={(e) => handleFieldChange("resolution", e.target.value)}
                >
                  {/* Render Resolution options */}
                  {resolutionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label + ' (' + option.value + ')'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;