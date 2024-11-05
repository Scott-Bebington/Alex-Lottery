import { addToCart, checkout, getCart, getTicket, removeFromCart } from "@/app/functions/cart_functions"; // Adjust the import based on your structure
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, onSnapshot, getDocs, runTransaction } from "firebase/firestore";
import LotteryTicket from "@/app/classes/lotteryTicket"; // Adjust this import based on your structure
import { get } from "http";
import { createCheckoutSession } from "@/app/functions/stripe"; // Adjust this import based on your structure

jest.mock('@/app/functions/stripe', () => ({
  createCheckoutSession: jest.fn(),
}));

// Mock Firebase modules
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("firebase/firestore", () => {
  const actualFirestore = jest.requireActual("firebase/firestore");
  return {
    ...actualFirestore,
    collection: jest.fn(),
    doc: jest.fn(),
    onSnapshot: jest.fn(),
    getFirestore: jest.fn(),
    getDocs: jest.fn(),
    runTransaction: jest.fn(),
  };
});

describe("getCart", () => {
  const setCart = jest.fn();
  const setCartLoaded = jest.fn();
  const mockCurrentUser = { uid: "testUser1" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
    });
  });

  test("throws error if user is not logged in", async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    await expect(getCart(setCart, setCartLoaded)).rejects.toThrow("User is not logged in");
  });

  test("handles empty cart", async () => {
    // Mock Firestore setup
    (collection as jest.Mock).mockImplementation(() => ({
      id: "Cart",
    }));

    // Mock getDocs to return an empty snapshot
    const emptySnapshot = { empty: true };
    (getDocs as jest.Mock).mockResolvedValue(emptySnapshot);

    await getCart(setCart, setCartLoaded);

    expect(setCart).toHaveBeenCalledWith([]);
    expect(setCartLoaded).toHaveBeenCalledWith(true);
  });

  test("fetches cart items", async () => {
    // Mock Firestore setup
    const ticketData = {
      ticketNum: 12345,
      drawDate: "2024-10-10",
      cost: 10,
      type: "Regular",
      quantity: 1,
      productRef: "prod123",
      image: "image-url",
    };

    (collection as jest.Mock).mockImplementation(() => ({
      id: "Cart",
    }));

    // Mock getDocs to return a non-empty snapshot
    const nonEmptySnapshot = {
      empty: false,
      forEach: jest.fn((callback) => {
        callback({
          data: () => ticketData,
          id: "ticketDocId",
        });
      }),
    };

    (getDocs as jest.Mock).mockResolvedValue(nonEmptySnapshot);

    // Mock onSnapshot to simulate receiving updates
    (onSnapshot as jest.Mock).mockImplementation((collectionRef, callback) => {
      callback({
        forEach: jest.fn((callback) => {
          callback({
            data: () => ticketData,
            id: "ticketDocId",
          });
        }),
      });
    });

    await getCart(setCart, setCartLoaded);

    expect(setCart).toHaveBeenCalledWith([
      expect.objectContaining({
        number: ticketData.ticketNum,
        date: ticketData.drawDate,
        cost: ticketData.cost,
        type: ticketData.type,
        quantity: ticketData.quantity,
        ticketID: "ticketDocId",
        productRef: ticketData.productRef,
        image: ticketData.image,
      }),
    ]);
    expect(setCartLoaded).toHaveBeenCalledWith(true);
  });
});

describe("getTicket", () => {
  const setTicketsLeft = jest.fn();
  const mockCurrentUser = { uid: "testUser1" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
    });
  });

  test("fetches ticket data", async () => {
    const ticketID = "ticket123";
    const ticketType = "Regular";
    const ticketData = {
      quantity: 5,
    };

    (doc as jest.Mock).mockImplementation(() => ({
      id: ticketID,
    }));

    // Mock onSnapshot to simulate receiving updates
    (onSnapshot as jest.Mock).mockImplementation((docRef, callback) => {
      callback({
        data: () => ticketData,
      });
    });

    await getTicket(ticketID, ticketType, setTicketsLeft);

    expect(setTicketsLeft).toHaveBeenCalledWith(ticketData.quantity);
  });

  test("handles ticket not found", async () => {
    const ticketID = "ticket123";
    const ticketType = "Regular";

    (doc as jest.Mock).mockImplementation(() => ({
      id: ticketID,
    }));

    // Mock onSnapshot to simulate receiving updates
    (onSnapshot as jest.Mock).mockImplementation((docRef, callback) => {
      callback({
        data: () => null,
      });
    });

    await getTicket(ticketID, ticketType, setTicketsLeft);

    expect(setTicketsLeft).toHaveBeenCalledWith(undefined);
  });
});

describe("addToCart", () => {
  const mockCurrentUser = { uid: "testUser1" };
  const inTicket = new LotteryTicket(12345, "2024-12-25", 20, "Xmas_Draw", 1, "ticketID_1", doc(collection(getFirestore(), "ticketID_1")), "image-url");

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
    });
  });

  test("throws error if user is not logged in", async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    await expect(addToCart(inTicket, 1)).rejects.toThrow("User is not logged in");
  });

  test("throws error if ticket ID is missing", async () => {
    const ticketWithMissingID = { ...inTicket, ticketID: "" };

    await expect(addToCart(ticketWithMissingID, 1)).rejects.toThrow("Ticket ID is missing");
  });

  test("throws error if ticket type is incorrect", async () => {
    const ticketWithInvalidType = { ...inTicket, type: "Invalid_Draw" };

    await expect(addToCart(ticketWithInvalidType, 1)).rejects.toThrow("Ticket type is missing or incorrect");
  });

  test("throws error if number of tickets added is invalid", async () => {
    await expect(addToCart(inTicket, -1)).rejects.toThrow("Number of tickets added is missing or incorrect");
  });

  test("handles adding a ticket that doesnt exist", async () => {
    const ticketData = { quantity: 1 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => false,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = addToCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Ticket does not exist");
  });

  test("handles adding a ticket thats quantity is now 0", async () => {
    const ticketData = { quantity: 0 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = addToCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Ticket quantity is missing or incorrect");
  });

  test("handles adding more tickets than are available", async () => {
    const ticketData = { quantity: 10 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = addToCart(inTicket, 15);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Not enough tickets in stock");
  });

  test("handles user updating a ticket quantity", async () => {
    const ticketData = { quantity: 1 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = addToCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).resolves.not.toThrow();
  });

  test("handles user adding a new ticket", async () => {
    const ticketData = { quantity: 1 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };

      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce(ticketDoc); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = addToCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).resolves.not.toThrow();
  });
});

describe("removeFromCart", () => {
  const mockCurrentUser = { uid: "testUser1" };
  const inTicket = new LotteryTicket(12345, "2024-12-25", 20, "Xmas_Draw", 1, "ticketID_1", doc(collection(getFirestore(), "ticketID_1")), "image-url");

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
    });
  });

  test("throws error if user is not logged in", async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    await expect(removeFromCart(inTicket, 1)).rejects.toThrow("User is not logged in");
  });

  test("throws error if ticket ID is missing", async () => {
    const ticketWithMissingID = { ...inTicket, ticketID: "" };

    await expect(removeFromCart(ticketWithMissingID, 1)).rejects.toThrow("Ticket ID is missing");
  });

  test("throws error if ticket type is incorrect", async () => {
    const ticketWithInvalidType = { ...inTicket, type: "Invalid_Draw" };

    await expect(removeFromCart(ticketWithInvalidType, 1)).rejects.toThrow("Ticket type is missing or incorrect");
  });

  test("throws error if number of tickets removed is invalid", async () => {
    await expect(removeFromCart(inTicket, -1)).rejects.toThrow("Number of tickets removed is missing or incorrect");
  });

  test("handles adding a ticket that doesnt exist", async () => {
    const ticketData = { quantity: 1 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => false,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = removeFromCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Ticket does not exist");
  });

  test("handles removing a ticket thats quantity is now 0", async () => {
    const ticketData = { quantity: 0 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = removeFromCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Ticket quantity in the cart is missing or incorrect");
  });

  test("handles removing more tickets than are in the cart", async () => {
    const ticketData = { quantity: 10 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = removeFromCart(inTicket, 15);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Not enough tickets in the cart");
  });

  test("handles user removing a ticket that doesnt exist", async () => {
    const ticketData = { quantity: 1 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };
      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce({ exists: () => false }); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = removeFromCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).rejects.toThrow("Ticket does not exist in the collection");
  });

  test("handles user removing a ticket from the cart", async () => {
    const ticketData = { quantity: 1 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };

      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce(ticketDoc); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = removeFromCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).resolves.not.toThrow();
  });

  test("handles user updating the ticket quantity", async () => {
    const ticketData = { quantity: 10 };
    const ticketRef = doc(collection(getFirestore(), inTicket.type), inTicket.ticketID);

    // Mock the transaction to simulate the ticket data
    (runTransaction as jest.Mock).mockImplementation(async (firestore, callback) => {
      // This simulates the behavior of fetching the ticket document
      const ticketDoc = {
        exists: () => true,
        data: () => ticketData,
      };

      // Mock the get method for the ticket reference
      const get = jest.fn()
        .mockResolvedValueOnce(ticketDoc) // First call for the ticket
        .mockResolvedValueOnce(ticketDoc); // Second call for the cartDoc

      await callback({
        get,
        update: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      });
    });

    // Create a promise for the first user adding the ticket
    const firstUserPromise = removeFromCart(inTicket, 1);

    // Wait for the first user to resolve
    await expect(firstUserPromise).resolves.not.toThrow();
  });
});

describe("checkout", () => {
  const mockCurrentUser = { uid: "testUser1" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({
      currentUser: mockCurrentUser,
    });
  });

  test("throws error if user is not logged in", async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({ currentUser: null });

    await expect(checkout(false)).rejects.toThrow("User is not logged in");
  });

  test("handles user checking out with an empty cart", async () => {
    // Mock Firestore setup
    (collection as jest.Mock).mockImplementation(() => ({
      id: "Cart",
    }));

    // Mock getDocs to return an empty snapshot
    const emptySnapshot = { empty: true };
    (getDocs as jest.Mock).mockResolvedValue(emptySnapshot);

    await expect(checkout(false)).rejects.toThrow("Cart is empty");
  });

  test("handles user checking out with items in the cart", async () => {
    const ticketData = {
      ticketNum: 12345,
      drawDate: "2024-10-10",
      cost: 10,
      type: "Regular",
      quantity: 1,
      productRef: "prod123",
      image: "image-url",
    };

    // Mock Firestore setup
    (collection as jest.Mock).mockImplementation(() => ({
      id: "Cart",
    }));

    const mockSession = { url: "http://localhost/" };
    (createCheckoutSession as jest.Mock).mockResolvedValue(mockSession);

    // Mock getDocs to return a non-empty snapshot
    const nonEmptySnapshot = {
      empty: false,
      forEach: jest.fn((callback) => {
        callback({
          data: () => ticketData,
          id: "ticketDocId",
        });
      }),
    };

    (getDocs as jest.Mock).mockResolvedValue(nonEmptySnapshot);

    await checkout(false);

    expect(getDocs).toHaveBeenCalled();
    expect(createCheckoutSession).toHaveBeenCalledWith(false);
    expect(window.location.href).toBe(mockSession.url);

  });
});