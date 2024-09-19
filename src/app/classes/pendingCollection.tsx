import LotteryTicket from "./lotteryTicket";

class PendingCollection {
  items: LotteryTicket[];
  purchaseDate: Date;

  constructor(items: LotteryTicket[], purchaseDate: Date) {
    this.items = items;
    this.purchaseDate = purchaseDate;
  }
}

export default PendingCollection;