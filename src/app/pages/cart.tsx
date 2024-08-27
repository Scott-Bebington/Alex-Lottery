"use client";
import React from 'react';
import Navbar from '../components/navbar';

export default function Cart() {
    return (
        <div className="h-screen w-full flex justify-center items-center">
            <Navbar />
            <h1 className="text-4xl">Cart</h1>
        </div>
    );
}