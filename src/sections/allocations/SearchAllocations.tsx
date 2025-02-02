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
} from '@mui/material';

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

    return (
        <div>
            <h1>Search Allocations</h1>
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
        </div>
    );
};

export default SearchAllocations;