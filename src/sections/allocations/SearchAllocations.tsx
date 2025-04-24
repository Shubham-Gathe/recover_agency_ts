import React, { useState } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  Button,
  Popover,
  TextField,
  Typography,
  FormControl,
  CircularProgress,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

interface SearchAllocationsProps {
  onSearch: (query: string, fields: string[]) => void;
  onReset: () => void;
}

const SearchAllocations: React.FC<SearchAllocationsProps> = ({ onSearch, onReset }) => {
  const [query, setQuery] = useState<string>('');
  const [fields, setFields] = useState<string[]>(['customer_name']);
  const [loading, setLoading] = useState<boolean>(false);

  const storedColumns = localStorage.getItem("searchable_columns");
  let fieldOptions = [];
  
  if (storedColumns) {
    try {
      fieldOptions = JSON.parse(storedColumns); // Parse the string back into an array
    } catch (error) {
      console.error("Error parsing stored columns:", error);
    }
  }

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true);
      try {
        onSearch(query, fields);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      onSearch('', []);
    }
  };

  const handleReset = () => {
    setQuery('');
    setFields(['customer_name']);
    onReset();
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
        sx={{}}
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
              <Autocomplete
                multiple
                options={Array.isArray(fieldOptions) ? fieldOptions : []}
                value={fields}
                onChange={(event, newValue) => setFields(newValue)}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Fields to search" />
                )}
              />
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
              color="primary"
              onClick={handleReset}
              disabled={loading}
              sx={{ mt: 2, ml: 1 }}
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