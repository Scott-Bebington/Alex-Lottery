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

interface SnackbarMessage {
  message: string;
  key: number;
  status: string;
}

export default function Home() {
  const [isClient, setIsClient] = useState<boolean>(false);

  /*
  * Snackbar state management
  */
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

  const [xmasTickets, setXmasTickets] = useState<LotteryTicket[]>([]);
  const [xmasFilteredTickets, setXmasFilteredTickets] = useState<LotteryTicket[]>([]);
  const [xmasTicketsLoaded, setXmasTicketsLoaded] = useState<boolean>(false);



  const [kidsTickets, setKidsTickets] = useState<LotteryTicket[]>([]);
  const [kidsFilteredTickets, setKidsFilteredTickets] = useState<LotteryTicket[]>([]);
  const [kidsTicketsLoaded, setKidsTicketsLoaded] = useState<boolean>(false);


  const [cart, setCart] = useState<LotteryTicket[]>([]);
  const [cartLoaded, setCartLoaded] = useState<boolean>(false);
  const initialRender = useRef<boolean>(false);

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
  * Check if the component is mounted on the client side
  */
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing until client-side rendering
  }




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
              
            />
            // <Cart 
            //   cart={cart}
            //   setCart={setCart}
            //   cartLoaded={cartLoaded}
            // />
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
            // <Xmas
            //   xmasTickets={xmasTickets}
            //   filteredTickets={xmasFilteredTickets}
            //   setFilteredTickets={setXmasFilteredTickets}
            //   ticketsLoaded={xmasTicketsLoaded}
            //   cart={cart}
            //   setCart={setCart}
            // />
            <Cart
              cart={cart}
              setCart={setCart}
              cartLoaded={cartLoaded}
            />
          }
        />
      </Routes>
    </Router>
  );
}
