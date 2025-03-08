import React from 'react';
import { Card, CardContent, Grid, Typography, CardHeader, Avatar } from '@mui/material';
import { AccountBalance, Person, Payment, SupervisorAccount, LocationOn, Business } from '@mui/icons-material';

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

interface AllocationProps {
  row: RowData;
}

const sectionStyles = [
  { title: 'Loan Agreement & Terms', color: '#00ACC1', icon: <AccountBalance />, fields: ['agreement_id', 'loan_amt', 'tenure', 'emi_amt', 'emi_od_amt', 'disb_date', 'emi_start_date', 'emi_end_date', 'pos'] },
  { title: 'Collection & Payment History', color: '#D81B60', icon: <Payment />, fields: ['emi_coll', 'cbc_coll', 'total_coll', 'bcc_pending', 'penal_pending', 'ptp_date', 'feedback', 'res'] },
  { title: 'Borrower & Contact Information', color: '#1E88E5', icon: <Person />, fields: ['customer_name', 'mobile', 'address', 'zipcode', 'phone1', 'phone2', 'reference1_name', 'reference2_name'] },
  { title: 'Asset & Collateral Details', color: '#8E24AA', icon: <Business />, fields: ['manufacturer_desc', 'asset_cat', 'supplier','branch', 'pool', 'segment', 'cycle'] },
  { title: 'Officer & Agent Details', color: '#F57C00', icon: <SupervisorAccount />, fields: ['fos_name', 'fos_mobile_no', 'caller_name', 'caller_mo_number', 'so_name', 'ro_name'] },
  { title: 'Operational & Routing Information', color: '#43A047', icon: <LocationOn />, fields: [] },
];

const Allocation: React.FC<AllocationProps> = ({ row }) => {
  return (
    <Grid container spacing={3} style={{ padding: '20px' }}>
      {sectionStyles.map(({ title, color, icon, fields }, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Card style={{ backgroundColor: '#f9f9f9', padding: '15px' }}>
            <CardHeader
              avatar={<Avatar style={{ backgroundColor: color }}>{icon}</Avatar>}
              title={title}
              titleTypographyProps={{ style: { color, fontWeight: 'bold', fontSize: '1.2rem' } }}
            />
            <CardContent>
              {fields.map((field) => (
                <Typography key={field} variant="body2" gutterBottom style={{ fontSize: '0.9rem' }}>
                  <strong>{field.replace(/_/g, ' ')}:</strong> {row[field as keyof RowData] || 'N/A'}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Allocation;