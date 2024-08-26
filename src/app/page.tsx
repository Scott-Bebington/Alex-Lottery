"use client";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ShareIcon from '@mui/icons-material/Share';
import { Alert, AlertColor, Autocomplete, Avatar, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Collapse, IconButton, IconButtonProps, Skeleton, styled, TextField, Typography } from "@mui/material";
import { red } from '@mui/material/colors';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Fragment, use, useEffect, useMemo, useState } from "react";

export interface SnackbarMessage {
  message: string;
  key: number;
  status: string;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Home() {
  /*
  * Ticket filter state management
  */
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<LotteryTicket[]>([]);
  const [ticketsLoaded, setTicketsLoaded] = useState<boolean>(false);
  const [ticketNumberInputValue, setTicketNumberInput] = useState<string>('');
  const [drawDateInputValue, setDrawDateInputValue] = useState<string>('');
  const [costInputValue, setCostInputValue] = useState<string>('');

  /*
  * Selected ticket state management
  */
  const [selectedTicket, setSelectedTicket] = useState<LotteryTicket | null>(null);
  const [ticketsAddedToCart, setTicketsAddedToCart] = useState<number>(0);

  /*
  * Snackbar state management
  */
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);





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
  };





  /*
  * Snackbar functions
  */
  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setSnackbarOpen(true);
    } else if (snackPack.length && messageInfo && snackbarOpen) {
      // Close an active snack when a new one is added
      setSnackbarOpen(false);
    }
  }, [snackPack, messageInfo, snackbarOpen]);

  const handleSnackbarOpen = (message: string, status: string) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime(), status: status }]);
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbarExited = () => {
    setMessageInfo(undefined);
  };

  /*
  * Fetching tickets from the server
  */
  useEffect(() => {
    setTimeout(() => {
      setTickets([
        new LotteryTicket(43840, "2024-09-05", 5, "Powerball", 2, "/images/tickets/ticket_example.png"),
        new LotteryTicket(52341, "2024-09-12", 10, "Mega Millions", 1, "/images/tickets/ticket_example.png"),
        new LotteryTicket(78903, "2024-09-19", 15, "Powerball", 4, "/images/tickets/ticket_example.png"),
        new LotteryTicket(48203, "2024-09-26", 20, "EuroMillions", 3, "/images/tickets/ticket_example.png"),
        new LotteryTicket(31456, "2024-10-03", 7, "Powerball", 5, "/images/tickets/ticket_example.png"),
        new LotteryTicket(60234, "2024-10-10", 8, "Mega Millions", 6, "/images/tickets/ticket_example.png"),
        new LotteryTicket(15678, "2024-10-17", 9, "EuroMillions", 2, "/images/tickets/ticket_example.png"),
        new LotteryTicket(89432, "2024-10-24", 12, "Powerball", 3, "/images/tickets/ticket_example.png"),
        new LotteryTicket(34781, "2024-10-31", 6, "Mega Millions", 7, "/images/tickets/ticket_example.png"),
        new LotteryTicket(62894, "2024-11-07", 14, "EuroMillions", 4, "/images/tickets/ticket_example.png"),
        new LotteryTicket(74829, "2024-11-14", 11, "Powerball", 1, "/images/tickets/ticket_example.png"),
        new LotteryTicket(23485, "2024-11-21", 13, "Mega Millions", 5, "/images/tickets/ticket_example.png"),
        new LotteryTicket(54932, "2024-11-28", 16, "EuroMillions", 6, "/images/tickets/ticket_example.png"),
        new LotteryTicket(67290, "2024-12-05", 18, "Powerball", 4, "/images/tickets/ticket_example.png"),
        new LotteryTicket(85423, "2024-12-12", 7, "Mega Millions", 2, "/images/tickets/ticket_example.png"),
        new LotteryTicket(12345, "2024-12-19", 5, "EuroMillions", 3, "/images/tickets/ticket_example.png"),
      ]);
    }, 1);
  }, []);

  useEffect(() => {
    setFilteredTickets(tickets);
  }, [tickets]);

  useEffect(() => {
    if (tickets.length > 0) {
      setTicketsLoaded(true);
    }
  }, [tickets]);

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

  const addTicketsToCart = () => {
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

    try {
      selectedTicket.quantity -= ticketsAddedToCart;
      setTicketsAddedToCart(0);
      setSelectedTicket(null);

      // Remove ticket from filtered tickets
      const filtered = filteredTickets.filter(ticket => ticket.number !== selectedTicket.number);
      setFilteredTickets(filtered);
    } catch (error) {
      openSnackbar = handleSnackbarOpen("Error adding tickets to cart", "error");
      openSnackbar();
      return;
    }

    if (ticketNumberInputValue !== "") {
      setTicketNumberInput("");
    }

    if (drawDateInputValue !== "") {
      setDrawDateInputValue("");
    }

    openSnackbar = handleSnackbarOpen(`Added ${ticketsAddedToCart} tickets to cart`, "success");
    openSnackbar();
  };

  const deselectTicket = () => {
    setSelectedTicket(null);
    setTicketsAddedToCart(0);
  }

  /*
  * Ticket filtering
  */
  useEffect(() => {
    const filtered = tickets.filter(ticket =>
      ticket.number.toString().includes(ticketNumberInputValue)
    );
    setFilteredTickets(filtered);
  }, [ticketNumberInputValue]);

  useEffect(() => {
    const filtered = tickets.filter(ticket =>
      ticket.date.includes(drawDateInputValue)
    );
    setFilteredTickets(filtered);
  }, [drawDateInputValue]);

  useEffect(() => {
    const filtered = tickets.filter(ticket =>
      ticket.cost.toString().includes(costInputValue)
    );
    setFilteredTickets(filtered);
  }, [costInputValue]);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="h-12 w-full shadow-sm bg-slate-800">
        Navbar here
      </div>
      <section className="h-24 gap-4 px-small w-full flex justify-center">
        <Autocomplete
          className="flex-1 mt-small"
          id="ticket_number_input"
          freeSolo
          options={tickets.map((ticket) => ticket.number.toString())}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lottery Ticket Number"
              onChange={(e) => setTicketNumberInput(e.target.value)}
            />
          )}
          onInputChange={(event, newInputValue) => {
            setTicketNumberInput(newInputValue);
          }}
        />
        <Autocomplete
          className="flex-1 mt-small"
          id="draw_date_input"
          freeSolo
          options={tickets.map((ticket) => ticket.date.toString())}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Draw Date"
              onChange={(e) => setDrawDateInputValue(e.target.value)}
            />
          )}
          onInputChange={(event, newInputValue) => {
            setDrawDateInputValue(newInputValue);
          }}
        />
        <Autocomplete
          className="flex-1 mt-small"
          id="cost_input"
          freeSolo
          options={Array.from(new Set(tickets.map((ticket) => ticket.cost))).sort((a, b) => a - b)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Cost"
              onChange={(e) => setCostInputValue(e.target.value)}
            />
          )}
          onInputChange={(event, newInputValue) => {
            setCostInputValue(newInputValue);
          }}
        />
      </section>

      <section className="flex flex-1 w-full overflow-hidden">
        <div
          className="gap-4 flex flex-wrap justify-center overflow-y-auto p-small w-full"
          style={{ maxHeight: "calc(100vh - 12rem)", alignItems: "flex-start" }}
        >
          {!ticketsLoaded ? (
            Array.from(Array(8).keys()).map((_, index) => (
              <Card
                key={index}
                className="h-fit w-[350px]"
              >
                <CardActionArea>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          ) : (
            filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Card
                  sx={{
                    maxWidth: 345,
                    height: expandedState[ticket.number] ? 'auto' : 'fit-content', // Set height to fit content when expanded
                    flexGrow: 0, // Prevent flex-grow from affecting the height
                  }}
                  key={ticket.number}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={ticket.image}
                    alt="Lottery ticket image"
                  />
                  <CardContent>
                    <div className='flex items-center justify-between'>
                      <Typography variant="subtitle2" className='text-gray-400'>
                        Draw Date: {ticket.date}
                      </Typography>
                      <Typography variant="subtitle2" className='text-gray-400'>
                        {ticket.quantity} Left
                      </Typography>
                    </div>

                    <div className='flex items-center justify-between'>
                      <Typography variant="h4">
                        {ticket.number}
                      </Typography>

                      <CardActions disableSpacing>
                        <IconButton
                          className={[
                            "transform transition-transform",
                            expandedState[ticket.number] ? "rotate-180" : "rotate-0"
                          ].join(" ")}
                          onClick={() => handleExpandClick(ticket.number)}
                          aria-expanded={expandedState[ticket.number]}
                          aria-label="Show more"
                        >
                          <ExpandMoreIcon />
                        </IconButton>
                      </CardActions>
                    </div>

                    <Collapse in={expandedState[ticket.number]} timeout="auto" unmountOnExit>
                      <section className='flex items-center justify-between'>
                        <Typography variant="h5" className='text-slate-800'>
                          $ {ticket.cost.toFixed(2)}
                        </Typography>


                        <div className='flex'>
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
                      <section className="flex justify-between gap-4">
                        <Button
                          className="mt-small bg-white hover:bg-white text-slate-800 rounded p-small flex-1 border-slate-800"
                          onClick={() => handleExpandClick(ticket.number)}
                          sx={{ border: '1px solid' }}
                        >
                          Close
                        </Button>

                        <Button
                          className="mt-small bg-slate-800 hover:bg-slate-800 text-white rounded p-small flex-1"
                          onClick={() => addTicketsToCart()}
                        >
                          Add to cart
                        </Button>

                      </section>
                    </Collapse>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex w-full justify-center items-center">
                <Typography>No tickets match the filter criteria.</Typography>
              </div>
            )
          )}
        </div>
        {selectedTicket && (
          <div className="h-full w-1/3 p-small border-l">
            <Typography variant="h6">Selected Ticket: {selectedTicket.number}</Typography>
            <Typography variant="subtitle1">Draw Date: {selectedTicket.date}</Typography>
            <Typography variant="subtitle1">Cost: ${selectedTicket.cost}</Typography>
            <Typography variant="subtitle1">Available Quantity: {selectedTicket.quantity}</Typography>
            <div className="flex gap-2 items-center">
              <IconButton onClick={decrementTickets} disabled={ticketsAddedToCart <= 0}>
                <RemoveIcon />
              </IconButton>
              <Typography>{ticketsAddedToCart}</Typography>
              <IconButton onClick={incrementTickets} disabled={selectedTicket && ticketsAddedToCart >= selectedTicket.quantity}>
                <AddIcon />
              </IconButton>
            </div>
            <Button variant="contained" color="primary" fullWidth onClick={addTicketsToCart}>
              Add to Cart
            </Button>
            <Button variant="text" fullWidth onClick={deselectTicket}>
              Deselect
            </Button>
          </div>
        )}
      </section>


      <footer className="h-12 w-full shadow-sm bg-slate-800">
        Some footer content here
      </footer>


      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        TransitionProps={{ onExited: handleSnackbarExited }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        action={
          <Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>
          </Fragment>
        }
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={messageInfo ? messageInfo.status as AlertColor : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </main>
  );
}

/**
 * @param {number} number - The lottery ticket number
 * @param {string} date - The date of the lottery ticket
 * @param {number} cost - The cost of the lottery ticket
 * @param {string} type - The type of the lottery (e.g., "Powerball")
 * @param {number} quantity - The quantity of tickets purchased
 * @param {string[]} [images] - An array of image paths for the lottery ticket (optional)
 */
class LotteryTicket {
  number: number;
  date: string;
  cost: number;
  type: string;
  quantity: number;
  image: string | undefined; // Optional type for image, as it may not always be provided

  constructor(
    number: number,
    date: string,
    cost: number,
    type: string,
    quantity: number,
    image?: string // Optional parameter
  ) {
    this.number = number;
    this.date = date;
    this.cost = cost;
    this.type = type;
    this.quantity = quantity;
    this.image = image;
  }
}


