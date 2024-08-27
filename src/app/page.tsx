"use client";
import React from 'react';
import XmasDraw from './pages/xmas/page';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Xmas from './pages/xmas'
import Children from './pages/children'
import Cart from './pages/cart'

export default function Home() {

  return (
    <main className="min-h-screen flex flex-col">
      {/* <XmasDraw /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Xmas />}>
            <Route path="contact" element={<Children />} />
            <Route path="*" element={<Cart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}



