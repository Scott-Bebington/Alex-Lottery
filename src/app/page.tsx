"use client";
import React, { useEffect, useMemo, useState } from 'react';


import Xmas from './pages/xmas';
import Kids from './pages/kids';
import Cart from './pages/cart';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LotteryTicket from './classes/lotteryTicket';

export default function Home() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [xmasTickets, setXmasTickets] = useState<LotteryTicket[]>([]);
  const [kidsTickets, setKidsTickets] = useState<LotteryTicket[]>([]);
  const [cart, setCart] = useState<LotteryTicket[]>([]);

  const tickets: LotteryTicket[] = [
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
  ]

  /*
  * Fetching tickets from the server
  */
  useEffect(() => {
    setTimeout(() => {
      setXmasTickets(tickets);
      setKidsTickets(tickets);
    }, 2000);
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
              tickets={xmasTickets}
              setTickets={setXmasTickets}
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
