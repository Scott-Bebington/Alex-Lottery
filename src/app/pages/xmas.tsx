"use client";
import { CardActionArea, CardContent, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import LotteryTicket from '../classes/lotteryTicket';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import Ticket from '../components/ticket';
import TicketFilter from '../components/ticketFilter';

import { addToCart } from "../functions/cart_functions";

import { checkErrorMessage } from "../functions/errorChecking";
import { SnackbarMessage, XmasDrawProps } from '../interfaces/interfaces';
import { useNavigate } from "react-router-dom";

export default function XmasDraw(
  {
    xmasTickets,
    filteredTickets,
    setFilteredTickets,
    ticketsLoaded,
    cart,
    setCart,
    snackbarState: {
      snackbarOpen,
      setSnackbarOpen,
      handleSnackbarOpen,
      handleSnackbarClose,
      handleSnackbarExited,
      messageInfo,
      snackPack
    }
  }: XmasDrawProps
) {
  /*
  * Ticket filter state management
  */
  const [ticketNumberInputValue, setTicketNumberInput] = useState<string>('');
  const [drawDateInputValue, setDrawDateInputValue] = useState<string>('');
  const [costInputValue, setCostInputValue] = useState<string>('');
  const filterByDate = (ticket: LotteryTicket) => ticket.date.toString();
  const filterByNumber = (ticket: LotteryTicket) => ticket.number.toString();
  const filterByCost = (ticket: LotteryTicket) => ticket.cost.toString();
  const navigate = useNavigate();

  useEffect(() => {
    var redirectPath = window.localStorage.getItem('paymentSuccess') || '/';
    window.localStorage.removeItem('paymentSuccess')

    if (redirectPath === '/success') {
      navigate('/success');
    } else if (redirectPath === '/cart') {
      navigate('/cart');
    }
  }, []);

  /*
  * Selected ticket state management
  */
  const [selectedTicket, setSelectedTicket] = useState<LotteryTicket | null>(null);
  const [ticketsAddedToCart, setTicketsAddedToCart] = useState<number>(0);

  /*
  * Expanded state management
  */
  const [expandedState, setExpandedState] = useState<{ [key: number]: boolean }>({});

  const handleExpandClick = (ticketNumber: number) => {
    setExpandedState((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key: string) => {
        acc[key] = false; // Collapse all cards
        return acc;
      }, {} as { [key: string]: boolean }),
      [ticketNumber]: !prevState[ticketNumber] // Toggle the selected card
    }));

    setTicketsAddedToCart(0);
    setSelectedTicket(xmasTickets.find(ticket => ticket.number === ticketNumber) || null);
  };

  /*
  * Ticket adding functions
  */
  const incrementTickets = () => {
    if (selectedTicket !== null && ticketsAddedToCart === selectedTicket.quantity) {
      return;
    }

    setTicketsAddedToCart(ticketsAddedToCart + 1);
  };

  const decrementTickets = () => {
    if (ticketsAddedToCart === 0) {
      return;
    }
    setTicketsAddedToCart(ticketsAddedToCart - 1);
  };

  const addTicketsToCart = async () => {
    let openSnackbar;

    if (selectedTicket === null) {
      openSnackbar = handleSnackbarOpen("No ticket selected", "error");
      openSnackbar();
      return;
    }

    if (ticketsAddedToCart === 0) {
      openSnackbar = handleSnackbarOpen("No tickets added to cart", "error");
      openSnackbar();
      return;
    }

    // Add tickets to cart
    try {

      await addToCart(
        selectedTicket,
        ticketsAddedToCart,
      );

    } catch (error: Error | any) {
      console.error(error.message);

      const errorMessage: SnackbarMessage = checkErrorMessage(error.message);
      openSnackbar = handleSnackbarOpen(errorMessage.message, errorMessage.status);
      openSnackbar();
      return;
    }

    if (ticketNumberInputValue !== "") {
      setTicketNumberInput("");
    }

    if (drawDateInputValue !== "") {
      setDrawDateInputValue("");
    }

    setTicketsAddedToCart(0);
    setSelectedTicket(null);

    // Remove ticket from filtered tickets if there are none left
    if (selectedTicket.quantity === 0) {
      const filtered = filteredTickets.filter(ticket => ticket.number !== selectedTicket.number);
      setFilteredTickets(filtered);
    }

    // Close the expanded card
    handleExpandClick(selectedTicket.number);

    openSnackbar = handleSnackbarOpen(`Added ${ticketsAddedToCart} tickets to cart`, "success");
    openSnackbar();
  };

  /*
  * Ticket filtering
  */
  useEffect(() => {
    const filtered = xmasTickets.filter(ticket =>
      ticket.number.toString().includes(ticketNumberInputValue)
    );
    setFilteredTickets(filtered);
  }, [ticketNumberInputValue]);

  useEffect(() => {
    const filtered = xmasTickets.filter(ticket =>
      ticket.date.includes(drawDateInputValue)
    );
    setFilteredTickets(filtered);
  }, [drawDateInputValue]);

  useEffect(() => {
    const filtered = xmasTickets.filter(ticket =>
      ticket.cost.toString().includes(costInputValue)
    );
    setFilteredTickets(filtered);
  }, [costInputValue]);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Typography variant="h3" className="text-center h-12">Christmas Draw</Typography>
      <section className="h-24 gap-4 px-small w-full flex justify-center">
        <TicketFilter
          id='ticket_number_input'
          label='Lottery Ticket Number'
          tickets={xmasTickets}
          setInputValue={setTicketNumberInput}
          inputValue={ticketNumberInputValue}
          getOptionLabel={filterByNumber}
        />
        <TicketFilter
          id='draw_date_input'
          label='Draw Date'
          tickets={xmasTickets}
          setInputValue={setDrawDateInputValue}
          inputValue={drawDateInputValue}
          getOptionLabel={filterByDate}
        />
        <TicketFilter
          id='cost_input'
          label='Cost'
          tickets={xmasTickets}
          setInputValue={setCostInputValue}
          inputValue={costInputValue}
          getOptionLabel={filterByCost}
        />
      </section>

      <section className="flex flex-1 w-full">
        <div
          className="w-full p-small overflow-y-auto gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          style={{ maxHeight: "calc(100vh - 15rem)", alignItems: "flex-start" }}
        >
          {!ticketsLoaded ? (
            Array.from(Array(8).keys()).map((_, index) => (
              <div
                key={index}
              >
                <CardActionArea>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </CardContent>
                </CardActionArea>
              </div>
            ))
          ) : (
            filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Ticket
                  key={ticket.number}
                  ticket={ticket}
                  expandedState={expandedState}
                  handleExpandClick={handleExpandClick}
                  decrementTickets={decrementTickets}
                  incrementTickets={incrementTickets}
                  ticketsAddedToCart={ticketsAddedToCart}
                  addTicketsToCart={addTicketsToCart}
                />
              ))
            ) : (
              <div className="flex w-full justify-center items-center">
                <Typography>No tickets match the filter criteria.</Typography>
              </div>
            )
          )}
        </div>
      </section>

      <Footer />


    </main >
  );
}




