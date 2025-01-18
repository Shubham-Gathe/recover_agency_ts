import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import {
    Box,
    Card,
    Button,
    Typography,
    TextField,
    TableContainer,
    TablePagination,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import axios from "axios";
import { RootState, AppDispatch } from 'src/store/store'; // Adjust the import path
import { useDispatch, useSelector } from "react-redux";
import process from "process";

const AllocationView = () => {
    const apiUrl = 'http://localhost:3001'

  
    console.log("API URL:", apiUrl);

    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector((state: RootState) => state.auth.token);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: string | null }>({});
    const [totalRows, setTotalRows] = useState(0);
    const [page, setPage] = useState(0); // Current page

    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: 10,
      });

    const handleFilterChange = (field: string, value: string | null) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };
    console.log(rows);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const fetchPage = async () => {
        try {
          const response = await axios.get(`${apiUrl}/allocation_drafts`, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
            },
            params: {
              page: paginationModel.page + 1, // API is 1-indexed
              per_page: paginationModel.pageSize,
            },
          });
    
          const { data, metadata } = response.data; // Assuming response includes data and metadata
          setTotalRows(metadata.total);
          console.log('data', data);
          console.log('metadata', metadata);
          setRows(data); // Set the data to be displayed in the DataGrid
           // Set total number of rows for pagination
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "customer_name", headerName: "Customer Name", width: 200 },
        { field: "segment", headerName: "Segment", width: 150 },
        { field: "pool", headerName: "Pool", width: 150 },
        { field: "branch", headerName: "Branch", width: 150 },
        { field: "agreement_id", headerName: "Agreement ID", width: 150 },
        { field: "pro", headerName: "Pro", width: 100 },
        { field: "bkt", headerName: "BKT", width: 100 },
        { field: "fos_name", headerName: "FOS Name", width: 200 },
        { field: "fos_mobile_no", headerName: "FOS Mobile Number", width: 200 },
        { field: "caller_name", headerName: "Caller Name", width: 200 },
        { field: "caller_mo_number", headerName: "Caller Mobile Number", width: 200 },
        { field: "f_code", headerName: "F Code", width: 150 },
        { field: "ptp_date", headerName: "PTP Date", width: 150 },
        { field: "feedback", headerName: "Feedback", width: 200 },
        { field: "res", headerName: "Resolution", width: 150 },
        { field: "emi_coll", headerName: "EMI Collection", width: 150 },
        { field: "cbc_coll", headerName: "CBC Collection", width: 150 },
        { field: "total_coll", headerName: "Total Collection", width: 150 },
        { field: "fos_id", headerName: "FOS ID", width: 150 },
        { field: "mobile", headerName: "Mobile Number", width: 200 },
        { field: "address", headerName: "Address", width: 300 },
        { field: "zipcode", headerName: "Zip Code", width: 150 },
        { field: "phone1", headerName: "Phone 1", width: 150 },
        { field: "phone2", headerName: "Phone 2", width: 150 },
        { field: "loan_amt", headerName: "Loan Amount", width: 150 },
        { field: "pos", headerName: "POS", width: 150 },
        { field: "emi_amt", headerName: "EMI Amount", width: 150 },
        { field: "emi_od_amt", headerName: "EMI OD Amount", width: 150 },
        { field: "bcc_pending", headerName: "BCC Pending", width: 150 },
        { field: "penal_pending", headerName: "Penal Pending", width: 150 },
        { field: "cycle", headerName: "Cycle", width: 150 },
        { field: "tenure", headerName: "Tenure", width: 150 },
        { field: "disb_date", headerName: "Disbursal Date", width: 150 },
        { field: "emi_start_date", headerName: "EMI Start Date", width: 150 },
        { field: "emi_end_date", headerName: "EMI End Date", width: 150 },
        { field: "manufacturer_desc", headerName: "Manufacturer Description", width: 250 },
        { field: "asset_cat", headerName: "Asset Category", width: 200 },
        { field: "supplier", headerName: "Supplier", width: 250 },
        { field: "system_bounce_reason", headerName: "System Bounce Reason", width: 250 },
        { field: "reference1_name", headerName: "Reference 1 Name", width: 250 },
        { field: "reference2_name", headerName: "Reference 2 Name", width: 250 },
        { field: "so_name", headerName: "SO Name", width: 200 },
        { field: "ro_name", headerName: "RO Name", width: 200 },
        { field: "all_dt", headerName: "Allocation Date", width: 150 },
        { field: "created_at", headerName: "Created At", width: 200 },
        { field: "updated_at", headerName: "Updated At", width: 200 },
        { field: "caller_id", headerName: "Caller ID", width: 150 },
        { field: "executive_id", headerName: "Executive ID", width: 150 },
    ];    

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(filters as Record<string, string>);
                const response = await fetch(`/api/data?${queryParams}`);
                
                // setRows(data.data); 
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        // fetchData();
        fetchPage();
    }, [filters, paginationModel]);
    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
                <Typography variant="h4" flexGrow={1}>
                    Allocations
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    New Allocation
                </Button>
            </Box>

            <Card sx={{ p: 2 }}>
                {/* Filter Section */}
                <Box display="flex" gap={2} mb={3}>
                    <TextField
                        label="Filter by Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={(e) => handleFilterChange("name", e.target.value)}
                    />
                    <TextField
                        label="Filter by Email"
                        variant="outlined"
                        size="small"
                        fullWidth
                        onChange={(e) => handleFilterChange("email", e.target.value)}
                    />
                </Box>

                <Scrollbar>
                    <TableContainer>
                        {loading ? (
                            <Typography align="center">Loading...</Typography>
                        ) : (
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                loading={loading} // Managed in state
                                rowCount={totalRows} // Total rows from the API
                                pagination
                                pageSizeOptions={[5]}
                                paginationModel={paginationModel}
                                paginationMode="server"
                                onPaginationModelChange={setPaginationModel}
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#f5f5f5',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #e0e0e0',
                                    },
                                }}
                            />
                        )}
                    </TableContainer>
                </Scrollbar>
            </Card>
        </Box>
    );
};

export default AllocationView;
