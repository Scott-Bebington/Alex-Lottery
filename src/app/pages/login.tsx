import { Button, Divider, FormControl, Icon, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ControlPointSharp, Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';

// firebase.js
import { initializeApp } from "firebase/app";
import { fetchSignInMethodsForEmail, getAuth, linkWithPopup } from "firebase/auth";
import firebaseConfig from "@/app/firebaseConfig";
import { checkLoginError } from '../functions/errorChecking';

import { signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { LoginProps, SnackbarMessage } from '../interfaces/interfaces';
import firebase from 'firebase/compat/app';
import { Link, useNavigate } from 'react-router-dom';
import { doc, collection, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export default function Login({
  snackbarState: {
    snackbarOpen,
    setSnackbarOpen,
    handleSnackbarOpen,
    handleSnackbarClose,
    handleSnackbarExited,
    messageInfo,
    snackPack
  }
}: LoginProps) {

  // #region Signin

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginText, setLoginText] = useState<string>('Login');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSignInWithEmailAndPassword = async () => {

    if (auth.currentUser) {
      console.log('User is already logged in');
      console.log("Email: ", auth.currentUser.email);
      var errorMessage: SnackbarMessage = {
        message: "You are already logged in",
        key: 0,
        status: "success"
      };
      let openSnackbar = handleSnackbarOpen(errorMessage.message, 'success');
      openSnackbar();
      return;
    }

    if (!email || !password) {
      var errorMessage: SnackbarMessage = {
        message: "Please enter your email and password",
        key: 0,
        status: "error"
      };
      let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
      openSnackbar();
      return;
    }

    if (email === '' || password === '') {
      var errorMessage: SnackbarMessage = {
        message: "Please enter your email and password",
        key: 0,
        status: "error"
      };
      let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
      openSnackbar();
      return;
    }

    try {
      setLoginText('Logging in...');
      await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error: Error | any) {
      let errorMessage: SnackbarMessage = checkLoginError(error.message);
      let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
      openSnackbar();
    }

    setLoginText('Login');
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);

      // check to see if the user exists in the users collection
      const userUID = auth.currentUser?.uid;
      const userRef = doc(collection(firestore, "users"), userUID);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.log("User does not exist");
        await setDoc(doc(firestore, 'users', auth.currentUser!.uid),
          {
            name: result.user.displayName?.split(' ')[0],
            surname: result.user.displayName?.split(' ')[1],
            emailLink: true,
            googleLink: false,
          },
          { merge: true }
        );
        return;
      }

      // check to see if the name field exists
      if (!userDoc.data().name) {
        console.log('Name field does not exist');
        await updateDoc(userRef, {
          name: result.user.displayName?.split(' ')[0],
        });
      }

      // check to see if the surname field exists
      if (!userDoc.data().surname) {
        console.log('Surname field does not exist');
        await updateDoc(userRef, {
          surname: result.user.displayName?.split(' ')[1],
        });
      }

      // check to see if the phone field exists
      if (!userDoc.data().phone) {
        console.log('Phone field does not exist');
        await updateDoc(userRef, {
          phone: result.user.phoneNumber,
        });
      }

      // check to see if the email and password link exists
      if (userDoc.data().emailLink === null && userDoc.data().googleLink === null) {
        console.log('Email Link does not exist');
        await updateDoc(userRef, {
          googleLink: true,
          emailLink: false,
        });
      }

      if (!userDoc.data().googleLink) {
        console.log('Google Link does not exist');
        await updateDoc(userRef, {
          googleLink: true,
        });
      }

      let openSnackbar = handleSnackbarOpen('You have been signed in with Google', 'success');
      openSnackbar();
    } catch (error: Error | any) {

      if (error.code === 'Firebase: Error (auth/cancelled-popup-request).') {
        console.log('Popup request cancelled');
        return;
      }

      let errorMessage: SnackbarMessage = checkLoginError(error.message);
      let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
      openSnackbar();
      return;
    }
  };

  // #endregion
  

  const signOut = async () => {
    var redirectPath = window.localStorage.getItem('redirectAfterLogin');
    console.log('Redirect path: ', redirectPath);


  }

  return (
    <main className="min-h-screen flex flex-col justify-between">

      <section className="flex flex-1 gap-4 flex-col w-full items-center justify-center">
        <Typography variant="h5" className="text-center flex items-center px-small font-bold h-12">Login</Typography>
        <TextField
          id="email-input"
          label="Email"
          variant="outlined"
          className='w-96'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div>
          <FormControl variant="outlined" className='w-96'>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </div>

        <div className='w-96 flex flex-col justify-end'>
          <Button
            className='w-96'
            sx={{
              backgroundColor: '#1e293b',
              color: 'white'
            }}
            onClick={handleSignInWithEmailAndPassword}
          >
            {loginText}
          </Button>
          <Link to='/signup' className='text-gray-400 text-small'>Dont have an account? Sign up</Link>
        </div>

        <Divider className='w-96 text-gray-400' >
          or
        </Divider>

        <Button
          className='w-96'
          sx={{
            backgroundColor: 'transparent',
            color: '#1e293b',
            border: '1px solid #1e293b'
          }}
          startIcon={<GoogleIcon />}
          onClick={handleSignInWithGoogle}
        >
          Continue with Google
        </Button>

        <Button
          className='w-96'
          sx={{
            backgroundColor: 'transparent',
            color: '#1e293b',
            border: '1px solid #1e293b'
          }}
          onClick={signOut}
        >
          Sign out
        </Button>

      </section>

      <Footer />
    </ main>
  );
}
