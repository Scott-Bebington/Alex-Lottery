"use client";
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
// import { pages } from "next/dist/build/templates/app-page";
import React, { use, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebaseConfig from '../firebaseConfig';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Spa } from '@mui/icons-material';
import { NavbarProps } from '../interfaces/interfaces';

const pages = ['Xmas Draw', 'Kids Draw', 'Cart', 'Success'];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Navbar({
  user,
  setUser,
  history,
  setHistory
}: NavbarProps) {

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem key={"Xmas_Draw"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AcUnitIcon />
            </ListItemIcon>
            <ListItemText primary={"Xmas Draw"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Kids_Draw"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LocalActivityOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Kids Draw"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key={"Cart"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ShoppingCartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary={"Cart"} />
          </ListItemButton>
        </ListItem>
      </List>

    </Box>
  );

  const showHistory = () => {
    console.log(history);
  };


  const navigate = useNavigate();

  const pushLocation = (location: string) => {
    setHistory([...history, location]);
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        setUser(user);
        if (history.length > 0) {
          navigate(history[history.length - 1]);
        } else {
          if (document.cookie.includes("redirectToSuccess=true")) {
            navigate("/success");
          } else {
            navigate("/");
          }
        }
      } else {
        if (history.length > 0 && history[history.length - 1] === "/cart") {
          navigate("/login");
        }

        if (history.length > 0 && history[history.length - 1] === "/login") {
          navigate("/");
        }
      }


    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [history]);

  return (
    <AppBar position="sticky" className='h-12 w-full shadow-sm' sx={{ backgroundColor: "" }}>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      {/* <div className='hidden lg:block'> */}
      <div>
        <div className='h-12 flex items-center justify-between px-2'>
          <img src="/images/General/Logo.jpg" alt="logo" width={50} height={50} />
          <ul className="flex space-x-4">
            <li>
              <Link to="/" onClick={() => pushLocation("/")}>Xmas Draw</Link>
            </li>
            <li>
              <Link to="/kids" onClick={() => pushLocation("/kids")}>Kids Draw</Link>
            </li>
            <li>
              <Badge badgeContent={4} color="error">
                <Link to="/cart" onClick={() => pushLocation("/cart")}>Cart</Link>
                <ShoppingCartOutlinedIcon sx={{ width: '15px' }} />
              </Badge>

            </li>
            <li>
              <Link to="/success" onClick={() => pushLocation("/success")}>Success</Link>
            </li>
          </ul>
          <ul className="flex space-x-4">
            {user ? (
              <>
                <li>
                  <Link to="/profile">{user.displayName}</Link>
                </li>
                <li>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={async () => {
                      try {
                        await auth.signOut();
                        setUser(null);
                        return;
                      } catch (error: Error | any) {
                        console.error(error.message);
                        return;
                      }
                    }}
                  >
                    Logout
                  </Typography>
                </li>
              </>

            ) : (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <Typography>/</Typography>
                <li>
                  <Link to="/signup">Sign up</Link>
                </li>

              </>

            )}
          </ul>


        </div>


      </div>

      {/* <div className='hidden md:block lg:hidden'>
        Medium
      </div>

      <div className='block md:hidden'>
        Small
      </div> */}

    </AppBar>
  );
}
