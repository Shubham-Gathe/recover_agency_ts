import { useSelector } from 'react-redux';
import React, { useMemo, useState, useEffect } from "react";

import {
  Grid,
  Paper,
  Alert,
  Dialog,
  Button,
  Select,
  MenuItem,
  Snackbar,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormHelperText,
  TextareaAutosize,
  CircularProgress,
} from "@mui/material";

import api from "src/utils/api";

interface RowData {
  id: number;
  segment: string;
  pool: string;
  branch: string;
  agreement_id: string;
  customer_name: string;
  pro: string;
  bkt: string;
  fos_name: string;
  fos_mobile_no: string | null;
  caller_name: string;
  caller_mo_number: string | null;
  f_code: string | null;
  ptp_date: string | null;
  feedback: string | null;
  res: string;
  emi_coll: number;
  cbc_coll: number;
  total_coll: number;
  fos_id: string | null;
  mobile: string;
  address: string;
  zipcode: string;
  phone1: string;
  phone2: string;
  loan_amt: number;
  pos: string;
  emi_amt: number;
  emi_od_amt: number;
  bcc_pending: string;
  penal_pending: string;
  cycle: number;
  tenure: number;
  disb_date: string | null;
  emi_start_date: string | null;
  emi_end_date: string | null;
  manufacturer_desc: string;
  asset_cat: string;
  supplier: string;
  system_bounce_reason: string;
  reference1_name: string;
  reference2_name: string;
  so_name: string;
  ro_name: string;
  all_dt: string;
  created_at: string;
  updated_at: string;
  caller_id: number;
  executive_id: number | null;
}
interface FeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  selectedData: RowData
}

type FieldValues = { [field: string]: string };
type FieldErrors = { [field: string]: string[] };
// Options for the Resolution dropdown (used for PAID code)
const resolutionOptions = [
  { label: "Stable", value: "stab" },
  { label: "Normalize", value: "norm" },
  { label: "Rollback", value: "rb" },
  { label: "Flow", value: "flow" },
];

interface FeedbackCodeFromApi {
  code: string;
  use_sub_code: boolean;
  category: 'CALLING' | 'VISIT' | 'BOTH';
  description: string;
  fields: string[];
}

interface CodeConfiguration {
  useSubCode: boolean;
  category: 'CALLING' | 'VISIT' | 'BOTH';
  description: string;
  fields: string[];
  subCodeOptions: { [subCode: string]: string[] }; // Assuming subCodeOptions will be added later or fetched separately
}

interface ApiCodeConfigurations {
  [code: string]: CodeConfiguration;
}


const FeedbackDialog: React.FC<FeedbackProps> = ({ isOpen, onClose, selectedData }) => {
  const [code, setCode] = useState("");
  const [subCode, setSubCode] = useState("");
  const [fieldValues, setFieldValues] = useState<FieldValues>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const user = useSelector((state: any) => state.auth.user);
  const [apiCodeConfigurations, setApiCodeConfigurations] = useState<ApiCodeConfigurations>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: "success" | "error" }>({ message: "", severity: 'success' });

  useEffect(() => {
    const fetchFeedbackCodes = async () => {
      if (selectedData && isOpen) {
        // setLoading(true);
        try {
          const response = await api.get('/feedback_codes', {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          });
          const {data} = response;
          // Transform the array response into an object keyed by 'code' with correct types
          const configObject: ApiCodeConfigurations = data.reduce((acc: ApiCodeConfigurations, feedbackCode: FeedbackCodeFromApi) => {
            acc[feedbackCode.code] = {
              useSubCode: feedbackCode.use_sub_code,
              category: feedbackCode.category,
              description: feedbackCode.description,
              fields: feedbackCode.fields,
              subCodeOptions: {}
            };
            return acc;
          }, {} as ApiCodeConfigurations);
          setApiCodeConfigurations(configObject);

        } catch (error: any) {
          console.error("Error fetching feedback codes:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFeedbackCodes();
  }, [isOpen, selectedData]);
  // Handler for Code dropdown change
  const handleCodeChange = (event: any) => {
    const selectedCode = event.target.value;
    setCode(selectedCode);
    // Reset subCode and field values when code changes
    setSubCode("");
    setFieldErrors({});
    setFieldValues({});
  };

  // Handler for SubCode dropdown change
  const handleSubCodeChange = (event: any) => {
    const selectedSubCode = event.target.value;
    setSubCode(selectedSubCode);
    // Reset field values when subcode changes
    setFieldErrors({});
    setFieldValues({});
  };

  // Handler for dynamic field changes
  const handleFieldChange = (field: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [field]: value }));
  };

  // Determine required fields based on selected code and subcode
  let requiredFields: string[] = [];
  if (code) {
    const config = apiCodeConfigurations[code];
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
  const handleSubmit = async () => {
    setSubmitLoading(true);
    setFieldErrors({});
    // Fields to validate, initially same as requiredFields
    const fieldsToValidate = [...requiredFields];

    // Conditionally add "resolution" to validation for PAID code
    if (code === "PAID") {
      fieldsToValidate.push("resolution");
    }

    // Validate that all required fields (and resolution for PAID) are filled
    const isValid = fieldsToValidate.every((field) => {
      if (field === "resolution" && code !== "PAID") return true; // Exclude resolution validation for non-PAID codes
      return Object.hasOwn(fieldValues, field) && fieldValues[field] !== "";
    });

    if (!isValid && fieldsToValidate.length > 0) { // Only show alert if there are fields to validate
      const errors: FieldErrors = {};
      fieldsToValidate.forEach(field => {
        if (!(Object.hasOwn(fieldValues, field) && fieldValues[field] !== "")) {
          errors[field] = ["This field is required"]; // Set error message for each invalid field
        }
      });
      setFieldErrors(errors);
      setSubmitLoading(false);
      return;
    }

    if (isValid) {
      try {
        const response = await api.post(
          `/feedbacks`,
          { allocation_id: selectedData.id, feedback: { code, subCode, ...fieldValues } },
          {
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          }
        )
        setSnackbar({
          message: response.data.message,
          severity: response.status === 200 ? "success" : "error"
        });
        setOpenSnackbar(true);

        setTimeout(() => {
          if (response.data) {
            setOpenSnackbar(false);
            onClose();
            setSubmitLoading(false);
          }
        }, 3500);
      } catch (error) {
        if (error.response?.data?.errors) {
          setFieldErrors(error.response.data.errors);
        }
        setSnackbar({
          message: error.response?.data?.message || "Something went wrong!",
          severity: "error"
        });
        setOpenSnackbar(true);
        setSubmitLoading(false);
        console.error(error);

        setTimeout(() => {
          setOpenSnackbar(false);
        }, 3000);
      }
    }

  };

  // Function to filter codes based on user role
  const getFilteredCodes = () => {
    const allCodes = Object.keys(apiCodeConfigurations);
    if (user && user.role.toLowerCase() === 'caller') {
      return allCodes.filter(codeKey => apiCodeConfigurations[codeKey].category === 'CALLING' || apiCodeConfigurations[codeKey].category === 'BOTH');
    } if (user && user.role.toLowerCase() === 'executive') {
      return allCodes.filter(codeKey => apiCodeConfigurations[codeKey].category === 'VISIT' || apiCodeConfigurations[codeKey].category === 'BOTH');
    } 
      return allCodes;
    
  };
  const filteredCodes = getFilteredCodes(); // Get codes filtered by user role

  const orderedCodes = useMemo(() => ["PAID", "PPD", ...filteredCodes.filter(codeKey => codeKey !== "PAID" && codeKey !== "PPD").sort()], [filteredCodes]);

  useEffect(() => {
  }, [filteredCodes, orderedCodes, apiCodeConfigurations]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Feedback</DialogTitle>
      {submitLoading ? (
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </DialogContent>
      ) : (
        <Paper>
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
                    {
                      loading ? (
                        <Paper sx={{ justifyContent: 'center', display: 'flex' }}>
                          <CircularProgress size={24} />
                        </Paper>
                      ) : (
                        orderedCodes.map((codeKey) => {
                          const codeConfig = apiCodeConfigurations[codeKey];
                          let itemStyle = {};
                          // Apply different colors for admin to categorize codes visually
                          if (user && user.role.toLowerCase() === 'admin') {
                            itemStyle = codeConfig?.category === 'CALLING' ? { color: 'purple' } : (codeConfig.category === 'VISIT' ? { color: 'darkgreen' } : { color: 'black' }); // Color CALLING purple, VISIT green, BOTH black
                          }
                          return (
                            <MenuItem key={codeKey} value={codeKey} sx={itemStyle}>
                              {`${codeKey}`}&nbsp;<small>{`(${codeConfig?.description})`}</small>
                            </MenuItem>
                          );
                        })
                      )
                    }
                  </Select>
                </FormControl>
              </Grid>

              {/* SubCode Dropdown (Conditional rendering based on code config) */}
              {code && apiCodeConfigurations[code]?.useSubCode && (
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
                      {apiCodeConfigurations[code].subCodeOptions &&
                        Object.keys(apiCodeConfigurations[code].subCodeOptions).map((sub) => (
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
                const isAmountField = ["amount", "Emi Amount", "BCC Amount", "Total Amount", "Settlement Amount", "Paid Amount"].includes(field);
                const isDateField = ["ptp_date", "settlement_date", "next_payment_date"].includes(field);

                return (
                  <React.Fragment key={field}>
                    <Grid item xs={12} >
                      {/* Use TextareaAutosize for 'Remarks' and similar fields */}
                      {(field === "Remarks") ? (
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
                          label={field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                          value={fieldValues[field] || ""}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          type={isAmountField ? "number" : isDateField ? "date" : "text"} // Set input type based on field type
                          inputProps={isAmountField ? { step: "0.10" } : {}} // Allow decimal input for amount fields
                          InputLabelProps={isDateField ? { shrink: true } : {}} // Ensure DatePicker label doesn't overlap
                          error={!!fieldErrors[field]}
                          helperText={fieldErrors[field]?.[0]}
                        />
                      )}
                    </Grid>
                  </React.Fragment>
                )
              })}

              {/* Resolution Dropdown - Conditionally rendered for PAID code */}
              {code === "PAID" && (
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    error={!!fieldErrors.resolution}
                  >
                    <InputLabel>Resolution</InputLabel>
                    <Select
                      value={fieldValues.resolution || ""}
                      onChange={(e) => handleFieldChange("resolution", e.target.value)}
                    >
                      {/* Render Resolution options */}
                      {resolutionOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {`${option.label  } (${  option.value  })`}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{fieldErrors.resolution?.[0]}</FormHelperText>
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
        </Paper>
      )}
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
    </Dialog>
  );
};

export default FeedbackDialog;