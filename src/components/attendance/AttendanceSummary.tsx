import type { Theme } from '@mui/material';

import React from 'react';

import { Box, styled, Typography } from '@mui/material';

interface SummaryData {
  [key: string]: number | string | boolean | React.ReactNode; // Allow various value types
}

interface AttendanceSummaryProps {
  totalText: string;
  data: SummaryData;
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const BorderedBox = styled(Box)(({ theme }: { theme: Theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  position: 'relative',
}));

const LegendTypography = styled(Typography)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: `-${theme.spacing(1.5)}`,
  left: theme.spacing(2),
  padding: theme.spacing(0, 1),
  backgroundColor: theme.palette.background.paper,
}));

const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({ totalText, data }) =>
  (
    <BorderedBox>
      <LegendTypography variant="subtitle1">{totalText}</LegendTypography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: theme => theme.spacing(1) }}>
        {Object.entries(data).map(([key, value]) => (
          <Typography variant='body1' key={key}>
            {key} = {String(value)}
          </Typography>
        ))}
      </Box>
    </BorderedBox>
  );

export default AttendanceSummary;