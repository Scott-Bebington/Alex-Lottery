import { Button } from '@mui/material';
import React from 'react';

import { ActionButtonProps } from '../interfaces/interfaces';

function ActionButton({ onClick, className, staticText, loadingText, border, backgroundColour, colour, hoverColour, hoverBackgroundColour }: ActionButtonProps) {
    const [loading, setLoading] = React.useState(false);

    function handleClick() {
        setLoading(true);
        try {
            onClick();
        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            className={`mt-small rounded p-small flex-1 ${className}`}
            onClick={handleClick} // Use handleClick here
            sx={{
                border: '1px solid ' + border,
                backgroundColor: backgroundColour,
                color: colour,
                ':hover': { backgroundColor: hoverBackgroundColour, color: hoverColour },
            }}
            disabled={loading} // Disable button while loading
        >
            {loading ? loadingText : staticText}
        </Button>
    );
}

export default ActionButton;
