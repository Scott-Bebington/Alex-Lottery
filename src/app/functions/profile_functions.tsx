import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { AuthError, EmailAuthProvider, getAuth, GoogleAuthProvider, linkWithCredential, linkWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, runTransaction, setDoc, updateDoc } from "firebase/firestore";
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
      const userData: UserData = new UserData(
        userDoc.data().name,
        userDoc.data().surname,
        userDoc.data().email,
        userDoc.data().emailLink,
        userDoc.data().googleLink,
        userDoc.data().phone,
        userDoc.data().profileImage
      );

      setUserDetails(userData);
      setUserDetailsLoaded(true);
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
      userDoc.data().emailLink,
      userDoc.data().googleLink,
      userDoc.data().phone,
      userDoc.data().profileImage,
      pendingCollectionData
    );

    setUserDetails(userData);
    setUserDetailsLoaded(true);
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

export async function linkGoogleToEmailProvider() {
  try {

    if (auth.currentUser === null) {
      throw new Error('No user signed in.');
      return;
    }
    // Sign in with email/password
    // const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // const user = userCredential.user;

    const userUID = auth.currentUser.uid!;
    const userRef = doc(collection(firestore, "users"), userUID);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("User does not exist");
      return;
    }

    const user = auth.currentUser;

    // If the user exists, create a GoogleAuthProvider instance
    const googleProvider = new GoogleAuthProvider();

    // Link Google provider to the signed-in user
    const linkedCredential = await linkWithPopup(user, googleProvider);

    console.log("Google account successfully linked to existing email provider.");
    console.log(linkedCredential);

    // You can now access the linked Google credentials if needed
    const linkedUser = linkedCredential.user;
    console.log("Linked User:", linkedUser);

    await updateDoc(userRef, {
      googleLink: true,
      emailLink: true,
    });

  } catch (error: AuthError | any) {
    console.error("Error linking Google provider:", error);
    if (error.code === 'auth/credential-already-in-use') {
      // Handle case where the Google account is already linked to another account
      console.error("This Google account is already linked with another user.");
    } else {
      console.error("Something went wrong while linking:", error.message);
    }
  }
};

// Function to link email/password provider to a Google-signed-in user
export async function linkEmailToGoogleProvider(email: string) {
  try {

    if (auth.currentUser === null) {
      throw new Error('No user signed in.');
      return;
    }

    const userUID = auth.currentUser.uid!;
    const userRef = doc(collection(firestore, "users"), userUID);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("User does not exist");
      return;
    }

    const user = auth.currentUser;

    sendPasswordResetEmail(auth, email);

    await updateDoc(userRef, {
      googleLink: true,
      emailLink: true,
    });

  } catch (error: AuthError | any) {
    console.error('Error linking email/password provider:', error);
    if (error.code === 'auth/email-already-in-use') {
      // Handle case where the email is already linked with another account
      console.error('This email is already linked to another account.');
    } else {
      console.error('Something went wrong while linking:', error.message);
    }
  }
};

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully.");
  } catch (error: AuthError | any) {
    console.error("Error sending password reset email:", error);
  }
}

