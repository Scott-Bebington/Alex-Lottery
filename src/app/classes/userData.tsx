import { DocumentData, DocumentReference } from "firebase/firestore";
import LotteryTicket from "./lotteryTicket";
import PendingCollection from "./pendingCollection";

/**

 */
class UserData {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  PendingCollection?: PendingCollection[];
  completedOrders?: LotteryTicket[];

  constructor(
    name: string,
    surname: string,
    email: string,
    phone?: string,
    profilePicture?: string,
    PendingCollection?: PendingCollection[],
    completedOrders?: LotteryTicket[]
  ) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.profilePicture = profilePicture;
    this.PendingCollection = PendingCollection;
    this.completedOrders = completedOrders;
  }
}



export default UserData;