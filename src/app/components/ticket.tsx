"use client";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CardActions, CardContent, CardMedia, Collapse, IconButton, Typography } from "@mui/material";

import ActionButton from './actionButton';

import { TicketProps } from '../interfaces/interfaces';

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
      className='bg-white rounded shadow-sm h-fit'
    >
      <CardMedia
        component="img"
        height="140"
        image={ticket.image}
        alt="Lottery ticket image"
        className='rounded px-small pt-small'
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
                {expandedState[ticket.number] ? "Close" : "Select"}
              </div>
            )}
          </CardActions>
        </section>

        <Collapse in={expandedState[ticket.number]} timeout="auto" unmountOnExit>

          <section className='flex items-center justify-between'>
            <Typography variant="h5" className='text-slate-800'>
              {ticket.cost.toFixed(2)} €
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
            <ActionButton
              onClick={() => handleExpandClick(ticket.number)}
              staticText="Close"
              loadingText="Closing"
              backgroundColour='white'
              colour='#1e293b'
              hoverBackgroundColour='#1e293b'
              hoverColour='white'
              border='#1e293b'
            />

            <ActionButton
              onClick={() => addTicketsToCart()}
              staticText="Add to cart"
              loadingText="Adding to cart"
              backgroundColour='#1e293b'
              colour='white'
              hoverBackgroundColour='white'
              hoverColour='#1e293b'
              border='#1e293b'
            />


          </section>
        </Collapse>
      </CardContent>
    </div>
  );
}