"use client";
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Xmas from './pages/xmas';
import Kids from './pages/kids';
import Cart from './pages/cart';

export default function Home() {
  // const [isClient, setIsClient] = useState(false);

  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // if (!isClient) {
  //   return null; // Render nothing until client-side rendering
  // }

  return (
    // <Router>
    //   <div>
    //     <nav className="h-12 w-full shadow-sm flex justify-evenly items-center bg-slate-800 text-white">
    //       <ul className="flex space-x-4">
    //         <li>
    //           <Link to="/">Xmas Draw</Link>
    //         </li>
    //         <li>
    //           <Link to="/kids">Kids Draw</Link>
    //         </li>
    //         <li>
    //           <Link to="/cart">Cart</Link>
    //         </li>
    //       </ul>
    //     </nav>

    //     <Routes>
    //       <Route path="/" element={<Xmas />} />
    //       <Route path="/kids" element={<Kids />} />
    //       <Route path="/cart" element={<Cart />} />
    //     </Routes>
    //   </div>
    // </Router>
    <main>
      <Xmas />
    </main>
  );
}
