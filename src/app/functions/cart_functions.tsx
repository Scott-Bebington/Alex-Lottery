import firebaseConfig from "@/app/firebaseConfig";
import { getFirestore, collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import LotteryTicket from "../classes/lotteryTicket";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Function to get all tickets from the Xmas_Draw collection
export async function getCart() {
    
}

export async function addToCart(ticket: LotteryTicket) {
    console.log("Adding to cart");
    console.log(ticket);

    // Do error cchecking to make sure there is a ticket in thhe db before adding to cart(check being done for redundancy)
}

export async function removeFromCart(ticket: LotteryTicket) {
    
}

export async function clearCart() {
    
}
