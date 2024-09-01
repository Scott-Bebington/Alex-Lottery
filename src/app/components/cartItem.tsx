"use client";

import { Button, CardActions, CardContent, CardMedia, Collapse, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ActionButton from './actionButton';
import { addToCart, getTicket, updateTicketInCart } from '../functions/cart_functions';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LotteryTicket from '../classes/lotteryTicket';

interface CartItemProps {
  ticket: LotteryTicket;
  cart: LotteryTicket[];
  setCart: (cart: LotteryTicket[]) => void;
}

export default function CartItem({
  ticket,
  cart,
  setCart
}: CartItemProps) {

  const [quantity, setQuantity] = useState<number>(ticket.quantity);
  const [ticketsAdded, setTicketsAdded] = useState<number>(0);
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

  const addTickets = () => {
    if (remainingTickets <= 0) {
      return;
    }

    // setRemainingTickets
    const newTicketsAdded = ticketsAdded + 1;
    setTicketsAdded(newTicketsAdded);
    setQuantity(quantity + 1);
    setRemainingTickets(remainingTickets - 1);

    const newCart: LotteryTicket[] = cart.map((cartTicket) => {
      if (cartTicket.ticketID === ticket.ticketID) {
        cartTicket.quantity = quantity + 1;
      }

      return cartTicket;
    });

    // Update cart
    setCart(newCart);
  }

  const removeTickets = () => {
    if (quantity <= 0) {
      return;
    }

    setTicketsAdded(ticketsAdded - 1);
    setQuantity(quantity - 1);
    setRemainingTickets(remainingTickets + 1);

    // Update cart
    const newCart: LotteryTicket[] = cart.map((cartTicket) => {
      if (cartTicket.ticketID === ticket.ticketID) {
        cartTicket.quantity = quantity - 1;
      }

      return cartTicket;
    });

    // Update cart
    setCart(newCart);
  }

  const saveChanges = async () => {

    if (ticketsAdded === 0) {
      return;
    }

    try {

      console.log('------------ADDING TO CART FROM CART------------');

      console.log('Selected ticket Data: ');
      console.log("Cost: ", ticket.cost);
      console.log("Date: ", ticket.date);
      console.log("Number: ", ticket.number);
      console.log("Quantity: ", (remainingTickets + ticketsAdded));
      console.log("Ticket ID: ", ticket.ticketID);
      console.log("Image: ", ticket.image);
      console.log("Type: ", ticket.type);

      console.log('Tickets Added to Cart: ');
      console.log("Tickets Added: ", ticketsAdded);

      const newTicket = new LotteryTicket(
        ticket.number,
        ticket.date,
        ticket.cost,
        ticket.type,
        remainingTickets + ticketsAdded,
        ticket.ticketID,
        ticket.image
      );

      await addToCart(
        newTicket,
        ticketsAdded,
        cart,
        setCart,
        newTicket.type
      );

      console.log('------------ADDING TO CART FROM CART------------');

      // console.log('Adding to cart');

      // await updateTicketInCart(ticket, ticketsAdded, cart, setCart);

      
    } catch (error) {
      console.error('Error adding tickets to cart: ', error);
    }
  }

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
              removeTickets();
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
              addTickets();
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

        <section>
          <Button
            onClick={() => {
              saveChanges();
            }}
          >
            Save Changes
          </Button>
        </section>

      </div>
    </>
  )
};