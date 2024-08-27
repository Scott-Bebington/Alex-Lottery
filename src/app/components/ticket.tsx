"use client";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, CardActions, CardContent, CardMedia, Collapse, IconButton, Typography } from "@mui/material";
import React from 'react';

import LotteryTicket from '../classes/lotteryTicket';

interface TicketProps {
  ticket: LotteryTicket;
  expandedState: { [key: number]: boolean };
  handleExpandClick: (ticketNumber: number) => void;
  ticketsAddedToCart: number;
  incrementTickets: () => void;
  decrementTickets: () => void;
  addTicketsToCart: () => void;

}

export default function Ticket(
  {
    ticket,
    expandedState,
    handleExpandClick,
    ticketsAddedToCart,
    incrementTickets,
    decrementTickets,
    addTicketsToCart
  }: TicketProps
) {
  return (
    <div
      className='bg-white rounded shadow-sm'
      key={ticket.number}
    >
      <CardMedia
        component="img"
        height="140"
        image={ticket.image}
        alt="Lottery ticket image"
        className='rounded'
      />
      <CardContent>
        <section className='flex items-center justify-between'>
          <Typography variant="subtitle2" className='text-gray-400'>
            {ticket.date}
          </Typography>
          <Typography variant="subtitle2" className='text-gray-400'>
            {ticket.quantity} Left
          </Typography>
        </section>

        <section className='flex items-center justify-between'>
          <Typography variant="h4">
            {ticket.number}
          </Typography>
          <CardActions disableSpacing>
            {!expandedState[ticket.number] && (
              <div
                className="cursor-pointer border-solid border-2 border-slate-800 rounded px-small py-[2px]"
                onClick={() => handleExpandClick(ticket.number)}
              >
                {expandedState[ticket.number] ? "Close" : "Expand"}
              </div>
            )}
          </CardActions>
        </section>

        <Collapse in={expandedState[ticket.number]} timeout="auto" unmountOnExit>

          <section className='flex items-center justify-between'>
            <Typography variant="h5" className='text-slate-800'>
              $ {ticket.cost.toFixed(2)}
            </Typography>
            <div className='flex gap-4'>
              <IconButton
                aria-label="remove"
                onClick={() => decrementTickets()}
                sx={{ border: '1px solid #1e293b', ":hover": { backgroundColor: 'white' } }}
                size='small'
              >
                <RemoveIcon sx={{ color: '#1e293b' }} />
              </IconButton><Typography variant="h5" className='text-slate-800 mx-small'>
                {ticketsAddedToCart}
              </Typography>
              <IconButton
                aria-label="add"
                onClick={() => incrementTickets()}
                sx={{ backgroundColor: '#1e293b', ":hover": { backgroundColor: '#1e293b' } }}
                size='small'
              >
                <AddIcon sx={{ color: 'white' }} />
              </IconButton>
            </div>

          </section>
          <section className="flex justify-between gap-4 mt-small">
            <Button
              className="mt-small rounded p-small flex-1"
              onClick={() => handleExpandClick(ticket.number)}
              sx={{ border: '1px solid #1e293b', backgroundColor: 'white', color: '#1e293b', ':hover': { backgroundColor: '#1e293b', color: 'white' } }}
            >
              Close
            </Button>

            <Button
              className="mt-small rounded p-small flex-1"
              onClick={() => addTicketsToCart()}
              sx={{ border: '1px solid', backgroundColor: '#1e293b', color: 'white', ':hover': { backgroundColor: 'white', color: '#1e293b' } }}
            >
              Add to cart
            </Button>

          </section>
        </Collapse>
      </CardContent>
    </div>
  );
}