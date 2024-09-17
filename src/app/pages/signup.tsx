import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

// firebase.js
import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";
import { checkLoginError } from '../functions/errorChecking';

import { Link, useNavigate } from 'react-router-dom';
import { LoginProps, SnackbarMessage } from '../interfaces/interfaces';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';



const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export default function Signup({
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

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signupText, setsignupText] = useState<string>('Create Account');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSignUp = async () => {

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

        if (name === '' || surname === '') {
            var errorMessage: SnackbarMessage = {
                message: "Please enter your name and surname",
                key: 0,
                status: "error"
            };
            let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
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
            setsignupText('Creating your account...');




            await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(firestore, 'users', auth.currentUser!.uid),
                {
                    email: email,
                    name: name,
                    surname: surname
                },
                { merge: true }
            );


            // set the display name of the user
            await updateProfile(auth.currentUser!, {
                displayName: name + ' ' + surname
            });


        } catch (error: Error | any) {
            let errorMessage: SnackbarMessage = checkLoginError(error.message);
            let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
            openSnackbar();
            return;
        }

        setsignupText('Create Account');
        let openSnackbar = handleSnackbarOpen('Account created successfully', 'success');
        openSnackbar();
    };

    return (
        <main className="min-h-screen flex flex-col justify-between">

            <section className="flex flex-1 gap-4 flex-col w-full items-center justify-center">
                <Typography variant="h5" className="text-center flex items-center px-small font-bold h-12">Create your account</Typography>
                <TextField
                    id="name-input"
                    label="Name"
                    variant="outlined"
                    className='w-96'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    id="surname-input"
                    label="Surname"
                    variant="outlined"
                    className='w-96'
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                />
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
                        onClick={handleSignUp}
                    >
                        {signupText}
                    </Button>
                    <Button
                        sx={{
                            padding: '0',
                            margin: '0',
                            backgroundColor: 'transparent',
                        }}
                    >
                        <Link to='/login' className='text-gray-400 text-small'>Already have an account? Login</Link>
                    </Button>
                </div>

            </section>

            <Footer />
        </ main>
    );
}
