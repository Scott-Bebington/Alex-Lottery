import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { AuthError, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, getAuth, GoogleAuthProvider, linkWithPopup, sendPasswordResetEmail, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import LotteryTicket from "../classes/lotteryTicket";
import PendingCollection from "../classes/pendingCollection";
import UserData from "../classes/userData";
import { SnackbarMessage } from "../interfaces/interfaces";
import { checkLoginError } from "./errorChecking";

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

export const handleSignInWithEmailAndPassword = async (handleSnackbarOpen: (arg0: string, arg1: string) => any, email: string, password: string, setLoginText: any) => {

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
    setLoginText('Logging in...');
    await firebaseSignInWithEmailAndPassword(auth, email, password);
  } catch (error: Error | any) {
    let errorMessage: SnackbarMessage = checkLoginError(error.message);
    let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
    openSnackbar();
  }

  setLoginText('Login');
};

export const handleSignInWithGoogle = async (handleSnackbarOpen: (arg0: string, arg1: string) => any) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);

    // check to see if the user exists in the users collection
    const userUID = auth.currentUser?.uid;
    const userRef = doc(collection(firestore, "users"), userUID);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      console.log("User does not exist");
      await setDoc(doc(firestore, 'users', auth.currentUser!.uid),
        {
          name: result.user.displayName?.split(' ')[0],
          surname: result.user.displayName?.split(' ')[1],
          emailLink: true,
          googleLink: false,
        },
        { merge: true }
      );
      return;
    }

    // check to see if the name field exists
    if (!userDoc.data().name) {
      console.log('Name field does not exist');
      await updateDoc(userRef, {
        name: result.user.displayName?.split(' ')[0],
      });
    }

    // check to see if the surname field exists
    if (!userDoc.data().surname) {
      console.log('Surname field does not exist');
      await updateDoc(userRef, {
        surname: result.user.displayName?.split(' ')[1],
      });
    }

    // check to see if the phone field exists
    if (!userDoc.data().phone) {
      console.log('Phone field does not exist');
      await updateDoc(userRef, {
        phone: result.user.phoneNumber,
      });
    }

    // check to see if the email and password link exists
    if (userDoc.data().emailLink === null && userDoc.data().googleLink === null) {
      console.log('Email Link does not exist');
      await updateDoc(userRef, {
        googleLink: true,
        emailLink: false,
      });
    }

    if (!userDoc.data().googleLink) {
      console.log('Google Link does not exist');
      await updateDoc(userRef, {
        googleLink: true,
      });
    }

    let openSnackbar = handleSnackbarOpen('You have been signed in with Google', 'success');
    openSnackbar();
  } catch (error: Error | any) {

    if (error.code === 'Firebase: Error (auth/cancelled-popup-request).') {
      console.log('Popup request cancelled');
      return;
    }

    let errorMessage: SnackbarMessage = checkLoginError(error.message);
    let openSnackbar = handleSnackbarOpen(errorMessage.message, 'error');
    openSnackbar();
    return;
  }
};

