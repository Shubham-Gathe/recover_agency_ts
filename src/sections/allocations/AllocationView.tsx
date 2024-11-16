import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
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

const AllocationView = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<{ [key: string]: string | null }>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleFilterChange = (field: string, value: string | null) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams(filters as Record<string, string>);
                const response = await fetch(`/api/data?${queryParams}`);
                const data = await response.json();
                setRows(data.rows);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filters]);

    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "name", headerName: "Name", width: 200 },
        { field: "email", headerName: "Email", width: 250 },
    ];

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
                                loading={loading}
                                autoHeight
                                disableSelectionOnClick
                                pagination
                                pageSize={rowsPerPage}
                                rowsPerPageOptions={[5, 10, 25]}
                                onPageChange={handleChangePage}
                                onPageSizeChange={handleChangeRowsPerPage}
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

                <TablePagination
                    component="div"
                    page={page}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Box>
    );
};

export default AllocationView;
