"use client";
import React, { useEffect, useState } from 'react';

export default function NotFound() {
    useEffect(() => {
        window.location.href = '/';
    }, []);

    return (
        <></>
    );
}