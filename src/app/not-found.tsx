"use client";
import React, { useEffect, useState } from 'react';

export default function NotFound() {
    useEffect(() => {

        if (window.location.pathname === '/success') {
            window.localStorage.setItem('paymentSuccess', window.location.pathname);
        }
        
        window.location.href = '/';
    }, []);

    return (
        <></>
    );
}