import { SnackbarCloseReason } from "@mui/material";
import LotteryTicket from "../classes/lotteryTicket";

/**
 * Global interfaces used by every component
 * @interface SnackbarMessage
 * @interface SnackBarStateHandler
 * @interface TicketProps
 * @interface TicketFilterProps
 * 
 * @exports SnackbarMessage
 * @exports SnackBarStateHandler
 * @exports TicketProps
 * @exports TicketFilterProps
 */
export interface SnackbarMessage {
    message: string;
    key: number;
    status: string;
}

export interface SnackBarStateHandler {
    snackbarOpen: boolean;
    setSnackbarOpen: (value: boolean) => void;
    handleSnackbarOpen: (message: string, status: string) => () => void;
    handleSnackbarClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
    handleSnackbarExited: () => void;
    messageInfo: SnackbarMessage | undefined;
    setSnackPack: (value: SnackbarMessage[]) => void;
    snackPack: readonly SnackbarMessage[];
}

export interface TicketProps {
    ticket: LotteryTicket;
    expandedState: { [key: number]: boolean };
    handleExpandClick: (ticketNumber: number) => void;
    ticketsAddedToCart: number;
    incrementTickets: () => void;
    decrementTickets: () => void;
    addTicketsToCart: () => void;
}

export interface TicketFilterProps {
    id: string;
    label: string;
    tickets: LotteryTicket[];
    setInputValue: (value: string) => void;
    inputValue: string;
    getOptionLabel: (ticket: LotteryTicket) => string | number | string[];
}

/**
 * Xmas props used by the Xmas page
 * @interface XmasDrawProps
 * @interface
 * @exports XmasProps 
 */
export interface XmasDrawProps {
    xmasTickets: LotteryTicket[];
    filteredTickets: LotteryTicket[];
    setFilteredTickets: (tickets: LotteryTicket[]) => void;
    ticketsLoaded: boolean;
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
    snackbarState: SnackBarStateHandler;
}

/**
 * Kids props used by the Kids page
 * @interface KidsDrawProps
 * @exports KidsDrawProps
 */
export interface KidsDrawProps {
    tickets: LotteryTicket[];
    setTickets: (cart: LotteryTicket[]) => void;
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
}

/**
 * Cart Props used by the CartItem component and the Cart component
 * @interface CartItemProps
 * @interface CartProps
 * @exports CartItemProps
 * @exports CartProps
 */
export interface CartItemProps {
    ticket: LotteryTicket;
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
    snackbarState: SnackBarStateHandler;
}

export interface CartProps {
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
    cartLoaded: boolean;
    snackbarState: SnackBarStateHandler;
}

/**
 * ActionButtonProps used by the ActionButton component
 * @interface ActionButtonProps
 * @exports ActionButtonProps
 */
export interface ActionButtonProps {
    onClick: () => void; // onClick can be a synchronous function
    className?: string;
    staticText: string;
    loadingText: string;
    border?: string;
    backgroundColour?: string;
    colour?: string;
    hoverColour?: string;
    hoverBackgroundColour?: string;
}

/**
 * Snackbar props used by the Snackbar component
 * @interface SnackbarProps
 * @exports SnackbarProps
 */
export interface SnackbarProps {
    snackbarOpen: boolean;
    setSnackbarOpen: (value: boolean) => void;
    handleSnackbarClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => void;
    handleSnackbarExited: () => void;
    message: string;
    snackbarKey: number;
    status: string;
}

/**
 * Login props used by the Login page
 * @interface LoginProps
 * @exports LoginProps
 */
export interface LoginProps {
    snackbarState: SnackBarStateHandler;
}






