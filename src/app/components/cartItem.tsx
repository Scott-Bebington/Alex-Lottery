"use client";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, CardContent, IconButton, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import LotteryTicket from '../classes/lotteryTicket';
import { addToCart, getTicket, removeFromCart } from '../functions/cart_functions';

import { checkErrorMessage } from '../functions/errorChecking';
import { CartItemProps, SnackbarMessage } from '../interfaces/interfaces';

export default function CartItem({
  ticket,
  cart,
  setCart,
  snackbarState: {
    handleSnackbarOpen,
  }
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

    saveChanges();
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

    saveChanges();
  }

  const saveChanges = async () => {
    let openSnackbar;

    if (ticketsAdded === 0) {
      openSnackbar = handleSnackbarOpen("No changes made", "info");
      openSnackbar();
      return;
    }

    try {

      if (ticketsAdded > 0) {
        console.log("Adding tickets to cart");

        await addToCart(ticket, ticketsAdded);


      } else {
        const ticketsRemoved = Math.abs(ticketsAdded);
        await removeFromCart(ticket, ticketsRemoved);
        console.log("Removing tickets from cart");
      }

    } catch (error: Error | any) {
      console.error(error.message);

      const errorMessage: SnackbarMessage = checkErrorMessage(error.message);
      openSnackbar = handleSnackbarOpen(errorMessage.message, errorMessage.status);
      openSnackbar();
      return;
    }

    console.log("Changes saved");
    openSnackbar = handleSnackbarOpen("Changes saved", "success");
    openSnackbar();
    return;
  }

  const cancelChanges = () => {

    if (ticketsAdded === 0) {
      let openSnackbar = handleSnackbarOpen("No changes made", "info");
      openSnackbar();
      return;
    }

    console.log("Cancelling changes");
    setTicketsAdded(0);
    setQuantity(ticket.quantity - ticketsAdded);
    setRemainingTickets(remainingTickets + ticketsAdded);
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

        {/* <section>
          <Button
            onClick={() => {
              saveChanges();
            }}
          >
            Save Changes
          </Button>
          <Button
            onClick={() => {
              cancelChanges();
            }}
          >
            Cancel Changes
          </Button>
        </section> */}

      </div>
    </>
  )
};