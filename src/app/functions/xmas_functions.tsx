import firebaseConfig from "@/app/firebaseConfig";
import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import LotteryTicket from "../classes/lotteryTicket";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Function to get all tickets from the Xmas_Draw collection
export async function getAllXmasTickets(setXmasTickets: (tickets: LotteryTicket[]) => void, setTicketsFetched: (fetched: boolean) => void, setFilteredTickets: (tickets: LotteryTicket[]) => void) {

    // console.log("Getting Xmas tickets in function 'getAllXmasTickets'");

    const XmasDrawCollection = collection(firestore, "Xmas_Draw");

    const unsubscribe = onSnapshot(XmasDrawCollection, (snapshot) => {
        const tickets: LotteryTicket[] = [];
        for (const doc of snapshot.docs) {
            const ticket = doc.data();
            const ticketID = doc.id;

            const drawDate: Date = ticket.drawDate.toDate();
            const formattedDate = drawDate.getDay() + "-" + drawDate.getMonth() + "-" + drawDate.getFullYear();

            if (ticket.quantity === 0) {
                continue;
            }

            tickets.push(new LotteryTicket(ticket.ticketNum, formattedDate, ticket.cost, "Xmas_Draw", ticket.quantity, ticketID, ticket.productRef, ticket.image));
        }
        // console.log("Xmas tickets have been fetched");
        setXmasTickets(tickets);
        setFilteredTickets(tickets);
        setTicketsFetched(true);
    });

    return unsubscribe;
}