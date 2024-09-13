"use client";
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
// import { pages } from "next/dist/build/templates/app-page";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import firebaseConfig from '../firebaseConfig';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Spa } from '@mui/icons-material';

const pages = ['Xmas Draw', 'Kids Draw', 'Cart', 'Success'];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

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

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // Get the current path and store it in local storage
        window.localStorage.setItem('currentPath', window.location.pathname);
        if (window.location.pathname === "/cart") {
          // navigate("/login");
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return (
    <AppBar position="sticky" className='h-12 w-full shadow-sm' sx={{ backgroundColor: "" }}>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>

      <div className='hidden lg:block'>
        <div className='h-12 flex items-center justify-between'>
          <img src="/images/General/Logo.jpg" alt="logo" width={50} height={50} />
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
            <li>
              <Link to="/success">Success</Link>
            </li>
          </ul>
        </div>

      </div>

      <div className='hidden md:block lg:hidden'>
        Medium
      </div>

      <div className='block md:hidden'>
        Small
      </div>

    </AppBar>
  );
}
