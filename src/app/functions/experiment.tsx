
import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, runTransaction, collection, doc } from "firebase/firestore"; // Import the 'collection' and 'doc' methods
import LotteryTicket from "../classes/lotteryTicket";

// Initialize Firebase Admin SDK
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app);
const auth = getAuth(app);