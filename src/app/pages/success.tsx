"use client";
import React, { useEffect, useRef } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { SuccessProps } from '../interfaces/interfaces';
import { clearCart } from '../functions/cart_functions';
import { getAuth } from 'firebase/auth';
import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from 'firebase/app';
import { addPurchases } from '../functions/profile_functions';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Success({
  cart,
  setCart,
}: SuccessProps) {

  const initialRender = useRef<boolean>(false);

  useEffect(() => {
    if (!initialRender.current && auth.currentUser) {

      const runPostPurchaseCleanup = async () => {
        try {
          await addPurchases(cart);
          await clearCart(setCart);

          // delete the redirectToSuccess cookie
          document.cookie = "redirectToSuccess=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } catch (error) {
          console.error(error);
        }
      }

      runPostPurchaseCleanup();

      return () => {
        initialRender.current = true;
      }
    }


  }, [auth.currentUser]);

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <section>
        <h1 className="text-3xl text-center font-semibold mt-8">Payment Successful</h1>
        <p className="text-center mt-4">Thank you for your purchase!</p>
      </section>
      <Footer />
    </main>
  );
}