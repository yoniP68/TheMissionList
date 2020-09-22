import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from '@material-ui/core/Button';


export default function AlertMassage({ message }) {
    const [open, setOpen] = React.useState(true);
    function handleClose(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                variant="warning"
                ContentProps={{
                    "aria-describedby": "message-id"
                }}
                message={message}
                action={[
                    <Button color="secondary" size="small" onClick={handleClose}>
                        UNDO
                    </Button>
                ]}
            />
        </div>
    );
}
