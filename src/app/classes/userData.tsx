import { DocumentData, DocumentReference } from "firebase/firestore";
import LotteryTicket from "./lotteryTicket";

/**

 */
class UserData {
  name: string;
  surname: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  purchases?: LotteryTicket[];

  constructor(
    name: string,
    surname: string,
    email: string,
    phone?: string,
    profilePicture?: string,
    purchases?: LotteryTicket[]
  ) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.profilePicture = profilePicture;
    this.purchases = purchases;
  }

}

export default UserData;