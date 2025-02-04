import React from 'react';

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
const Allocation: React.FC<AllocationProps> = ({ row}) => {
  console.log("row > ", row);
  return (
    // TODO - Need to group all fields by category
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '20px' }}>
            <h2>Case Details</h2>
            <div>
                <p><strong>ID:</strong> {row.id}</p>
                <p><strong>Segment:</strong> {row.segment}</p>
                <p><strong>Pool:</strong> {row.pool}</p>
                <p><strong>Branch:</strong> {row.branch}</p>
                <p><strong>Agreement ID:</strong> {row.agreement_id}</p>
                <p><strong>Customer Name:</strong> {row.customer_name}</p>
                <p><strong>PRO:</strong> {row.pro}</p>
                <p><strong>BKT:</strong> {row.bkt}</p>
                <p><strong>FOS Name:</strong> {row.fos_name}</p>
                <p><strong>FOS Mobile No:</strong> {row.fos_mobile_no || 'N/A'}</p>
                <p><strong>Caller Name:</strong> {row.caller_name}</p>
                <p><strong>Caller Mobile No:</strong> {row.caller_mo_number || 'N/A'}</p>
                <p><strong>F Code:</strong> {row.f_code || 'N/A'}</p>
                <p><strong>PTP Date:</strong> {row.ptp_date || 'N/A'}</p>
                <p><strong>Feedback:</strong> {row.feedback || 'N/A'}</p>
                <p><strong>Resolution:</strong> {row.res}</p>
                <p><strong>EMI Collection:</strong> {row.emi_coll}</p>
                <p><strong>CBC Collection:</strong> {row.cbc_coll}</p>
                <p><strong>Total Collection:</strong> {row.total_coll}</p>
                <p><strong>FOS ID:</strong> {row.fos_id || 'N/A'}</p>
                <p><strong>Mobile:</strong> {row.mobile}</p>
                <p><strong>Address:</strong> {row.address}</p>
                <p><strong>Zipcode:</strong> {row.zipcode}</p>
                <p><strong>Phone 1:</strong> {row.phone1 || 'N/A'}</p>
                <p><strong>Phone 2:</strong> {row.phone2 || 'N/A'}</p>
                <p><strong>Loan Amount:</strong> {row.loan_amt}</p>
                <p><strong>POS:</strong> {row.pos}</p>
                <p><strong>EMI Amount:</strong> {row.emi_amt}</p>
                <p><strong>EMI OD Amount:</strong> {row.emi_od_amt}</p>
                <p><strong>BCC Pending:</strong> {row.bcc_pending}</p>
                <p><strong>Penal Pending:</strong> {row.penal_pending}</p>
                <p><strong>Cycle:</strong> {row.cycle}</p>
                <p><strong>Tenure:</strong> {row.tenure}</p>
                <p><strong>Disbursement Date:</strong> {row.disb_date || 'N/A'}</p>
                <p><strong>EMI Start Date:</strong> {row.emi_start_date || 'N/A'}</p>
                <p><strong>EMI End Date:</strong> {row.emi_end_date || 'N/A'}</p>
                <p><strong>Manufacturer:</strong> {row.manufacturer_desc}</p>
                <p><strong>Asset Category:</strong> {row.asset_cat}</p>
                <p><strong>Supplier:</strong> {row.supplier}</p>
                <p><strong>System Bounce Reason:</strong> {row.system_bounce_reason}</p>
                <p><strong>Reference 1:</strong> {row.reference1_name}</p>
                <p><strong>Reference 2:</strong> {row.reference2_name}</p>
                <p><strong>SO Name:</strong> {row.so_name}</p>
                <p><strong>RO Name:</strong> {row.ro_name}</p>
                <p><strong>All Date:</strong> {row.all_dt}</p>
                <p><strong>Created At:</strong> {row.created_at}</p>
                <p><strong>Updated At:</strong> {row.updated_at}</p>
                <p><strong>Caller ID:</strong> {row.caller_id}</p>
                <p><strong>Executive ID:</strong> {row.executive_id || 'N/A'}</p>
            </div>
        </div>
    );
};

export default Allocation;