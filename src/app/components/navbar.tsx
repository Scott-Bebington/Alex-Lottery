"use client";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebaseConfig from '../firebaseConfig';
import { Button } from "@mui/material";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Get the current path and store it in local storage
        window.localStorage.setItem('currentPath', window.location.pathname);
        if (window.location.pathname === "/cart") {
          navigate("/login");
        }
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
