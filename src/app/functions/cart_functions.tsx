import firebaseConfig from "@/app/firebaseConfig";
import { getFirestore, collection, doc, updateDoc, getDoc, addDoc, getDocs, setDoc, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import LotteryTicket from "../classes/lotteryTicket";
import { getAuth } from "firebase/auth";
import { updateXmasTicketQuantity } from "./xmas_functions";
import { get } from "http";

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
  setCart: (cart: LotteryTicket[]) => void,
  setCartLoaded: (loaded: boolean) => void
) {

  // if (auth.currentUser === null) {
  //     throw new Error("User is not logged in");
  // }

  const users = collection(firestore, "users");
  const user = doc(users, "INiMgoj9TCetIOyUKcX4bYNo2va2");

  const cart = collection(user, "Cart");

  if (cart === null) {
    console.log("Cart is empty");
    return;
  }

  const cartSnapshot = await getDocs(cart);
  const cartItems: LotteryTicket[] = [];
  cartSnapshot.forEach((doc) => {
    const ticketData = doc.data();
    const ticket = new LotteryTicket(
      ticketData.ticketNum,
      ticketData.drawDate,
      ticketData.cost,
      ticketData.type,
      ticketData.quantity,
      doc.id,
      ticketData.image
    );
    cartItems.push(ticket);
  });
  setCart(cartItems);
  setCartLoaded(true);
}

export async function getTicket(ticketID: string, ticketType: string, setTicketsLeft: (ticketsLeft: number) => void) {

  const ticket = doc(collection(firestore, ticketType), ticketID);
  // const ticketSnapshot = await getDoc(ticket);

  onSnapshot(ticket, (snapshot) => {
    const ticketData = snapshot.data();

    setTicketsLeft(ticketData?.quantity);
    
  });
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
export async function addToCart(
  selectedTicket: LotteryTicket,
  ticketsAddedToCart: number,
  cart: LotteryTicket[],
  setCart: (cart: LotteryTicket[]) => void,
  ticketType: string) {


  // CHECK TO SEE IF THE USER IS LOGGED IN
  // if (auth.currentUser === null) {
  //     throw new Error("User is not logged in");
  // }

  if (selectedTicket === null) {
    throw new Error("No ticket selected");
  }

  if (ticketsAddedToCart === 0) {
    throw new Error("No tickets added to cart");
  }

  const ticket = new LotteryTicket(selectedTicket.number, selectedTicket.date, selectedTicket.cost, ticketType, ticketsAddedToCart, selectedTicket.ticketID, selectedTicket.image);

  const existingTicket = cart.find(ticket => ticket.ticketID === selectedTicket.ticketID);
  if (existingTicket) {
    existingTicket.quantity += ticketsAddedToCart;
    setCart([...cart]);
  } else {
    setCart([...cart, ticket]);
  }

  // Do error checking to make sure there is a ticket in the db before adding to cart(check being done for redundancy)
  const ticketDetails = doc(collection(firestore, ticketType), selectedTicket.ticketID);

  const ticketSnapshot = await getDoc(ticketDetails);
  if (!ticketSnapshot.exists()) {
    throw new Error("Ticket not found in the database");
  }

  const user = collection(firestore, "users");
  const userDoc = doc(user, "INiMgoj9TCetIOyUKcX4bYNo2va2");
  const userCart = collection(userDoc, "Cart");

  // Add the ticket to the user's cart
  // First check to see if the ticket is already in the cart
  const ticketInCart = await getDoc(doc(userCart, selectedTicket.ticketID));

  if (ticketInCart.exists()) {
    console.log("Ticket is already in cart, updating quantity");
    const ticketData = ticketInCart.data();
    const newQuantity = ticketData.quantity + ticketsAddedToCart;
    await updateDoc(doc(userCart, selectedTicket.ticketID), {
      quantity: newQuantity
    });
  } else {
    console.log("Ticket not in cart, adding a new entry");

    await setDoc(doc(userCart, selectedTicket.ticketID), {
      "cost": selectedTicket.cost,
      "drawDate": selectedTicket.date,
      "image": selectedTicket.image,
      "quantity": ticketsAddedToCart,
      "ticketNum": selectedTicket.number,
      "type": ticketType
    });
  }

  // Update the quantity of the ticket in the database
  try {
    const newQuantity = selectedTicket.quantity - ticketsAddedToCart;
    updateXmasTicketQuantity(selectedTicket.ticketID, newQuantity);
  } catch (error) {
    try {
      await removeFromCart(selectedTicket);

      const existingTicket = cart.find(ticket => ticket.ticketID === selectedTicket.ticketID);
      if (existingTicket) {
        existingTicket.quantity -= ticketsAddedToCart;
        setCart([...cart]);
      } else {
        const newCart = cart.filter(ticket => ticket.ticketID !== selectedTicket.ticketID);
        setCart(newCart);
      }
    } catch (error) {
      throw new Error("Error removing ticket from cart");
    }
  }



}

export async function updateTicketInCart(ticket: LotteryTicket, newQuantity: number) {
  const user = collection(firestore, "users");
  const userDoc = doc(user, "INiMgoj9TCetIOyUKcX4bYNo2va2");
  const userCart = collection(userDoc, "Cart");

  const ticketRef = doc(userCart, ticket.ticketID);

  await updateDoc(ticketRef, {
    quantity: newQuantity
  });
}

export async function removeFromCart(ticket: LotteryTicket) {

}

export async function clearCart() {

}
