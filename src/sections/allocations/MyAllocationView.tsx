// import { useQueryClient } from 'react-query';
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Typography,
  TableContainer,
  Button,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import FloatingPanel from "./FloatingPanel";
import api from "src/utils/api";
import ExportAllocation from "./ExportAllocation";
import Allocation from "./Allocation";
import { Iconify } from "src/components/iconify";
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

const MyAllocationView = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string | null }>({});
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const defaultColumns: GridColDef[] = [
    // { field: "serialNumber", headerName: "Sr.No", width: 90 },
    { field: "id", headerName: "ID", width: 90 },
    { field: "customer_name", headerName: "Customer Name", width: 200 },
    { field: "segment", headerName: "Segment", width: 150 },
    { field: "pool", headerName: "Pool", width: 150, editable: true },
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
  // Initializing column visibility state
  const storedVisibility = JSON.parse(localStorage.getItem('columnVisibility') || '{}');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    storedVisibility || defaultColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
  );
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.filter((col) => columnVisibility[col.field] !== false) // Initially, filter visible columns based on columnVisibility
  );
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  useEffect(() => {
    // Update visible columns whenever columnVisibility changes
    const updatedVisibleColumns = defaultColumns.filter((col) => columnVisibility[col.field] !== false);
    setVisibleColumns(updatedVisibleColumns);
  }, [columnVisibility]);

  useEffect(() => {
    // Save column visibility preferences to localStorage whenever columnVisibility changes
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Handler to update column visibility and state
  const handleColumnVisibilityChange = (field: string, isVisible: boolean) => {
    setColumnVisibility((prev) => {
      const updatedVisibility = { ...prev, [field]: isVisible };
      return updatedVisibility;
    });
  };
  const handleShowDetails = (params: GridRowParams) => {
    setSelectedRow(params.row); // Show detailed allocation view
  };

  const handleBackToTable = () => {
    setSelectedRow(null); // Reset selected row to show the table again
  };

  const fetchPage = async () => {
    try {
      const response = await api.get(`/dashboards/get_allocations`, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        params: {
          page: paginationModel.page + 1, // API is 1-indexed
          per_page: paginationModel.pageSize,
        },
      });

      const { data, metadata, message } = response.data; // Assuming response includes data and metadata
      setTotalRows(metadata.total);
      setRows(data); // Set the data to be displayed in the DataGrid
      // Set total number of rows for pagination
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [filters, paginationModel]);
  return (
    <>
      {/* Column Visibility Panel */}
      <FloatingPanel
        // @ts-expect-error
        defaultColumns={defaultColumns}
        // @ts-expect-error
        visibleColumns={visibleColumns}
        onChange={handleColumnVisibilityChange}
      />
      <Box sx={{ p: 1 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" flexGrow={1}>
            My Allocations
          </Typography>
          <ExportAllocation />
        </Box>
      </Box>
      {selectedRow ? (
        // Show Allocation component when a row is selected
        <Card sx={{ p: 2 }}>
          <Button
            onClick={handleBackToTable}
            variant="outlined"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ mb: 2 }}
          >
            Back to Allocations
          </Button>
          <Allocation row={selectedRow} />
        </Card>
      ) : (
        <Box sx={{ p: 3 }}>
          <Card sx={{ p: 2 }}>
            <Scrollbar>
              <TableContainer>
                {loading ? (
                  <Typography align="center">Loading...</Typography>
                ) : (
                  <DataGrid
                    rows={rows}
                    columns={visibleColumns}
                    loading={loading} // Managed in state
                    rowCount={totalRows} // Total rows from the API
                    pagination
                    pageSizeOptions={[5]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={setPaginationModel}
                    onRowClick={handleShowDetails}
                    sx={{
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                      },
                      '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #e0e0e0',
                      },
                    }}
                    slotProps={{
                      loadingOverlay: {
                        variant: 'skeleton',
                        noRowsVariant: 'skeleton',
                      },
                    }}
                    initialState={{
                      // pinnedColumns: {
                      //   left: ['desk'],
                      // },
                    }}
                  />
                )}
              </TableContainer>
            </Scrollbar>
          </Card>
        </Box>
      )}
    </>
  );
};

export default MyAllocationView;
