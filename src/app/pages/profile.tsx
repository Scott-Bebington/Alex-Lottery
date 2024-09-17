"use client";

import { Typography, CardActionArea, Skeleton, CardContent, Button, Tab, Tabs, tabsClasses } from '@mui/material';
import React, { use, useEffect, useRef, useState } from 'react';
import LotteryTicket from '../classes/lotteryTicket';
import CartItem from '../components/cartItem';
import { checkout } from '../functions/cart_functions';
import { SnackbarMessage } from '../interfaces/interfaces';
import cart from './cart';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Profile() {

  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser === null) {
      navigate("/login");
    }
  }, [auth.currentUser]);

  return (
    <main className="flex flex-col" style={{ minHeight: "calc(100vh - 6rem)" }}>
      <Typography variant="h5" className="text-center flex items-center px-small font-bold h-12">Your Profile</Typography>
      <section className="flex flex-1 w-full">
        <div
          className="w-full p-small overflow-y-auto bg-white mx-small mb-small rounded"
          style={{ maxHeight: "calc(100vh - 9rem)", alignItems: "flex-start" }}
        >

          <Tabs
            value={tabIndex}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 },
              },
            }}
          >
            <Tab label="Personal Details" />
            <Tab label="Tickets Purchased" />
          </Tabs>

          {tabIndex === 0 && (
            <div>
              
            </div>
          )}

          {tabIndex === 1 && (
            <div>
              Tickets purchased
            </div>
          )}




        </div>
      </section>
    </ main>

  )
}