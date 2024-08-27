"use client";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import { Alert, AlertColor, IconButton } from "@mui/material";
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Fragment, useEffect, useState } from "react";
import React from 'react';

interface SnackbarProps {
    snackbarOpen: boolean;
    setSnackbarOpen: (value: boolean) => void;
    handleSnackbarClose: (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason,) => void;
    handleSnackbarExited: () => void;
    message: string;
    snackbarKey: number;
    status: string;
}

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