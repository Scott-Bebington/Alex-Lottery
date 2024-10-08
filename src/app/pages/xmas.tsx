"use client";
import { Autocomplete, Box, CardActionArea, CardContent, Checkbox, FormControl, InputLabel, ListItemText, ListSubheader, MenuItem, OutlinedInput, Select, SelectChangeEvent, Skeleton, Slider, TextField, Typography } from "@mui/material";
import { use, useEffect, useMemo, useRef, useState } from "react";

import LotteryTicket from '../classes/lotteryTicket';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import Ticket from '../components/ticket';
import TicketFilter from '../components/ticketFilter';

import { addToCart } from "../functions/cart_functions";

import { checkErrorMessage } from "../functions/errorChecking";
import { SnackbarMessage, XmasDrawProps } from '../interfaces/interfaces';
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
    },
    navbarProps: {
      user,
      setUser,
      history,
      setHistory
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
  /*
  * Selected ticket state management
  */
  const [selectedTicket, setSelectedTicket] = useState<LotteryTicket | null>(null);
  const [ticketsAddedToCart, setTicketsAddedToCart] = useState<number>(0);

  // #region Ticket Expand
  /*
  * Expanded state management
  */
  const [expandedState, setExpandedState] = useState<{ [key: number]: boolean }>({});

  const selectTicket = (ticketNumber: number) => {
    setSelectedTicket(xmasTickets.find(ticket => ticket.number === ticketNumber) || null);
  }

  const handleExpandClick = (ticketNumber: number) => {
    setExpandedState((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key: string) => {
        acc[key] = false; // Collapse all cards
        return acc;
      }, {} as { [key: string]: boolean }),
      [ticketNumber]: !prevState[ticketNumber] // Toggle the selected card
    }));

    setTicketsAddedToCart(0);
    selectTicket(ticketNumber);
  };
  // #endregion

  // #region Ticket functions
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

    const pushLocation = (location: string) => {
      setHistory([...history, location]);
    };

    if (auth.currentUser === null) {
      openSnackbar = handleSnackbarOpen("Please login to add tickets to cart", "info");
      openSnackbar();
      const urlParams = new URLSearchParams();
      urlParams.append("execute", "addXmasTickets");
      urlParams.append("quantity", ticketsAddedToCart.toString());
      urlParams.append("ticketNumber", selectedTicket.number.toString());
      pushLocation(`/?${urlParams.toString()}`);
      navigate("/login");
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
  // #endregion

  // #region Redirect from login and Singup
  const [executeRedirect, setExecuteRedirect] = useState<boolean>(false);
  const initialRender = useRef<boolean>(false);

  useEffect(() => {
    if (initialRender.current === false) {
      var urlParams = new URLSearchParams(window.location.search);
      if (urlParams.size > 0 && xmasTickets.length > 0) {
        const execute = urlParams.get('execute');

        if (execute !== "addXmasTickets") {
          return;
        }

        const quantity = parseInt(urlParams.get('quantity')!);

        const ticketNumber = parseInt(urlParams.get('ticketNumber')!);

        // output the tickets to the console
        console.log(xmasTickets);

        selectTicket(ticketNumber);
        setTicketsAddedToCart(quantity);
        setExecuteRedirect(true);
      }
    }

    return () => {
      initialRender.current = true;
    }
  }, [xmasTickets]);

  useEffect(() => {
    if (executeRedirect && selectedTicket && ticketsAddedToCart > 0) {
      addTicketsToCart();
      handleExpandClick(selectedTicket.number);
    }
  }, [executeRedirect, selectedTicket, ticketsAddedToCart]);
  // #endregion

  // #region Ticket filtering
  /*
  * Ticket filtering
  */
  useEffect(() => {
    const filtered = xmasTickets.filter(ticket =>
      ticket.number.toString().includes(ticketNumberInputValue)
    );
    setFilteredTickets(filtered);
  }, [ticketNumberInputValue]); 

  const filterTickets = () => {

  }
  // #endregion

  // #region Date Range Input

  const [dates, setDates] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: string[] }>({
    "This Week": [],
    "Next Week": [],
    "This Month": [],
    "Later": []
  });

  useEffect(() => {

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const thisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const localCategories: { [key: string]: string[] } = {
      "This Week": [],
      "Next Week": [],
      "This Month": [],
      "Later": []
    };

    xmasTickets.forEach(ticket => {

      const ticketDate = new Date();
      ticketDate.setDate(parseInt(ticket.date.split("-")[0]));
      ticketDate.setMonth(parseInt(ticket.date.split("-")[1]) - 1);
      ticketDate.setFullYear(parseInt(ticket.date.split("-")[2]));
      if (ticketDate <= nextWeek) {
        localCategories["This Week"].push(ticket.date);
      } else if (ticketDate <= thisMonth) {
        localCategories["Next Week"].push(ticket.date);
      } else if (ticketDate.getMonth() === today.getMonth()) {
        localCategories["This Month"].push(ticket.date);
      } else {
        localCategories["Later"].push(ticket.date);
      }
    });

    setCategories(localCategories);
  }, [xmasTickets]);

  const handleDateChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setDates(typeof value === 'string' ? value.split(',') : value);

    if (value.length === 0) {
      setFilteredTickets(xmasTickets);
    } else {
      const filtered = xmasTickets.filter(ticket =>
        value.includes(ticket.date)
      );
      setFilteredTickets(filtered);
    }
  };

  // #endregion

  // #region Slider
  const [sliderMin, setSliderMin] = useState<number>(0);
  const [sliderMax, setSliderMax] = useState<number>(25);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setSliderMin(newValue[0] as number);
      setSliderMax(newValue[1] as number);

      // filter tickets by cost
      const filtered = xmasTickets.filter(ticket =>
        ticket.cost >= newValue[0] && ticket.cost <= newValue[1]
      );

      setFilteredTickets(filtered);
    }
  };

  function valuetext(value: number) {
    return `${value} €`;
  }
  // #endregion


  return (
    <main className="flex flex-col" style={{ minHeight: "calc(100vh - 6rem)" }}>
      {/* <Navbar /> */}
      <Typography variant="h3" className="text-center py-large">Christmas Draw</Typography>
      <section className="h-24 gap-4 px-small w-full flex justify-center">
        {/* <TicketFilter
          id='ticket_number_input'
          label='Lottery Ticket Number'
          tickets={xmasTickets}
          setInputValue={setTicketNumberInput}
          inputValue={ticketNumberInputValue}
          getOptionLabel={filterByNumber}
        /> */}
        <Autocomplete
          className="flex-1 mt-small w-1/3"
          id='ticket_number_input'
          freeSolo
          options={xmasTickets.map(filterByNumber)}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Lottery Ticket Number'
              value={ticketNumberInputValue}
              onChange={(e) => setTicketNumberInput(e.target.value)}
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
            setTicketNumberInput(newInputValue);
          }}
        />
        <FormControl sx={{ width: "33%", marginTop: "12px" }}>
          <InputLabel htmlFor="grouped-select">Draw Date</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={dates}
            onChange={handleDateChange}
            input={<OutlinedInput label="Draw Date" />}
            renderValue={(selected) => selected.join(', ')}
          >
            <ListSubheader>This Week</ListSubheader>
            {categories["This Week"].map((date) => (
              <MenuItem key={date} value={date}>
                <Checkbox checked={dates.indexOf(date) > -1} />
                <ListItemText primary={date} />
              </MenuItem>
            ))}
            <ListSubheader>Next Week</ListSubheader>
            {categories["Next Week"].map((date) => (
              <MenuItem key={date} value={date}>
                <Checkbox checked={dates.indexOf(date) > -1} />
                <ListItemText primary={date} />
              </MenuItem>
            ))}
            <ListSubheader>This Month</ListSubheader>
            {categories["This Month"].map((date) => (
              <MenuItem key={date} value={date}>
                <Checkbox checked={dates.indexOf(date) > -1} />
                <ListItemText primary={date} />
              </MenuItem>
            ))}
            <ListSubheader>Later</ListSubheader>
            {categories["Later"].map((date) => (
              <MenuItem key={date} value={date}>
                <Checkbox checked={dates.indexOf(date) > -1} />
                <ListItemText primary={date} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="w-1/3 h-14 mt-3 border-2 border-gray-400 rounded-[4px] relative p-4">
          <Typography
            id="track-inverted-slider"
            sx={{
              position: 'absolute',
              top: '-10px',
              left: '10px',
              backgroundColor: 'rgb(233, 231, 231)',
              padding: '0 4px',
              fontSize: '0.875rem' // Optional: adjust size if needed
            }}
          >
            Cost
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography>
              {sliderMin}€
            </Typography>
            <Slider
              track="inverted"
              aria-labelledby="track-inverted-slider"
              valueLabelDisplay="auto"
              getAriaValueText={valuetext}
              defaultValue={[0, 25]}
              step={1}
              onChange={handleSliderChange}
              max={25}
              sx={{ margin: "0 14px" }} // Adds space between labels and slider
            />
            <Typography>
              {sliderMax}€
            </Typography>
          </Box>
        </div>


      </section>

      <section className="flex flex-1 w-full">
        <div
          className="w-full p-small gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
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




