"use client";
import { CardActionArea, CardContent, Skeleton, Typography } from "@mui/material";
import { SnackbarCloseReason } from '@mui/material/Snackbar';
import { useEffect, useState } from "react";
import React from 'react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import CustomSnackbar from '../components/snackbar';
import TicketFilter from '../components/ticketFilter';
import LotteryTicket from '../classes/lotteryTicket';
import Ticket from '../components/ticket';


export interface SnackbarMessage {
    message: string;
    key: number;
    status: string;
}

interface KidsDrawProps {
    tickets: LotteryTicket[];
    setTickets: (cart: LotteryTicket[]) => void;
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
}

export default function KidsDraw({
    tickets,
    setTickets,
    cart,
    setCart
}: KidsDrawProps) {
    /*
    * Ticket filter state management
    */
    // const [tickets, setTickets] = useState<LotteryTicket[]>([]);
    const [filteredTickets, setFilteredTickets] = useState<LotteryTicket[]>([]);
    const [ticketsLoaded, setTicketsLoaded] = useState<boolean>(false);
    const [ticketNumberInputValue, setTicketNumberInput] = useState<string>('');
    const [drawDateInputValue, setDrawDateInputValue] = useState<string>('');
    const [costInputValue, setCostInputValue] = useState<string>('');
    const filterByDate = (ticket: LotteryTicket) => ticket.date.toString();
    const filterByNumber = (ticket: LotteryTicket) => ticket.number;
    const filterByCost = (ticket: LotteryTicket) => ticket.cost;

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

        setTicketsAddedToCart(0);
        setSelectedTicket(tickets.find(ticket => ticket.number === ticketNumber) || null);
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
            if (selectedTicket.quantity === 0) {
                const filtered = filteredTickets.filter(ticket => ticket.number !== selectedTicket.number);
                setFilteredTickets(filtered);
            }

            handleExpandClick(selectedTicket.number);

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
            <Navbar />
            <Typography variant="h3" className="text-center h-12">Kids Draw</Typography>
            <section className="h-24 gap-4 px-small w-full flex justify-center">
                <TicketFilter
                    id='ticket_number_input'
                    label='Lottery Ticket Number'
                    tickets={tickets}
                    setInputValue={setTicketNumberInput}
                    inputValue={ticketNumberInputValue}
                    getOptionLabel={filterByNumber}
                />
                <TicketFilter
                    id='draw_date_input'
                    label='Draw Date'
                    tickets={tickets}
                    setInputValue={setDrawDateInputValue}
                    inputValue={drawDateInputValue}
                    getOptionLabel={filterByDate}
                />
                <TicketFilter
                    id='cost_input'
                    label='Cost'
                    tickets={tickets}
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

            <CustomSnackbar
                snackbarOpen={snackbarOpen}
                setSnackbarOpen={setSnackbarOpen}
                handleSnackbarClose={handleSnackbarClose}
                handleSnackbarExited={handleSnackbarExited}
                message={messageInfo ? messageInfo.message : ""}
                snackbarKey={messageInfo ? messageInfo.key : 0}
                status={messageInfo ? messageInfo.status : "success"}
            />
        </ main>
    );
}




