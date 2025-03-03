import React, { useState, useCallback } from 'react';
import { debounce } from 'src/utils/debounce';
import api from 'src/utils/api';
import {
  TextField,
  FormControl,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Popover,
  Typography,
  Box,
  Card,
} from '@mui/material';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import SearchIcon from '@mui/icons-material/Search';
interface SearchAllocationsProps {
  onSearch: (query: string, fields: string[]) => void;
  onReset: () => void;
}
const SearchAllocations: React.FC<SearchAllocationsProps> = ({ onSearch, onReset }) => {
  const [query, setQuery] = useState<string>('');
  const [fields, setFields] = useState<string[]>(['name']);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllocations = async (query: string, fields: string[]) => {
    try {
      const params = {
        q: {
          groupings: fields.map((field) => ({ [field + '_cont']: query })),
        },
      };
      const response = await api.get(`/dashboards/get_allocations`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching allocations:', error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      try {
        onSearch(query, fields); // Pass search parameters instead of results
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      onSearch('', []); // Clear search
    }
  };

  const handleReset = () => {
    setQuery(''); // Clear local query state
    setFields(['customer_name']); // Reset fields to default
    onReset(); // Notify parent to reset table
  };


  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    if (fields.includes(field)) {
      setFields(fields.filter((f) => f !== field));
    } else {
      setFields([...fields, field]);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const search_id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Button
        aria-describedby={search_id}
        variant="contained"
        onClick={handleClick}
        startIcon={<SearchIcon />}
        sx={{ }}
      >
        Find
      </Button>

      <Popover
        id={search_id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        
        <Card variant="outlined" sx={{ maxWidth: 360 }}>
          <Box sx={{ p: 2 }}>
            <Typography>Search Allocations</Typography>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                    checked={fields.includes('customer_name')}
                    onChange={handleFieldChange}
                    name="customer_name"
                    />
                  }
                  label="customer_name"
                  />
                <FormControlLabel
                  control={
                    <Checkbox
                    checked={fields.includes('fos_name')}
                    onChange={handleFieldChange}
                    name="fos_name"
                    />
                  }
                  label="fos_name"
                  />
                <FormControlLabel
                  control={
                    <Checkbox
                    checked={fields.includes('caller_name')}
                    onChange={handleFieldChange}
                    name="caller_name"
                    />
                  }
                  label="caller_name"
                  />
              </FormGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Search allocations..."
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              margin="normal"
              />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={loading}
              sx={{ mt: 2 }}
              >
              Search
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              disabled={loading}
              sx={{ mt: 2 }}
              >
              Reset
            </Button>
            {loading && <CircularProgress />}
          </Box>
        </Card>
      </Popover>
    </>
  );
};

export default SearchAllocations;