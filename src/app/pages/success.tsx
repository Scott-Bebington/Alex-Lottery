"use client";
import React, { useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { SuccessProps } from '../interfaces/interfaces';
import { clearCart } from '../functions/cart_functions';
import { getAuth } from 'firebase/auth';
import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from 'firebase/app';
import { useNavigate } from 'react-router-dom';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Success({
  cart,
  setCart,
}: SuccessProps) {

  const initialRender = useRef<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialRender.current && auth.currentUser) {

      const runPostPurchaseCleanup = async () => {
        try {
          document.cookie = "redirectToSuccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } catch (error) {
          console.error(error);
        }
      }

      runPostPurchaseCleanup();

      setTimeout(() => {
        // close the window
        navigate('/');
      }, 5000);

      return () => {
        initialRender.current = true;
      }
    }


  }, [auth.currentUser]);

  return (
    // <main className="min-h-screen flex flex-col">
      <main className="flex flex-col justify-between" style={{ minHeight: "calc(100vh - 6rem)" }}>
      <section>
        <h1 className="text-3xl text-center font-semibold mt-8">Payment Successful</h1>
        <p className="text-center mt-4">Thank you for your purchase!</p>
        <p className="text-center mt-4">This window will close in 5 seconds and you will be redirected back</p>
      </section>
    </main>
  );
}