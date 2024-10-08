"use client";
import { Autocomplete, TextField } from '@mui/material';

import { TicketFilterProps } from '../interfaces/interfaces';

export default function TicketFilter({
  id,
  label,
  tickets,
  setInputValue,
  inputValue,
  getOptionLabel,
}: TicketFilterProps) {

  return (
    <Autocomplete
      className="flex-1 mt-small w-1/3"
      id={id}
      freeSolo
      options={tickets.map(getOptionLabel)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#1e293b',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1e293b',
              },
            },
            '& .MuiInputLabel-root': {
            color: 'inherit', // Use inherit to keep the default label color
            '&.Mui-focused': {
              color: 'inherit', // Change label color to red when focused
            },
          },
          }}
        />
      )}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
    />

  );
}
