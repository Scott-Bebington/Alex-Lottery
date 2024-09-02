"use client";
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertColor, IconButton } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import { Fragment } from "react";

import { SnackbarProps } from '../interfaces/interfaces';

export default function CustomSnackbar({
    snackbarOpen,
    handleSnackbarClose,
    handleSnackbarExited,
    message,
    snackbarKey,
    status
}: SnackbarProps) {
    return (
        <>
            <Snackbar
                key={snackbarKey}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                TransitionProps={{ onExited: handleSnackbarExited }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                action={
                    <Fragment>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{ p: 0.5 }}
                            onClick={handleSnackbarClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Fragment>
                }
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={status as AlertColor}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </>
    )
}