"use client";
import { CardActionArea, CardContent, Skeleton, SnackbarCloseReason, Typography } from "@mui/material";

import React, { useEffect, useMemo, useRef, useState } from 'react';

import Navbar from '../components/navbar';
import Footer from '../components/footer';
import LotteryTicket from "../classes/lotteryTicket";
import { getCart } from "../functions/cart_functions";
import CartItem from "../components/cartItem";

import { CartProps } from '../interfaces/interfaces';

export default function Cart({
  cart,
  setCart,
  cartLoaded,
  snackbarState: {
    snackbarOpen,
    setSnackbarOpen,
    handleSnackbarOpen,
    handleSnackbarClose,
    handleSnackbarExited,
    setSnackPack,
    messageInfo,
    snackPack
  }
}: CartProps) {

  function calculateTotal() {
    let total = 0;

    cart.forEach((ticket) => {
      total += ticket.cost * ticket.quantity;
    });

    return total;

  }

  const snackbarState = {
    snackbarOpen,
    setSnackbarOpen,
    handleSnackbarOpen,
    handleSnackbarClose,
    handleSnackbarExited,
    setSnackPack,
    messageInfo,
    snackPack
  };

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <Typography variant="h5" className="text-center flex items-center px-small font-bold h-12">Your Cart</Typography>



      <section className="flex flex-1 w-full">
        <div
          className="w-full p-small overflow-y-auto bg-white mx-small mb-small rounded"
          style={{ maxHeight: "calc(100vh - 9rem)", alignItems: "flex-start" }}
        >
          <div className="px-small flex">
            <Typography variant="h6" className="text-left w-6/12">Ticket</Typography>
            <Typography variant="h6" className="text-center w-2/12">Price</Typography>
            <Typography variant="h6" className="text-center w-2/12">Quantity</Typography>
            <Typography variant="h6" className="text-center w-2/12">Total Price</Typography>
          </div>

          {!cartLoaded ? (
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
            cart.length === 0 ? (
              <Typography variant="h5" className="text-center">Your cart is empty</Typography>
            ) : (
              cart.map((ticket: LotteryTicket) => (
                <CartItem
                  key={ticket.number}
                  ticket={ticket}
                  cart={cart}
                  setCart={setCart}
                  snackbarState={snackbarState}
                />

              ))
            )
          )}

        </div>
        <aside
          className="w-1/4 p-small overflow-y-auto bg-white mr-small mb-small rounded"
          style={{ maxHeight: "calc(100vh - 9rem)", alignItems: "flex-start" }}
        >
          <Typography variant="h4" className="text-center">Total: ${calculateTotal()}</Typography>
        </aside>
      </section>

      <Footer />


    </ main>
  );
}




