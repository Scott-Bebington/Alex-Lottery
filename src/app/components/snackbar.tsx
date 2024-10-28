"use client";
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertColor, Button, IconButton } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import { Fragment } from "react";

import { SnackbarProps } from '../interfaces/interfaces';
import React from 'react';

export default function CustomSnackbar({
    snackbarOpen,
    handleSnackbarClose,
    handleSnackbarExited,
    message,
    snackbarKey,
    status
}: SnackbarProps) {

    const action = (
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      );

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
                    action
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