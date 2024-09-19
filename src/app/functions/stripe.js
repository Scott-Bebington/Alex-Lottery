const { getRemoteConfig, getValue, fetchAndActivate, getString } = require('firebase/remote-config');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, getDoc } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
const firebaseConfig = require('../firebaseConfig').default;

// Initialize Firebase Admin SDK for accessing Remote Config
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export const createCheckoutSession = async () => {
    if (!auth.currentUser) {
        throw new Error("User is not logged in");
    }

    const cartItems = [];

    // Get all items in the cart
    const cartItemsQuery = collection(db, 'users', auth.currentUser.uid, 'Cart');
    const cartItemsSnapshot = await getDocs(cartItemsQuery);

    for (const doc of cartItemsSnapshot.docs) {
        const ticketData = doc.data();
        const productRef = ticketData.productRef;
        const productDoc = await getDoc(productRef);

        const pricesCollection = collection(productDoc.ref, "prices");
        const pricesSnapshot = await getDocs(pricesCollection);

        pricesSnapshot.forEach((priceDoc) => {
            cartItems.push({
                price: priceDoc.id,
                quantity: ticketData.quantity,
            });
        });
    }

    if (cartItems.length === 0) {
        throw new Error("No items found in cart.");
    }

    const remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

    await fetchAndActivate(remoteConfig)
    const stripeSecretKey = getString(remoteConfig, 'STRIPE_SECRET_KEY');
    const stripe = require('stripe')(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cart',
        line_items: cartItems.map(item => ({
            price: item.price,
            quantity: item.quantity,
        })),
        mode: 'payment',
        client_reference_id: auth.currentUser.uid,
    });

    return session;
}
