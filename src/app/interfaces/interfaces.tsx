import { SnackbarCloseReason } from "@mui/material";
import LotteryTicket from "../classes/lotteryTicket";
import UserData from "../classes/userData";

// #region Global Interfaces
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
// #endregion

// #region XmasDrawProps
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
    navbarProps: NavbarProps;
}
// #endregion

// #region KidsDrawProps
/**
 * Kids props used by the Kids page
 * @interface KidsDrawProps
 * @exports KidsDrawProps
 */
export interface KidsDrawProps {
    kidsTickets: LotteryTicket[];
    filteredTickets: LotteryTicket[];
    setFilteredTickets: (tickets: LotteryTicket[]) => void;
    ticketsLoaded: boolean;
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
    snackbarState: SnackBarStateHandler;
    navbarProps: NavbarProps;
}
// #endregion

// #region CartProps
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
// #endregion

// #region ActionButtonProps
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
// #endregion

// #region SnackbarProps
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
// #endregion

// #region LoginProps
/**
 * Login props used by the Login page
 * @interface LoginProps
 * @exports LoginProps
 */
export interface LoginProps {
    snackbarState: SnackBarStateHandler;
}
// #endregion

// #region SuccessProps
/**
 * Payment success props used by the Success page
 * @interface SuccessProps
 * @exports SuccessProps
 */
export interface SuccessProps {
    cart: LotteryTicket[];
    setCart: (cart: LotteryTicket[]) => void;
}
// #endregion

// #region NavbarProps
/**
 * Navbar props used by the Navbar component
 * @interface NavbarProps
 * @exports NavbarProps
 */
export interface NavbarProps {
    user: any;
    setUser: (user: any) => void;
    history: string[];
    setHistory: (history: string[]) => void;
}
// #endregion

// #region ProfileProps
/**
 * Profile props used by the Profile page
 * @interface ProfileProps
 * @exports ProfileProps
 */
export interface ProfileProps {
    userData: UserData | null;
    setUserData: (userData: UserData) => void;
}
// #endregion


