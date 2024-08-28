// "use client";
// import React, { useEffect, useMemo, useRef, useState } from 'react';


// import Xmas from './pages/xmas';
// import Kids from './pages/kids';
// import Cart from './pages/cart';
// import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import LotteryTicket from './classes/lotteryTicket';

// import cong from "./firebaseConfig";
// import { getFirestore, collection, onSnapshot } from "firebase/firestore";
// import { getDatabase, ref, onValue } from "firebase/database";

// export default function Home() {
//   const [isClient, setIsClient] = useState<boolean>(false);
//   const [xmasTickets, setXmasTickets] = useState<LotteryTicket[]>([]);
//   const [kidsTickets, setKidsTickets] = useState<LotteryTicket[]>([]);
//   const [cart, setCart] = useState<LotteryTicket[]>([]);
//   const ticketsfetched = useRef<boolean>(false);

//   /*
//   * Fetching tickets from the server
//   */
//   useEffect(() => {
//     if (ticketsfetched.current === false) {
//       console.log("Fetching tickets from Firestore database");
//       const firestore = getFirestore(cong);
//       const XmasDrawCollection = collection(firestore, "Xmas_Draw");

//       const fetchXmasData = () => {
//         onSnapshot(XmasDrawCollection, (snapshot) => {
//           const data = snapshot.docs.map((doc) => doc.data());

//           const tickets: LotteryTicket[] = [];

//           if (data) {
//             for (const ticket of data) {
//               // console.log(ticket);
//               console.log(ticket.ticketNum);
//               // console.log(new Date(ticket.drawDate).toLocaleDateString('en-GB')); // format as "dd-mm-yyyy"
//               console.log(ticket.quantity);
//               console.log(ticket.cost);
//               console.log(ticket.image);

//               const drawDate: Date = ticket.drawDate.toDate();
//               const formattedDate = drawDate.getDay() + "-" + drawDate.getMonth() + "-" + drawDate.getFullYear();

//               tickets.push(new LotteryTicket(ticket.ticketNum, formattedDate, ticket.cost, "Xmas Draw", ticket.quantity, ticket.image));
//             }

//             setXmasTickets(tickets);
//           }
//         });
//       };

//       fetchXmasData();

//       return () => {
//         ticketsfetched.current = true
//       }

//     }
//   }, []);

//   /*
//   * Check if the component is mounted on the client side
//   */
//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null; // Render nothing until client-side rendering
//   }


//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <Xmas
//               tickets={xmasTickets}
//               setTickets={setXmasTickets}
//               cart={cart}
//               setCart={setCart}
//             />
//           }
//         />
//         <Route
//           path="/kids"
//           element={
//             <Kids
//               tickets={kidsTickets}
//               setTickets={setKidsTickets}
//               cart={cart}
//               setCart={setCart}
//             />
//           }
//         />
//         <Route
//           path="/cart"
//           element={
//             <Cart
//               cart={cart}
//               setCart={setCart}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

"use client";
import React, { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Outlet,
  RouterProvider,
  Link,
  createRouter,
  createRoute,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    )
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return <div className="p-2">Hello from About!</div>
  },
})

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// const rootElement = document.getElementById('app')!
// if (!rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement)
//   root.render(
//     <StrictMode>
//       <RouterProvider router={router} />
//     </StrictMode>,
//   )
// }

export default function Home() {
  const [isClient, setIsClient] = useState<boolean>(false);

  /*
  * Check if the component is mounted on the client side
  */
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing until client-side rendering
  }
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

