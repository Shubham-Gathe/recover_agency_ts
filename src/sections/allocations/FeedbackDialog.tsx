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
import { Label } from "@mui/icons-material";

interface FeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

type FieldValues = { [field: string]: string };

// Configuration mapping for codes and their required fields.
// For codes that don’t require a subcode, useSubCode is false and the 'fields' array is used.
// For codes that require a subcode, useSubCode is true and subCodeOptions provides a mapping
// of subcode values to the list of required fields.
const codeConfigurations: {
  [code: string]: {
    useSubCode: boolean;
    fields?: string[];
    subCodeOptions?: { [subCode: string]: string[] };
  };
} = {
  PAID: {
    useSubCode: false,
    fields: ["Amount", "Remarks"],
  },
  PPD: {
    useSubCode: false,
    fields: ["Amount", "Next Payment Date", "Remarks"],
  },
  PTP: {
    useSubCode: false,
    fields: ["Promise to Pay Date"],
  },
  RTP: {
    useSubCode: true,
    subCodeOptions: {
      "INTENTIONALLY": ["Reason"],
      "FUND ISSUE": ["Reason"],
      "DISPUTE": ["Reason"],
      "HOSPITALIZED/MEDICAL ISSUE": ["Reason"],
      "DEATH": ["Reason"],
      "NCLT/LEGAL": ["Reason"],
    },
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
  },
  FRD: {
    useSubCode: false,
    fields: ["Details"],
  },
};

const FeedbackDialog: React.FC<FeedbackProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [subCode, setSubCode] = useState("");
  const [fieldValues, setFieldValues] = useState<FieldValues>({});

  const handleCodeChange = (event: any) => {
    const selectedCode = event.target.value;
    setCode(selectedCode);
    // Reset subCode and field values when code changes.
    setSubCode("");
    setFieldValues({});
  };

  const handleSubCodeChange = (event: any) => {
    const selectedSubCode = event.target.value;
    setSubCode(selectedSubCode);
    // Reset field values when subcode changes.
    setFieldValues({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  // Determine which fields to render based on the selected code and, if applicable, subcode.
  let requiredFields: string[] = [];
  if (code) {
    const config = codeConfigurations[code];
    if (config) {
      if (config.useSubCode) {
        // If a subcode is needed, then wait for the subcode selection.
        if (subCode) {
          requiredFields = config.subCodeOptions?.[subCode] || [];
          // console.log("field ->", requiredFields);
        }
      } else {
        // For codes where code and subcode are the same (or subcode isn’t needed).
        requiredFields = config.fields || [];
      }
    }
  }

  const handleSubmit = () => {
    console.log('requiredFields >>>> ', requiredFields);
    // Here you can add validations or API calls as needed.
    const isValid = requiredFields.every((field) => fieldValues.hasOwnProperty(field) && fieldValues[field] !== "");
    console.log("Submitted Data:", { code, subCode, fieldValues});
    if(!isValid) {
      alert("Please fill all required fields...\n" + "Invalid: " + requiredFields);
      return;
    }
    onClose();
  };

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
                {Object.keys(codeConfigurations).map((codeKey) => (
                  <MenuItem key={codeKey} value={codeKey}>
                    {codeKey}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* SubCode Dropdown (if required) */}
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

          {/* Dynamic Fields Based on Code/SubCode */}
          {requiredFields.map((field) => (
            <>
              <Grid item xs={12} key={field}>
              {(field === "Reason" ) ? (
                <>
                  <Typography variant="body1" flexGrow={1}>
                    Reason
                  </Typography>
                  <TextareaAutosize
                    minRows={4}
                    placeholder="Enter Reason"
                    value={fieldValues[field] || ""}
                    onChange={(e) =>  handleFieldChange(field, e.target.value)}
                    style={{ width: "100%", padding: "8px", fontSize: "16px", borderRadius: "4px", borderColor: "#ccc" }}
                  />
                </>
              ) : (
                <TextField
                  fullWidth
                  label={field}
                  value={fieldValues[field] || ""}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                />
              )}
              </Grid>
            </>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;