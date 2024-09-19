import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, runTransaction, setDoc } from "firebase/firestore";
import LotteryTicket from "../classes/lotteryTicket";
import { Stripe } from "stripe";
import { createCheckoutSession } from "./stripe";
import UserData from "../classes/userData";
import PendingCollection from "../classes/pendingCollection";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

/**
 * Retrieves the user's information from the database.
 * 
 * @param setUserDetails - A function to update the cart.
 * @param setUserDetailsLoaded - A function to update the cartLoaded state.
 * 
 * @returns void
 * 
 */
export async function getUserDetails(setUserDetails: (userDetails: any) => void, setUserDetailsLoaded: (userDetailsLoaded: boolean) => void) {

  if (auth.currentUser === null) {
    throw new Error("User is not logged in");
  }

  const userUID = auth.currentUser.uid!;
  const userRef = doc(collection(firestore, "users"), userUID);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    console.log("User does not exist");
    return;
  }

  // Listen to real-time updates on the PendingCollection subcollection
  const pendingCollectionRef = collection(userRef, "PendingCollection");

  const unsubscribe = onSnapshot(pendingCollectionRef, (snapshot) => {
    if (snapshot.empty) {
      console.log("No pending purchases found.");
      return;
    }

    const pendingCollectionData: PendingCollection[] = [];

    snapshot.forEach((doc) => {
      const tempPendingCollectionTickets: LotteryTicket[] = [];

      doc.data().items.forEach((inTicket: any) => {
        const ticket = new LotteryTicket(
          inTicket.ticketNum,
          inTicket.drawDate,
          inTicket.cost,
          inTicket.type,
          inTicket.quantity,
          inTicket.ticketId,
          inTicket.productRef,
          inTicket.image
        );
        tempPendingCollectionTickets.push(ticket);
      });

      const datePurchased: Date = doc.data().dateOfPurchase;

      const newPendingCollection: PendingCollection = new PendingCollection(tempPendingCollectionTickets, datePurchased);
      pendingCollectionData.push(newPendingCollection);
    });

    const userData: UserData = new UserData(
      userDoc.data().name,
      userDoc.data().surname,
      userDoc.data().email,
      userDoc.data().phone,
      userDoc.data().profileImage,
      pendingCollectionData
    );

    setUserDetails(userData);
    setUserDetailsLoaded(true); // Mark user details as loaded once we have the data
  }, (error) => {
    console.error("Error listening to pending collection:", error);
    setUserDetailsLoaded(false); // Handle error in loading
  });

  // Return unsubscribe function to stop listening to changes when the component unmounts
  return unsubscribe;

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
  // window.open(session.url!);
  window.location.href = session.url!;


}
