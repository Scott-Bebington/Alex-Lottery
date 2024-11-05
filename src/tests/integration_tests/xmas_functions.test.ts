// __tests__/getAllXmasTickets.test.ts
import { getAllXmasTickets } from "../../app/functions/xmas_functions";
import { onSnapshot, collection, getFirestore } from "firebase/firestore";
import LotteryTicket from "@/app/classes/lotteryTicket";

// Mock Firebase dependencies
jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
    onSnapshot: jest.fn(),
    collection: jest.fn(),
    getFirestore: jest.fn(),
  };
});

describe("getAllXmasTickets", () => {
  const setXmasTicketsMock = jest.fn();
  const setTicketsFetchedMock = jest.fn();
  const setFilteredTicketsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and set tickets correctly", async () => {
    const mockTickets = [
      {
        ticketNum: "001",
        drawDate: { toDate: () => new Date("2024-12-25") },
        cost: 10,
        quantity: 2,
        productRef: "ref1",
        image: "image1.png",
      },
      {
        ticketNum: "002",
        drawDate: { toDate: () => new Date("2024-12-26") },
        cost: 15,
        quantity: 1,
        productRef: "ref2",
        image: "image2.png",
      },
      {
        ticketNum: "003",
        drawDate: { toDate: () => new Date("2024-12-27") },
        cost: 20,
        quantity: 0,
        productRef: "ref3",
        image: "image3.png",
      }
    ];

    // Mock onSnapshot to simulate Firestore snapshot data
    (onSnapshot as jest.Mock).mockImplementation((_, callback) => {
      const docs = mockTickets.map((data, index) => ({
        data: () => data,
        id: `ticket-${index + 1}`,
      }));

      callback({ docs });
      return jest.fn(); // unsubscribe function
    });

    await getAllXmasTickets(setXmasTicketsMock, setTicketsFetchedMock, setFilteredTicketsMock);

    // Verify setXmasTickets and setFilteredTickets were called with formatted LotteryTicket instances
    expect(setXmasTicketsMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.any(LotteryTicket),
      ])
    );
    expect(setFilteredTicketsMock).toHaveBeenCalledWith(expect.arrayContaining([expect.any(LotteryTicket)]));
    expect(setTicketsFetchedMock).toHaveBeenCalledWith(true);
  });
});
