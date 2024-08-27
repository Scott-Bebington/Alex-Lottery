"use client";
import React, { useEffect, useState } from 'react';


import Xmas from './pages/xmas';
import Kids from './pages/kids';
import Cart from './pages/cart';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing until client-side rendering
  }
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Xmas />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
    </Router>
  );
}
