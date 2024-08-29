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

export default function Home() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [kidsTickets, setKidsTickets] = useState<LotteryTicket[]>([]);
  const [cart, setCart] = useState<LotteryTicket[]>([]);

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
              // tickets={xmasTickets}
              // setTickets={setXmasTickets}
              cart={cart}
              setCart={setCart}
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
            />
          }
        />
      </Routes>
    </Router>
  );
}
