import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { Button, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import Footer from '../components/footer';

// firebase.js
import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { handleSignInWithEmailAndPassword, handleSignInWithGoogle } from '../functions/profile_functions';
import { LoginProps } from '../interfaces/interfaces';


const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

function Login({
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
            onClick={() => handleSignInWithEmailAndPassword(handleSnackbarOpen, email, password, setLoginText)}
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
          onClick={() => handleSignInWithGoogle(handleSnackbarOpen)}
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

export default Login;
