// import { useQueryClient } from 'react-query';
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
import AssignDialog from './AssignDialog';

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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [RowSelectionModel,setRowSelectionModel] = useState();
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

    const mySaveOnServerFunction = async(updatedRow: any, originalRow: any) => {
        console.log('updatedRow', updatedRow);
        try {
            const response = await axios.put(`${apiUrl}/allocation_drafts/${updatedRow.id}`, {
                data: updatedRow
            },
            {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                }

            }).then ((response) => {
                console.log('response------------------', response);
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    const handleProcessRowUpdateError = () => {
        console.log('-----------handleProcessRowUpdateError-----------');
    }
    const rowsWithSerialNumbers = rows.map((row, index) => ({
        ...row,
        serialNumber: index + 1, // Add serial number (1-based index)
    }));
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);
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
        { field: "serialNumber", headerName: "Sr.No", width: 90 },
        { field: "id", headerName: "ID", width: 90},
        { field: "customer_name", headerName: "Customer Name", width: 200, editable: true  },
        { field: "segment", headerName: "Segment", width: 150, editable: true  },
        { field: "pool", headerName: "Pool", width: 150, editable: true },
        { field: "branch", headerName: "Branch", width: 150, editable: true  },
        { field: "agreement_id", headerName: "Agreement ID", width: 150, editable: true  },
        { field: "pro", headerName: "Pro", width: 100, editable: true  },
        { field: "bkt", headerName: "BKT", width: 100, editable: true  },
        { field: "fos_name", headerName: "FOS Name", width: 200, editable: true  },
        { field: "fos_mobile_no", headerName: "FOS Mobile Number", width: 200, editable: true  },
        { field: "caller_name", headerName: "Caller Name", width: 200, editable: true  },
        { field: "caller_mo_number", headerName: "Caller Mobile Number", width: 200, editable: true  },
        { field: "f_code", headerName: "F Code", width: 150, editable: true  },
        { field: "ptp_date", headerName: "PTP Date", width: 150, editable: true  },
        { field: "feedback", headerName: "Feedback", width: 200, editable: true  },
        { field: "res", headerName: "Resolution", width: 150, editable: true  },
        { field: "emi_coll", headerName: "EMI Collection", width: 150, editable: true  },
        { field: "cbc_coll", headerName: "CBC Collection", width: 150, editable: true  },
        { field: "total_coll", headerName: "Total Collection", width: 150, editable: true  },
        { field: "fos_id", headerName: "FOS ID", width: 150, editable: true  },
        { field: "mobile", headerName: "Mobile Number", width: 200, editable: true  },
        { field: "address", headerName: "Address", width: 300, editable: true  },
        { field: "zipcode", headerName: "Zip Code", width: 150, editable: true  },
        { field: "phone1", headerName: "Phone 1", width: 150, editable: true  },
        { field: "phone2", headerName: "Phone 2", width: 150, editable: true  },
        { field: "loan_amt", headerName: "Loan Amount", width: 150, editable: true  },
        { field: "pos", headerName: "POS", width: 150, editable: true  },
        { field: "emi_amt", headerName: "EMI Amount", width: 150, editable: true  },
        { field: "emi_od_amt", headerName: "EMI OD Amount", width: 150, editable: true  },
        { field: "bcc_pending", headerName: "BCC Pending", width: 150, editable: true  },
        { field: "penal_pending", headerName: "Penal Pending", width: 150, editable: true  },
        { field: "cycle", headerName: "Cycle", width: 150, editable: true  },
        { field: "tenure", headerName: "Tenure", width: 150, editable: true  },
        { field: "disb_date", headerName: "Disbursal Date", width: 150, editable: true  },
        { field: "emi_start_date", headerName: "EMI Start Date", width: 150, editable: true  },
        { field: "emi_end_date", headerName: "EMI End Date", width: 150, editable: true  },
        { field: "manufacturer_desc", headerName: "Manufacturer Description", width: 250, editable: true  },
        { field: "asset_cat", headerName: "Asset Category", width: 200, editable: true  },
        { field: "supplier", headerName: "Supplier", width: 250, editable: true  },
        { field: "system_bounce_reason", headerName: "System Bounce Reason", width: 250, editable: true  },
        { field: "reference1_name", headerName: "Reference 1 Name", width: 250, editable: true  },
        { field: "reference2_name", headerName: "Reference 2 Name", width: 250, editable: true  },
        { field: "so_name", headerName: "SO Name", width: 200, editable: true  },
        { field: "ro_name", headerName: "RO Name", width: 200, editable: true  },
        { field: "all_dt", headerName: "Allocation Date", width: 150, editable: true  },
        { field: "created_at", headerName: "Created At", width: 200, editable: true  },
        { field: "updated_at", headerName: "Updated At", width: 200, editable: true  },
        { field: "caller_id", headerName: "Caller ID", width: 150, editable: true  },
        { field: "executive_id", headerName: "Executive ID", width: 150, editable: true  },
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
                <AssignDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    selectedRows={RowSelectionModel}
                    apiUrl={apiUrl}
                />
                <Button
                    onClick={handleOpenDialog}
                    variant="contained"
                    color="primary"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                    Assign
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
                                rows={rowsWithSerialNumbers}
                                columns={columns}
                                loading={loading} // Managed in state
                                rowCount={totalRows} // Total rows from the API
                                pagination
                                pageSizeOptions={[5]}
                                paginationModel={paginationModel}
                                paginationMode="server"
                                onPaginationModelChange={setPaginationModel}
                                editMode="row"
                                processRowUpdate={(updatedRow, originalRow) =>
                                    mySaveOnServerFunction(updatedRow, originalRow)
                                  }
                                onProcessRowUpdateError={handleProcessRowUpdateError}
                                checkboxSelection
                                onRowSelectionModelChange={(newRowSelectionModel) => {
                                    console.log('newRowSelectionModel',newRowSelectionModel);

                                    setRowSelectionModel(newRowSelectionModel);
                                }}
                                // rowSelectionModel={
                                //     rowSelectionModel
                                // }
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
