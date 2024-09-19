"use client";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, CardContent, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
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
  const [remainingTickets, setRemainingTickets] = useState<number>(0);
  const initialRender = useRef<boolean>(false);
  const [dropdownDisabled, setDropdownDisabled] = useState<boolean>(false);

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

  const handleChange = async (event: SelectChangeEvent) => {

    setDropdownDisabled(true);

    // get the difference between the current quantity and the new quantity
    const difference = parseInt(event.target.value) - ticket.quantity;

    let openSnackbar;

    if (difference === 0) {
      return;
    }

    try {

      if (difference > 0) {
        console.log("Adding tickets to cart");

        await addToCart(ticket, difference);


      } else {
        const ticketsRemoved = Math.abs(difference);
        await removeFromCart(ticket, ticketsRemoved);
        console.log("Removing tickets from cart");
      }

    } catch (error: Error | any) {

      setDropdownDisabled(false);

      console.error(error.message);

      const errorMessage: SnackbarMessage = checkErrorMessage(error.message);
      openSnackbar = handleSnackbarOpen(errorMessage.message, errorMessage.status);
      openSnackbar();
      return;
    }

    setDropdownDisabled(false);

    setQuantity(parseFloat(event.target.value));

    openSnackbar = handleSnackbarOpen("Changes saved", "success");
    openSnackbar();
    return;


  };

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
          <FormControl fullWidth disabled={dropdownDisabled}>
            <InputLabel id="cart-quantity-select-label">Quantity</InputLabel>
            <Select
              labelId="cart-quantity-select-label"
              id="cart-quantity-select"
              value={quantity.toString()}
              label="Quantity"
              onChange={handleChange}
            >
              {Array.from({ length: (remainingTickets + ticket.quantity) }, (_, i) => (
                <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
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