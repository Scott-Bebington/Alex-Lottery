"use client";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import firebaseConfig from '../firebaseConfig';
import { Button } from "@mui/material";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log('User is already logged in');
        // console.log('Name: ', user.displayName);
        setUser(user);
      } else {
        console.log('No user is logged in');
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

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
          {user ? (
            <>
              <li>
                <span>{user.displayName}</span>
              </li>
              <li>
                <Button
                  size="small"
                  onClick={async () => {
                    try {
                      await auth.signOut();

                      return;
                    } catch (error: Error | any) {
                      console.error(error.message);
                      return;
                    }
                  }}
                >
                  Logout
                </Button>
              </li>
            </>

          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
