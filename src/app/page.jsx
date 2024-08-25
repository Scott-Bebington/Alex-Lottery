"use client";
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function Home() {
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const filtered = tickets.filter(ticket =>
      ticket.number.toString().includes(inputValue)
    );
    setFilteredTickets(filtered);
  }, [inputValue]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-96">
        <Autocomplete
          id="free-solo-demo"
          freeSolo
          options={tickets.map((ticket) => ticket.number.toString())}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lottery Ticket Number"
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
        />
        <div className="mt-4">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <div key={index} className="mt-4 p-4 border rounded shadow-sm flex flex-row items-start">

                {ticket.image && (
                  <div className="mt-2">
                    <h3 className="font-semibold">Image:</h3>
                    <img src={ticket.image} alt={`Ticket ${ticket.number}`} className="w-20 h-20 object-cover" />
                  </div>
                )}

                <div className="ml-4">
                  <h2 className="text-lg font-semibold">Ticket Details</h2>
                  <p><strong>Number:</strong> {ticket.number}</p>
                  <p><strong>Date:</strong> {ticket.date}</p>
                  <p><strong>Cost:</strong> ${ticket.cost}</p>
                  <p><strong>Type:</strong> {ticket.type}</p>
                  <p><strong>Quantity:</strong> {ticket.quantity}</p>
                </div>


              </div>
            ))
          ) : (
            <div className="mt-4 p-4 border rounded shadow-sm">
              <h2 className="text-lg font-semibold">No Tickets match the entered value</h2>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * @param {number} number - The lottery ticket number
 * @param {string} date - The date of the lottery ticket
 * @param {number} cost - The cost of the lottery ticket
 * @param {string} type - The type of the lottery (e.g., "Powerball")
 * @param {number} quantity - The quantity of tickets purchased
 * @param {string[]} [images] - An array of image paths for the lottery ticket (optional)
 */
class LotteryTicket {
  constructor(number, date, cost, type, quantity, image = null) {
    this.number = number;
    this.date = date;
    this.cost = cost;
    this.type = type;
    this.quantity = quantity;
    this.image = image;
  }
}

// Tickets sample values
const tickets = [
  new LotteryTicket(43840, "2021-10-10", 3, "Powerball", 3, "/Images/Tickets/43840.jpeg"),
  new LotteryTicket(75685, "2021-10-11", 5, "Mega Millions", 2, "/Images/Tickets/75685.jpeg"),
  new LotteryTicket(43842, "2021-10-12", 2, "Powerball", 1),
];
