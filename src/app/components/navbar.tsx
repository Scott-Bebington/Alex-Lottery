"use client";
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {


    return (

        <div>
            <nav className="h-12 w-full shadow-sm flex justify-evenly items-center bg-slate-800 text-white">
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/">Xmas Draw</Link>
                    </li>
                    <li>
                        <Link to="/kids">Kids Draw</Link>
                    </li>
                    <li>
                        <Link to="/cart">Cart</Link>
                    </li>
                </ul>
            </nav>


        </div>
    );
}