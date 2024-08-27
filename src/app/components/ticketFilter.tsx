"use client";
import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import LotteryTicket from '../classes/lotteryTicket';

interface TicketFilterProps {
  id: string;
  label: string;
  tickets: LotteryTicket[];
  setInputValue: (value: string) => void;
  inputValue: string;
  getOptionLabel: (ticket: LotteryTicket) => string | number | string[];
}

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
      className="flex-1 mt-small"
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
