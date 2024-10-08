"use client";
import { Button, CardActionArea, CardContent, Skeleton, Typography } from "@mui/material";


import LotteryTicket from "../classes/lotteryTicket";
import CartItem from "../components/cartItem";
import Footer from '../components/footer';
import Navbar from '../components/navbar';

import { CartProps, SnackbarMessage } from '../interfaces/interfaces';
import { useEffect, useMemo } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { checkout } from "../functions/cart_functions";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
  const navigate = useNavigate();
  useEffect(() => {
    // console.log("Cart page loaded");
    if (!auth.currentUser) {
      let infoMesssage: SnackbarMessage = {
        message: "You must be logged in to view your cart",
        key: 0,
        status: "info"
      };
      let openSnackbar = handleSnackbarOpen(infoMesssage.message, 'info');
      openSnackbar();
      if (window.localStorage.getItem('redirectAfterLogin')) {
        window.localStorage.removeItem('redirectAfterLogin');
      }
      window.localStorage.setItem('redirectAfterLogin', window.location.pathname);
      navigate("/login");
    }
  }, [auth.currentUser]);

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
    <main className="flex flex-col" style={{ minHeight: "calc(100vh - 6rem)" }}>
      <Typography variant="h5" className="text-center flex items-center px-small font-bold h-12">Your Cart</Typography>
      <section className="flex flex-1 w-full">
        <div
          className="w-full p-small overflow-y-auto bg-white mx-small mb-small rounded"
          style={{ maxHeight: "calc(100vh - 9rem)", alignItems: "flex-start" }}
        >
          <div className="px-small flex">
            <Typography variant="h6" className="text-left w-6/12">Ticket</Typography>
            <Typography variant="h6" className="text-center w-2/12">Ticket Price</Typography>
            <Typography variant="h6" className="text-center w-2/12">Quantity</Typography>
            <Typography variant="h6" className="text-center w-2/12">Total Price</Typography>
          </div>

          {!cartLoaded ? (
            Array.from(Array(8).keys()).map((_, index) => (
              <div
                key={index}
              >
                <CardActionArea>
                  <Skeleton variant="rectangular" height={120} />
                  <CardContent>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                  </CardContent>
                </CardActionArea>
              </div>
            ))
          ) : (
            cart.length === 0 ? (
              <div className="flex items-center justify-center" style={{ height: "calc(100% - 2rem)" }}>
                <Typography variant="h5" className="text-center">Your cart is empty</Typography>
              </div>
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
          <Typography variant="h4" className="text-center">Total: {calculateTotal()} €</Typography>
          <Button
            onClick={async () => {

              try {
                await checkout();
              } catch (error: Error | any) {
                if (error.message === "User is not logged in") {
                  let infoMesssage: SnackbarMessage = {
                    message: "You must be logged in to checkout",
                    key: 0,
                    status: "info"
                  };
                  let openSnackbar = handleSnackbarOpen(infoMesssage.message, 'info');
                  openSnackbar();
                  return;
                }

                console.error(error.message);
              }
            }}
          >
            Checkout
          </Button>
        </aside>
      </section>
    </ main>
  );
}




