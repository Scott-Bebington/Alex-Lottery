"use client";
import { Typography } from "@mui/material";

import React, { useEffect, useMemo } from 'react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import LotteryTicket from "../classes/lotteryTicket";

interface CartProps {
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
}

export default function Cart({ cart, setCart }: CartProps) {

    return (
        <main className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <Typography variant="h3" className="text-center h-12">Your cart</Typography>
            <div className="flex flex-col items-center">
                {cart.map((ticket: LotteryTicket) => (
                    <div key={ticket.number} className="flex flex-col items-center border-2 border-gray-300 p-4 m-4">
                        <img src={ticket.image} alt="ticket" className="w-32 h-32" />
                        <Typography variant="h5">{ticket.number}</Typography>
                        <Typography variant="h6">Price: {ticket.cost}</Typography>
                        <Typography variant="h6">Quantity: {ticket.quantity}</Typography>
                        <Typography variant="h6">Total: {ticket.cost * ticket.quantity}</Typography>
                        <button onClick={() => setCart(cart.filter((t: LotteryTicket) => t.number !== ticket.number))} className="bg-red-500 text-white p-2 rounded-md">Remove</button>
                    </div>
                ))}
            </div>

            <Footer />


        </ main>
    );
}




