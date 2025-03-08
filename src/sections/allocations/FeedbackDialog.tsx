import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Bold } from "lucide-react";
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
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
  // subCodeOptions are likely missing in your API response, so we won't define them here yet
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
  const user = useSelector((state: any) => state.auth.user);
  const [apiCodeConfigurations, setApiCodeConfigurations] = useState<ApiCodeConfigurations>({});
  const [loading, setLoading] = useState<boolean>(true);

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
          const data = response.data;

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
  }, [isOpen]);
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
    const allCodes = Object.keys(apiCodeConfigurations);
    if (user && user.role.toLowerCase() === 'caller') {
      return allCodes.filter(codeKey => apiCodeConfigurations[codeKey].category === 'CALLING' || apiCodeConfigurations[codeKey].category === 'BOTH');
    } else if (user && user.role.toLowerCase() === 'executive') {
      return allCodes.filter(codeKey => apiCodeConfigurations[codeKey].category === 'VISIT' || apiCodeConfigurations[codeKey].category === 'BOTH');
    } else {
      return allCodes;
    }
  };
  const filteredCodes = getFilteredCodes(); // Get codes filtered by user role
  const orderedCodes = ["PAID", "PPD", ...filteredCodes.filter(codeKey => codeKey !== "PAID" && codeKey !== "PPD").sort()]; // Order codes: PAID, PPD first, then others alphabetically
  
    useEffect(() => {
    }, [filteredCodes, orderedCodes, apiCodeConfigurations]);
  
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Feedback</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <p>Loading feedback codes...</p>
        ) : (
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
                  { (loading)
                    ?
                      (<CircularProgress size={24} />)
                        : 
                      (
                        orderedCodes.map((codeKey) => {
                          // console.log(`apiCodeConfigurations > ${apiCodeConfigurations}`);
                          console.log('codeKey > ', codeKey);
                          const codeConfig = apiCodeConfigurations[codeKey];
                          console.log('codeConfig > ', codeConfig);
                          let itemStyle = {};
                          // Apply different colors for admin to categorize codes visually
                          if (user && user.role.toLowerCase() === 'admin') {
                            itemStyle = codeConfig?.category === 'CALLING' ? { color: 'blue' } : (codeConfig.category === 'VISIT' ? { color: 'green' } : { color: 'black' }); // Color CALLING blue, VISIT green, BOTH black
                          }
                          return (
                            <MenuItem key={codeKey} value={codeKey} sx={itemStyle}>
                              {codeKey}
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
        )}
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