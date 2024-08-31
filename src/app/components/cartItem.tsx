"use client";

import { CardActions, CardContent, CardMedia, Collapse, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ActionButton from './actionButton';
import { getTicket } from '../functions/cart_functions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface CartItemProps {
  ticket: any;
  setCart: any;
}

export default function CartItem({
  ticket,
  setCart
}: CartItemProps) {

  const [quantity, setQuantity] = useState<number>(ticket.quantity);
  const 
  const [remainingTickets, setRemainingTickets] = useState<number>(0);
  const initialRender = useRef<boolean>(false);

  /**
   * Fetch ticket data for this specific ticket
   * Function sets a listener to the ticket document in Firestore
   */
  useEffect(() => {
    if (initialRender.current === false) {

      const fetchTicketData = async () => {
        await getTicket(ticket.ticketID, ticket.type, setRemainingTickets);
      }

      fetchTicketData();

      return () => {
        initialRender.current = true;
      };
    }
  }, []);

  return (
    <>
      <div className='flex h-36 border-b border-grey pb-small'>
        <section className='flex w-6/12'>
          <img
            src={ticket.image}
            alt="Lottery ticket image"
            className='rounded px-small pt-small'
          />
          <CardContent className='flex flex-col items-start justify-between'>
            <Typography variant="subtitle2" className='text-gray-400'>
              Draw Date: {ticket.date}
            </Typography>

            <Typography variant="h4" className=''>
              {ticket.number}
            </Typography>

            <Typography variant="subtitle2" className='text-gray-400'>
              Tickets left: {remainingTickets}
            </Typography>
          </CardContent>
        </section>

        <section className='flex w-2/12 items-center justify-center'>
          <Typography variant="h6" className=''>
            ${ticket.cost}
          </Typography>
        </section>

        <section className='flex w-2/12 items-center justify-center'>
          <IconButton
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            sx={{
              marginRight: '10px',
              padding: '1px',
              border: '1px solid #1e293b',
              borderRadius: '5px'
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6" className=''>
            {quantity}
          </Typography>
          <IconButton
            onClick={() => {
              if (quantity < remainingTickets) {
                setQuantity(quantity + 1);
              }
            }}
            sx={{
              marginLeft: '10px',
              padding: '1px',
              border: '1px solid #1e293b',
              borderRadius: '5px'
            }}
          >
            <AddIcon />
          </IconButton>
        </section>

        <section className='flex w-2/12 items-center justify-center'>
          <Typography variant="h6" className=''>
            ${ticket.cost * quantity}
          </Typography>
        </section>

      </div>
    </>
  )
};