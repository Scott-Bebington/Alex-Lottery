"use client";
import React from 'react';

export default function Cart() {

    // Check if the document object is available (i.e., client-side)
    if (typeof window === 'undefined') {
        return null; // Render nothing or a fallback component
    }

    return (
        <div>
            <h1>Cart Page</h1>
            <p>Your shopping cart is empty</p>
        </div>
    );
}