"use client";
import { Typography } from "@mui/material";

import React, { useEffect } from 'react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';


export default function Cart() {

    useEffect(() => {
        // document.title = "Cart";
    }, []);


    return (
        <main className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <Typography variant="h3" className="text-center h-12">Your cart</Typography>


            <Footer />


        </ main>
    );
}




