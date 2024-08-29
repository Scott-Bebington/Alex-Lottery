/**
 * @param {number} number - The lottery ticket number
 * @param {string} date - The date of the lottery ticket
 * @param {number} cost - The cost of the lottery ticket
 * @param {string} type - The type of the lottery (e.g., "Powerball")
 * @param {number} quantity - The quantity of tickets purchased
 * @param {string[]} [images] - An array of image paths for the lottery ticket (optional)
 */
class LotteryTicket {
  number: number;
  date: string;
  cost: number;
  type: string;
  quantity: number;
  image: string | undefined; // Optional type for image, as it may not always be provided
  ticketID: string;

  constructor(
    number: number,
    date: string,
    cost: number,
    type: string,
    quantity: number,
    ticketID: string,
    image?: string // Optional parameter

  ) {
    this.number = number;
    this.date = date;
    this.cost = cost;
    this.type = type;
    this.quantity = quantity;
    this.image = image;
    this.ticketID = ticketID;
  }
}

export default LotteryTicket;