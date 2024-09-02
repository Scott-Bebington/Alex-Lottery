
import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import the 'collection' and 'doc' methods

// Initialize Firebase Admin SDK
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app);
const auth = getAuth(app);