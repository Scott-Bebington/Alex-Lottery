"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';


import Xmas from './pages/xmas';
import Kids from './pages/kids';
import Cart from './pages/cart';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LotteryTicket from './classes/lotteryTicket';

import cong from "./firebaseConfig";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";

import { getAllXmasTickets } from "./functions/xmas_functions";
import { getCart } from './functions/cart_functions';
import { SnackbarCloseReason } from '@mui/material';

import { SnackbarMessage } from './interfaces/interfaces';

export default function Home() {
  const [isClient, setIsClient] = useState<boolean>(false);

  /*
    * Snackbar state management
    */
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

  /**
    * Xmas state management
    */
  const [xmasTickets, setXmasTickets] = useState<LotteryTicket[]>([]);
  const [xmasFilteredTickets, setXmasFilteredTickets] = useState<LotteryTicket[]>([]);
  const [xmasTicketsLoaded, setXmasTicketsLoaded] = useState<boolean>(false);

  /**
    * Kids state management
    */
  const [kidsTickets, setKidsTickets] = useState<LotteryTicket[]>([]);
  const [kidsFilteredTickets, setKidsFilteredTickets] = useState<LotteryTicket[]>([]);
  const [kidsTicketsLoaded, setKidsTicketsLoaded] = useState<boolean>(false);

  /**
    * Cart state management
    */
  const [cart, setCart] = useState<LotteryTicket[]>([]);
  const [cartLoaded, setCartLoaded] = useState<boolean>(false);
  const initialRender = useRef<boolean>(false);

  /**
   * Get all data on initial render
   * 1. Xmas tickets
   * 2. Kids tickets
   * 3. Cart
   */
  useEffect(() => {
    if (initialRender.current === false) {

      const getAllData = async () => {
        await getAllXmasTickets(setXmasTickets, setXmasTicketsLoaded, setXmasFilteredTickets);
        // Get kids tickets
        await getCart(setCart, setCartLoaded);
      }

      getAllData();

      return () => {
        initialRender.current = true;
      };
    }
  }, []);

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
  * Check if the component is mounted on the client side
  */
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing until client-side rendering
  }

  /**
   * Define a snackbar state object to pass to components
   * This object contains all the necessary functions and states to manage the snackbar
   * @returns {Object} snackbarState
   */
  const snackbarState = {
    snackbarOpen,
    setSnackbarOpen,
    handleSnackbarOpen,
    handleSnackbarClose,
    handleSnackbarExited,
    messageInfo,
    setSnackPack,
    snackPack
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Xmas
              xmasTickets={xmasTickets}
              filteredTickets={xmasFilteredTickets}
              setFilteredTickets={setXmasFilteredTickets}
              ticketsLoaded={xmasTicketsLoaded}
              cart={cart}
              setCart={setCart}
              snackbarState={snackbarState}
            />
          }
        />
        <Route
          path="/kids"
          element={
            <Kids
              tickets={kidsTickets}
              setTickets={setKidsTickets}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
              cartLoaded={cartLoaded}
              snackbarState={snackbarState}
            />
          }
        />
      </Routes>
    </Router>
  );
}
