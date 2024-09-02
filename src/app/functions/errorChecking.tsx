import { SnackbarMessage } from "../interfaces/interfaces";

export function checkErrorMessage(message: string): SnackbarMessage {

    var returnMessage: SnackbarMessage = {
        message: "",
        key: 0,
        status: "error"
    };

    if (message === "User is not logged in") {
        returnMessage.message = "Please log in before adding items to cart";
    } else if (message === "Ticket ID is missing") {
        returnMessage.message = "No ticket selected";
    } else if (message === "Ticket type is missing or incorrect") {
        returnMessage.message = "Error adding tickets to cart";
    } else if (message === "Number of tickets added is missing or incorrect") {
        returnMessage.message = "No tickets added to cart";
    } else if (message === "Number of tickets removed is missing or incorrect") {
        returnMessage.message = "No tickets removed from cart";
    } else if (message === "Ticket does not exist") {
        returnMessage.message = "This ticket has been sold out";
    } else if (message === "Ticket does not exist in the cart") {
        returnMessage.message = "Ticket does not exist in the cart";
    } else if (message === "Ticket quantity is missing or incorrect") {
        returnMessage.message = "Please add a ticket";
    } else if (message === "Not enough tickets in stock") {
        returnMessage.message = "Not enough tickets in stock";
    } else if (message === "Missing or insufficient permissions") {
        returnMessage.message = "Ticket may be sold out";
    } else if (message === "Ticket quantity in the cart is missing or incorrect") {
        returnMessage.message = "Ticket quantity in the cart is incorrect";
    } else if (message === "Not enough tickets in the cart") {
        returnMessage.message = "Not enough tickets in the cart";
    } else if (message === "Ticket does not exist in the collection") {
        returnMessage.message = "Ticket does not exist";
    } else {
        returnMessage.message = message;
    }
    return returnMessage;
}

export function checkLoginError(message: string): SnackbarMessage {

    var returnMessage: SnackbarMessage = {
        message: "",
        key: 0,
        status: "error"
    };

    if (message === "Firebase: Error (auth/invalid-credential).") {
        returnMessage.message = "Login credentials are incorrect";
    } else if (message === "Firebase: Error (auth/user-not-found).") {
        returnMessage.message = "User not found";
    } else if (message === "Firebase: Error (auth/invalid-password).") {
        returnMessage.message = "Password is incorrect";
    } else if (message === "Firebase: Error (auth/too-many-requests).") {
        returnMessage.message = "Too many login attempts. Please try again later";
    } else if (message === "Firebase: Error (auth/network-request-failed).") {
        returnMessage.message = "Network error. Please try again later";
    } else if (message === "Firebase: Error (auth/invalid-email).") {
        returnMessage.message = "Invalid email address";
    }
    else {
        returnMessage.message = message;
    }
    return returnMessage;
}