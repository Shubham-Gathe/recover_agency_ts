import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Button,
  Typography,
  TableContainer,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import AssignDialog from './AssignDialog';
import FloatingPanel from "./FloatingPanel";
import ImportAllocation from "./ImportAllocation";
import api from "src/utils/api";
import ExportAllocation from "./ExportAllocation";
import SearchAllocations from "./SearchAllocations";
import Allocation from "./Allocation";
import { NONAME } from "dns";
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
const AllocationView = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [RowSelectionModel, setRowSelectionModel] = useState<RowData | null>(null);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFields, setSearchFields] = useState<string[]>([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  const defaultColumns: GridColDef[] = [
    // { field: "serialNumber", headerName: "Sr.No", width: 90 },
    // { field: "serialNumber", headerName: "Sr.No", width: 90 },
    { field: "id", headerName: "ID", width: 90 },
    { field: "customer_name", headerName: "Customer Name", width: 200, editable: true },
    { field: "segment", headerName: "Segment", width: 150, editable: true },
    { field: "pool", headerName: "Pool", width: 150, editable: true },
    { field: "branch", headerName: "Branch", width: 150, editable: true },
    { field: "agreement_id", headerName: "Agreement ID", width: 150, editable: true },
    { field: "pro", headerName: "Pro", width: 100, editable: true },
    { field: "bkt", headerName: "BKT", width: 100, editable: true },
    { field: "fos_name", headerName: "FOS Name", width: 200, editable: true },
    { field: "fos_mobile_no", headerName: "FOS Mobile Number", width: 200, editable: true },
    { field: "caller_name", headerName: "Caller Name", width: 200, editable: true },
    { field: "caller_mo_number", headerName: "Caller Mobile Number", width: 200, editable: true },
    { field: "f_code", headerName: "F Code", width: 150, editable: true },
    { field: "ptp_date", headerName: "PTP Date", width: 150, editable: true },
    { field: "feedback", headerName: "Feedback", width: 200, editable: true },
    { field: "res", headerName: "Resolution", width: 150, editable: true },
    { field: "emi_coll", headerName: "EMI Collection", width: 150, editable: true },
    { field: "cbc_coll", headerName: "CBC Collection", width: 150, editable: true },
    { field: "total_coll", headerName: "Total Collection", width: 150, editable: true },
    { field: "fos_id", headerName: "FOS ID", width: 150, editable: true },
    { field: "mobile", headerName: "Mobile Number", width: 200, editable: true },
    { field: "address", headerName: "Address", width: 300, editable: true },
    { field: "zipcode", headerName: "Zip Code", width: 150, editable: true },
    { field: "phone1", headerName: "Phone 1", width: 150, editable: true },
    { field: "phone2", headerName: "Phone 2", width: 150, editable: true },
    { field: "loan_amt", headerName: "Loan Amount", width: 150, editable: true },
    { field: "pos", headerName: "POS", width: 150, editable: true },
    { field: "emi_amt", headerName: "EMI Amount", width: 150, editable: true },
    { field: "emi_od_amt", headerName: "EMI OD Amount", width: 150, editable: true },
    { field: "bcc_pending", headerName: "BCC Pending", width: 150, editable: true },
    { field: "penal_pending", headerName: "Penal Pending", width: 150, editable: true },
    { field: "cycle", headerName: "Cycle", width: 150, editable: true },
    { field: "tenure", headerName: "Tenure", width: 150, editable: true },
    { field: "disb_date", headerName: "Disbursal Date", width: 150, editable: true },
    { field: "emi_start_date", headerName: "EMI Start Date", width: 150, editable: true },
    { field: "emi_end_date", headerName: "EMI End Date", width: 150, editable: true },
    { field: "manufacturer_desc", headerName: "Manufacturer Description", width: 250, editable: true },
    { field: "asset_cat", headerName: "Asset Category", width: 200, editable: true },
    { field: "supplier", headerName: "Supplier", width: 250, editable: true },
    { field: "system_bounce_reason", headerName: "System Bounce Reason", width: 250, editable: true },
    { field: "reference1_name", headerName: "Reference 1 Name", width: 250, editable: true },
    { field: "reference2_name", headerName: "Reference 2 Name", width: 250, editable: true },
    { field: "so_name", headerName: "SO Name", width: 200, editable: true },
    { field: "ro_name", headerName: "RO Name", width: 200, editable: true },
    { field: "all_dt", headerName: "Allocation Date", width: 150, editable: true },
    { field: "created_at", headerName: "Created At", width: 200, editable: true },
    { field: "updated_at", headerName: "Updated At", width: 200, editable: true },
    { field: "caller_id", headerName: "Caller ID", width: 150, editable: true },
    { field: "executive_id", headerName: "Executive ID", width: 150, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleShowDetails(params.row)}
        >
          Show
        </Button>
      ),
      // Keep column sticky on the right
      cellClassName: "stickyColumn",
    },
  ];

  const storedVisibility = JSON.parse(localStorage.getItem('columnVisibility') || '{}');
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(
    storedVisibility || defaultColumns.reduce((acc, col) => ({ ...acc, [col.field]: true }), {})
  );
  const [visibleColumns, setVisibleColumns] = useState(
    defaultColumns.filter((col) => columnVisibility[col.field] !== false)
  );

  useEffect(() => {
    const updatedVisibleColumns = defaultColumns.filter((col) => columnVisibility[col.field] !== false);
    setVisibleColumns(updatedVisibleColumns);
  }, [columnVisibility]);

  useEffect(() => {
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const handleColumnVisibilityChange = (field: string, isVisible: boolean) => {
    setColumnVisibility((prev) => {
      const updatedVisibility = { ...prev, [field]: isVisible };
      return updatedVisibility;
    });
  };

  // This code belongs to older preexisting (MUI) filters 
  // const handleFilterChange = (field: string, value: string | null) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [field]: value,
  //   }));
  // };

  const mySaveOnServerFunction = async (updatedRow: any, originalRow: any) => {
    console.log('updatedRow', updatedRow);
    try {
      const response = await api.put(`/allocation_drafts/${updatedRow.id}`, { 'data': updatedRow }, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating row:', error);
      throw error;
    }
  };

  const handleProcessRowUpdateError = () => {
    console.log('-----------handleProcessRowUpdateError-----------');
  }

  const handleShowDetails = (row: RowData) => {
    console.log('handleShowDetails', row);
    setSelectedRow(row); // Show detailed allocation view
  };

  const handleBackToTable = () => {
    setSelectedRow(null); // Reset selected row to show the table again
  };
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleImportDialog = () => setOpenImportDialog(true);
  const handleCloseImportDialog = () => setOpenImportDialog(false);

  const fetchPage = async () => {
    try {
      const params: any = {
        page: paginationModel.page + 1,
        per_page: paginationModel.pageSize,
      };

      // Add search parameters if they exist
      if (searchQuery && searchFields.length > 0) {
        params.q = {
          groupings: searchFields.map(field => ({
            [field + '_cont']: searchQuery
          }))
        };
      }

      const response = await api.get('/allocation_drafts', {
        params,
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const { data, metadata } = response.data;
      setTotalRows(metadata.total);
      setRows(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleReset = () => {
    setSearchQuery(''); // Clear search query
    setSearchFields([]); // Clear search fields
    setPaginationModel({ page: 0, pageSize: 10 }); // Reset pagination
    fetchPage(); // Fetch original data
  };

  const handleSearch = (query: string, fields: string[]) => {
    setSearchQuery(query);
    setSearchFields(fields);
    setPaginationModel(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  useEffect(() => {
    fetchPage();
  }, [paginationModel, searchQuery, searchFields]);

  return (
    <>
      <FloatingPanel
        // @ts-expect-error
        defaultColumns={defaultColumns}
        // @ts-expect-error
        visibleColumns={visibleColumns}
        onChange={handleColumnVisibilityChange}
      />

      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3} sx={{gap:2}}>
          <Typography variant="h4" flexGrow={1}>
            Allocations
          </Typography>
          <SearchAllocations
            onSearch={handleSearch}
            onReset={handleReset}
          />
          <Button
            onClick={handleImportDialog}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Import Allocation
          </Button>

          <Button
            onClick={handleOpenDialog}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Assign
          </Button>
          <ExportAllocation />
        </Box>
        {selectedRow ? (
          // Show Allocation component when a row is selected
          <Card sx={{ p: 2 }}>
            <Button 
                onClick={handleBackToTable}
                variant="outlined"
                startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                sx={{ mb: 2, borderRadius: 2  }}
            >
                Back to Allocations
            </Button>
            <Allocation row={selectedRow}/>
          </Card>
      ) : (
      // Show the DataGrid when no row is selected
          <Card sx={{ p: 2 }}>
            {/* TODO - NOTE - Following code
              - Commenting due to no use
              - May be to replace with new search on same place
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
            </Box> */}

            <Scrollbar>
              <TableContainer>
                {loading ? (
                  <Typography align="center">Loading...</Typography>
                ) : (
                  <Box sx={{ width: "100%", overflowX: "auto", position: "relative" }}>
                    <DataGrid
                      rows={rows}
                      columns={visibleColumns}
                      loading={loading}
                      rowCount={totalRows}
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
                        // @ts-expect-error
                        setRowSelectionModel(newRowSelectionModel);
                      }}
                      sx={{
                        border: 'none',
                        height: '70vh',
                        minWidth: "100%",
                        '& .MuiDataGrid-columnHeaders': {
                          // backgroundColor: '#f5f5f5',
                          fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-cell': {
                          // borderBottom: '1px solid #e0e0e0',
                        },
                        "& .stickyColumn": {
                          position: "sticky",
                          right: 0,
                          // backgroundColor: "#fff",
                          zIndex: 999,
                          borderBottom: "none",
                        },
                      }}
                      slotProps={{
                        loadingOverlay: {
                          variant: 'skeleton',
                          noRowsVariant: 'skeleton',
                        },
                      }}
                      initialState={{
                        // pinnedColumns: {  Required pro plan (-_-)
                        //   right: ['actions']
                        // },
                      }}
                    />
                  </Box>
                )}
              </TableContainer>
            </Scrollbar>
          </Card>
      )}
      </Box>
      {/* Keep dialog components at the bottom */}
      <ImportAllocation
        open={openImportDialog}
        onClose={handleCloseImportDialog}
        refreshData={fetchPage}
      />

      <AssignDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        // @ts-expect-error
        selectedRows={RowSelectionModel}
        refreshData={fetchPage}
      />
    </>
  );
};

export default AllocationView;