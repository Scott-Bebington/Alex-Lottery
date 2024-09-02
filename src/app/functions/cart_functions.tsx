import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, doc, getFirestore, onSnapshot, runTransaction } from "firebase/firestore";
import LotteryTicket from "../classes/lotteryTicket";

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
    setCartLoaded(true);
    return;
  }

  onSnapshot(cart, (snapshot) => {
    const cartItems: LotteryTicket[] = [];
    snapshot.forEach((doc) => {
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
  });
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
export async function addToCart(inTicket: LotteryTicket, ticketsAdded: number) {

  // Check if the user is logged in
  // if (auth.currentUser === null) {
  //     throw new Error("User is not logged in");
  // }

  // Check to see if the ticket is not null or empty
  if (!inTicket || inTicket.ticketID === "") {
    throw new Error("Ticket ID is missing");
  }

  // Check to see if the ticket type is not null or empty
  if (!inTicket.type || (inTicket.type !== "" && inTicket.type !== "Xmas_Draw" && inTicket.type !== "Kids_Draw")) {
    throw new Error("Ticket type is missing or incorrect");
  }

  // Check to see if the number of tickets added is not null or empty
  if (!ticketsAdded || ticketsAdded <= 0) {
    throw new Error("Number of tickets added is missing or incorrect");
  }

  await runTransaction(firestore, async (transaction) => {

    // Get the ticket document
    const ticketRef = doc(collection(firestore, inTicket.type), inTicket.ticketID);
    const ticketDoc = await transaction.get(ticketRef);

    // Check if the ticket exists
    if (!ticketDoc.exists()) {
      throw new Error("Ticket does not exist");
    }

    // Get the ticket data
    const ticketData = ticketDoc.data();

    // Check if the ticket quantity is not null or empty
    if (!ticketData.quantity || ticketData.quantity <= 0) {
      throw new Error("Ticket quantity is missing or incorrect");
    }

    // Check if the ticket quantity is greater than the number of tickets added
    if (ticketData.quantity < ticketsAdded) {
      throw new Error("Not enough tickets in stock");
    }

    // Check to see if the ticket is already in the cart
    const cartRef = doc(collection(firestore, "users", "INiMgoj9TCetIOyUKcX4bYNo2va2", "Cart"), inTicket.ticketID);
    const cartDoc = await transaction.get(cartRef);

    // Check if the ticket is already in the cart
    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const newQuantity = cartData.quantity + ticketsAdded;
      transaction.update(cartRef, { quantity: newQuantity });
    } else {
      transaction.set(cartRef, {
        cost: inTicket.cost,
        drawDate: inTicket.date,
        quantity: ticketsAdded,
        image: inTicket.image,
        ticketNum: inTicket.number,
        type: inTicket.type
      });
    }

    // Update the ticket quantity
    const newQuantity = ticketData.quantity - ticketsAdded;
    transaction.update(ticketRef, { quantity: newQuantity });
  });

}

export async function removeFromCart(inTicket: LotteryTicket, ticketsRemoved: number) {

  // Check if the user is logged in
  // if (auth.currentUser === null) {
  //     throw new Error("User is not logged in");
  // }

  // Check to see if the ticket is not null or empty
  if (!inTicket || inTicket.ticketID === "") {
    throw new Error("Ticket ID is missing");
  }

  // Check to see if the ticket type is not null or empty
  if (!inTicket.type || (inTicket.type !== "" && inTicket.type !== "Xmas_Draw" && inTicket.type !== "Kids_Draw")) {
    throw new Error("Ticket type is missing or incorrect");
  }

  // Check to see if the number of tickets removed is not null or empty
  if (!ticketsRemoved || ticketsRemoved <= 0) {
    throw new Error("Number of tickets removed is missing or incorrect");
  }

  await runTransaction(firestore, async (transaction) => {

    // Get the cart document
    const cartRef = doc(collection(firestore, "users", "INiMgoj9TCetIOyUKcX4bYNo2va2", "Cart"), inTicket.ticketID);
    const cartDoc = await transaction.get(cartRef);

    // Check if the ticket exists in the cart
    if (!cartDoc.exists()) {
      throw new Error("Ticket does not exist in the cart");
    }

    // Get the cart data
    const cartData = cartDoc.data();

    // Check if the ticket quantity in the cart is not null or empty
    if (!cartData.quantity || cartData.quantity <= 0) {
      throw new Error("Ticket quantity in the cart is missing or incorrect");
    }

    // Check if the number of tickets removed is greater than the quantity in the cart
    if (cartData.quantity < ticketsRemoved) {
      throw new Error("Not enough tickets in the cart");
    }

    // Check to see if the ticket is already in the collection
    const ticketRef = doc(collection(firestore, inTicket.type), inTicket.ticketID);
    const ticketDoc = await transaction.get(ticketRef);

    // Check if the ticket exists in the collection
    if (!ticketDoc.exists()) {
      throw new Error("Ticket does not exist in the collection");
    }

    // Get the ticket data
    const ticketData = ticketDoc.data();

    // Update the ticket quantity in the collection
    const newQuantity = ticketData.quantity + ticketsRemoved;
    transaction.update(ticketRef, { quantity: newQuantity });

    // Update the ticket quantity in the cart
    const newCartQuantity = cartData.quantity - ticketsRemoved;
    if (newCartQuantity === 0) {
      transaction.delete(cartRef);
    } else {
      transaction.update(cartRef, { quantity: newCartQuantity });
    }
  });
}

export async function clearCart() {

}
