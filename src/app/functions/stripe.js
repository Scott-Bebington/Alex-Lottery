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

  // const session = await stripe.checkout.sessions.create({
  //     success_url: 'http://localhost:3000/success',
  //     cancel_url: 'http://localhost:3000/cart',
  //     line_items: cartItems.map(item => ({
  //         price: item.price,
  //         quantity: item.quantity,
  //     })),
  //     mode: 'payment',
  //     client_reference_id: auth.currentUser.uid,
  // });
  const session = await stripe.checkout.sessions.create({
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancelled',
    line_items: cartItems.map(item => ({
      price: item.price,
      quantity: item.quantity,
    })),
    mode: 'payment',
    client_reference_id: auth.currentUser.uid,

    // Shipping details restricted to Spain
    // shipping_address_collection: {
    //   allowed_countries: ['ES'], // Only allow shipping to Spain
    // },
    // shipping_options: [
    //   {
    //     shipping_rate_data: {
    //       type: 'fixed_amount',
    //       fixed_amount: {
    //         amount: 500, // Shipping cost in cents (e.g., €5.00)
    //         currency: 'eur', // Set currency to Euro
    //       },
    //       display_name: 'Standard shipping',
    //       delivery_estimate: {
    //         minimum: {
    //           unit: 'business_day',
    //           value: 5,
    //         },
    //         maximum: {
    //           unit: 'business_day',
    //           value: 7,
    //         },
    //       },
    //     },
    //   },
    //   {
    //     shipping_rate_data: {
    //       type: 'fixed_amount',
    //       fixed_amount: {
    //         amount: 1000, // Shipping cost in cents (e.g., €10.00)
    //         currency: 'eur',
    //       },
    //       display_name: 'Express shipping',
    //       delivery_estimate: {
    //         minimum: {
    //           unit: 'business_day',
    //           value: 1,
    //         },
    //         maximum: {
    //           unit: 'business_day',
    //           value: 2,
    //         },
    //       },
    //     },
    //   },
    // ],
  });


  return session;
}
