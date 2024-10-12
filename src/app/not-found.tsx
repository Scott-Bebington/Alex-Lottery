"use client";
import React, { useEffect, useState } from 'react';

export default function NotFound() {
    useEffect(() => {

        console.log("Not found page loaded");
        console.log("Pathname: ", window.location.pathname);

        if (window.location.pathname === "/success") {
            console.log("Redirecting to home page");
            window.location.href = '/?redirect=success';
        } else if (window.location.pathname === "/cancelled") {
            console.log("Redirecting to home page");
            window.location.href = '/?redirect=cancel';
        } else {
            console.log("Redirecting to home page");
            window.location.href = '/';
        }
        // window.location.href = 'http://localhost:3000?redirect=notfound';
    }, []);

    return (
        <></>
    );
}