"use client";

import { Timestamp } from 'firebase/firestore'; // Import Firestore's Timestamp from the Firebase client SDK
import { Typography, CardActionArea, Skeleton, CardContent, Button, Tab, Tabs, tabsClasses, TextField, Avatar } from '@mui/material';
import React, { use, useEffect, useRef, useState } from 'react';
import LotteryTicket from '../classes/lotteryTicket';
import CartItem from '../components/cartItem';
import { checkout } from '../functions/cart_functions';
import { ProfileProps, SnackbarMessage } from '../interfaces/interfaces';
import cart from './cart';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UserData from '../classes/userData';
import { doc, collection, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export default function Profile({
  userData,
  setUserData,
}: ProfileProps) {

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isEdittingPersonalDetails, setIsEdittingPersonalDetails] = useState<boolean>(false);
  const [name, setName] = useState<string>(userData?.name ?? '');
  const [surname, setSurname] = useState<string>(userData?.surname ?? '');
  const [phone, setPhone] = useState<string>(userData?.phone ?? '');
  const [profilePicture, setProfilePicture] = useState<string>(userData?.profilePicture ?? '');
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser === null) {
      navigate("/login");
    }

    if (userData === null) {
      navigate("/login");
    }

  }, [auth.currentUser]);

  const updatePersonalDetails = async () => {
    const userRef = doc(collection(firestore, "users"), auth.currentUser!.uid);
    await updateDoc(userRef, {
      name: name,
      surname: surname,
      phone: phone
    });

    if (userData) {
      userData.phone = phone;
      setUserData(userData);
    }

    setIsEdittingPersonalDetails(false);
  }

  const uploadImage = async () => {

    if (file === null) {
      return;
    }

    try {
      const storageRef = ref(storage, `users/${auth.currentUser!.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log(url);

      const userRef = doc(collection(firestore, "users"), auth.currentUser!.uid);
      await updateDoc(userRef, {
        profileImage: url
      });
    } catch (error) {
      console.error(error);

    }
  }

  

  const formatDate = (date: any): string => {
    let parsedDate;

    // Check if the date is a Firestore Timestamp (from Firebase client SDK)
    if (date instanceof Timestamp) {
      parsedDate = date.toDate(); // Convert Firestore Timestamp to JavaScript Date
    } else {
      parsedDate = new Date(date); // Otherwise, try converting it to a Date
    }

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'; // Handle invalid date case
    }

    const day = String(parsedDate.getDate()).padStart(2, '0'); // Get day and pad to 2 digits
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1) and pad to 2 digits
    const year = parsedDate.getFullYear(); // Get full year

    return `${day}-${month}-${year}`;
  };






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
            <Tab label="Pending Collection" />
            <Tab label="Completed Orders" />
          </Tabs>

          {tabIndex === 0 && (

            <div>
              {isEdittingPersonalDetails && (
                <>
                  <div>
                    <Avatar src={file ? URL.createObjectURL(file) : profilePicture} sx={{ width: 100, height: 100 }} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      className="absolute bottom-0 right-0"
                      size="small"
                      onClick={() => uploadImage()}
                    >
                      Save
                    </Button>
                  </div>
                  <Typography variant="h6" className="text-center flex items-center px-small font-bold h-12">Edit Personal Details</Typography>
                  <div className="flex flex-col gap-4">
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
                      id="phone-input"
                      label="Phone (optional)"
                      variant="outlined"
                      className='w-96'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      className="mt-small w-96"
                      onClick={() => updatePersonalDetails()}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="mt-small w-96"
                      onClick={() => setIsEdittingPersonalDetails(false)}
                    >
                      Cancel
                    </Button>
                  </div>

                </>
              )}

              {!isEdittingPersonalDetails && (
                <>
                  <Avatar src={file ? URL.createObjectURL(file) : profilePicture} sx={{ width: 100, height: 100 }} />
                  <Typography variant="h6" className="text-center flex items-center px-small font-bold h-12">Personal Details</Typography>
                  <div className="flex flex-col">
                    <div className="flex">
                      <Typography variant="body1" className="font-bold pr-small">Name:</Typography>
                      <Typography variant="body1">{userData?.name}</Typography>
                    </div>
                    <div className="flex">
                      <Typography variant="body1" className="font-bold pr-small">Surname:</Typography>
                      <Typography variant="body1">{userData?.surname}</Typography>
                    </div>
                    <div className="flex">
                      <Typography variant="body1" className="font-bold pr-small">Email:</Typography>
                      <Typography variant="body1">{userData?.email}</Typography>
                    </div>
                    {userData?.phone && (
                      <div className="flex">
                        <Typography variant="body1" className="font-bold pr-small">Phone:</Typography>
                        <Typography variant="body1">{userData?.phone}</Typography>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-small"
                    onClick={() => setIsEdittingPersonalDetails(true)}
                  >
                    Edit Details
                  </Button>

                </>
              )}

            </div>
          )}

          {tabIndex === 1 && (
            <div>
              {userData?.PendingCollection?.map((pendingCollection, index) => (
                <div key={index}>
                  <Typography variant="h6" className="text-center flex items-center px-small font-bold h-12">Date purchased: {formatDate(pendingCollection.purchaseDate)}</Typography>
                  {pendingCollection.items.map((ticket, index) => (
                    <div key={index}>
                      <Typography variant="body1" className="flex items-center gap-4">Ticket Number: {ticket.number} - Draw Date: {ticket.date}</Typography>
                    </div>


                  ))}
                </div>
              ))}


            </div>
          )}




        </div>
      </section>
    </ main >

  )
}