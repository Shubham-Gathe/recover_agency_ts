import React, { useState, useEffect, useRef } from 'react';
import * as WebDataRocksReact from "@webdatarocks/react-webdatarocks";
import WebDataRocks from 'webdatarocks';
import api from 'src/utils/api';
import { Box, Button, Card, Typography } from '@mui/material';
import LoadingScreen from 'src/components/ui/LoadingScreen';
import AutorenewIcon from '@mui/icons-material/Autorenew';

interface PivotResult {
  rowKey: string;
  children?: PivotResult[];
  columns: Record<string, Record<string, number>>;
  rowTotals: Record<string, number>;
}

type DataRecord = {
  segment: string;
  pool: string;
  branch: string;
  agreement_id: string;
  customer_name: string;
  pro: string;
  bkt: string;
  fos_name: string;
  fos_mobile_no: string;
  caller_name: string;
  caller_mo_number: string;
  f_code: string;
  ptp_date: string;
  feedback: string;
  res: string;
  emi_coll: string;
  cbc_coll: string;
  total_coll: string;
  fos_id: string;
  mobile: string;
  address: string;
  zipcode: string;
  phone1: string;
  phone2: string;
  loan_amt: string;
  pos: string;
  emi_amt: string;
  emi_od_amt: string;
  bcc_pending: string;
  penal_pending: string;
  cycle: string;
  tenure: string;
  disb_date: string;
  emi_start_date: string;
  emi_end_date: string;
  manufacturer_desc: string;
  asset_cat: string;
  supplier: string;
  system_bounce_reason: string;
  reference1_name: string;
  reference2_name: string;
  so_name: string;
  ro_name: string;
  all_dt: string;
};

interface PivotConfig {
  filters: { field: keyof DataRecord; value: any }[];
  rows: (keyof DataRecord)[];
  columns: (keyof DataRecord)[];
  values: { field: keyof DataRecord; aggregator: 'sum' | 'count' }[];
}

const pivotConfig: PivotConfig = {
  filters: [{ field: 'branch', value: 'NAGPUR' }],
  rows: ['fos_name', 'segment'],
  columns: ['cycle'],
  values: [{ field: 'pos', aggregator: 'sum' }, { field: 'pos', aggregator: 'count' }],
};

const PivotTable: React.FC = () => {
  const [tableData, setTableData] = useState<DataRecord[]>([]);
  const pivotContainerRef = useRef(null);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const renderPivotTable = () => {
    const container = pivotContainerRef.current;
    // const container = document.getElementById('pivot-table-container');
    if (container && !refresh) {
      console.log('tableData', tableData);
      new WebDataRocks({
        container: container,
        report: {
          dataSource: {
            data: tableData,
          },
          slice: {
            rows: pivotConfig.rows.map(row => ({ uniqueName: row })),
            columns: pivotConfig.columns.map(col => ({ uniqueName: col })),
            measures: pivotConfig.values.map(val => ({
              uniqueName: val.field,
              aggregation: val.aggregator,
            })),
          }
        },
      });
    } else {
      alert('Pivot table container missing');
    }
  }

  const getAllocationData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/allocation_drafts', {
        params: { data_type: 'pivot'},
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const { data, metadata } = response.data;
      setRefresh(false);
      setTableData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if(refresh) {
      getAllocationData();
    }
  }, [refresh]);

  useEffect(() => {
    if (tableData.length > 0 && !refresh) {
      renderPivotTable();
    }
  }, [tableData]);

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3} sx={{ gap: 2 }}>
          <Typography variant="h4" flexGrow={1}>
            Pivot Table
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setRefresh(true)}
            startIcon={<AutorenewIcon />}
          >
              Refresh Data
          </Button>
        </Box>
        <Card sx={{ p: 2, overflow: 'auto', minHeight: '80vh' }}>
          <LoadingScreen open={loading} />
          <div id="pivot-table-container" ref={pivotContainerRef}></div>
        </Card>
      </Box>
    </>
  );
};

export default PivotTable;