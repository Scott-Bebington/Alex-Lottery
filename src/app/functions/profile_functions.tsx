import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import LotteryTicket from "../classes/lotteryTicket";
import { Stripe } from "stripe";
import { createCheckoutSession } from "./stripe";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

/**
 * Retrieves the user's cart from the database.
 * 
 * @param setCart - A function to update the cart.
 * @param setCartLoaded - A function to update the cartLoaded state.
 * 
 * @returns void
 * 
 */
export async function getCart(
) {

  if (auth.currentUser === null) {
    throw new Error("User is not logged in");
  }

  
}

/**
 * Adds a selected ticket to the cart.
 * 
 * @param selectedTicket - The selected ticket to be added to the cart.
 * @param ticketsAddedToCart - The number of tickets added to the cart.
 * @param cart - The current cart containing the tickets.
 * @param setCart - A function to update the cart.
 * @param ticketType - The type of the ticket.
 * 
 * @returns void
 */
export async function addPurchases(cart: LotteryTicket[]) {

  // Check if the user is logged in
  if (auth.currentUser === null) {
    throw new Error("User is not logged in");
  }

  for (const ticket of cart) {
    const userUID = auth.currentUser.uid;
    const cartCollectionRef = collection(firestore, "users", userUID, "Purchases");
    await addDoc(cartCollectionRef, {
        ticketNum: ticket.number,
        cost: ticket.cost,
        type: ticket.type,
        drawDate: ticket.date,
        image: ticket.image,
        quantity: ticket.quantity,
        productRef: ticket.productRef,
        datePurchased: new Date()
    });
  }

  console.log("Purchases added successfully");

}

export async function removePurchanse() {

  // Check if the user is logged in
  if (auth.currentUser === null) {
    throw new Error("User is not logged in");
  }

  
}

export async function clearCart(setCart: (cart: LotteryTicket[]) => void) {
  
  // Check if the user is logged in
  if (auth.currentUser === null) {
    throw new Error("User is not logged in");
  }
  
  const userUID = auth.currentUser.uid;
  
  const cartCollectionRef = collection(firestore, "users", userUID, "Cart");
  const cartDocs = await getDocs(cartCollectionRef);
  
  if (cartDocs.empty) {
    console.log("Cart is empty");
    return;
  }
  
  cartDocs.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
  
  setCart([]);
}

export async function checkout() {

  if (auth.currentUser === null) {
    throw new Error("User is not logged in");
  }

  const userUID = auth.currentUser.uid;

  const users = collection(firestore, "users");
  const user = doc(users, auth.currentUser.uid);

  const cart = collection(user, "Cart");

  if (cart === null) {
    console.log("Cart is empty");
    return;
  }

  const session = await createCheckoutSession();

  console.log(session.url);
  window.open(session.url!);


}
