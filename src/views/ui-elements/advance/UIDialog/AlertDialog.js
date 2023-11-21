import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

// ===============================|| UI DIALOG - SWEET ALERT ||=============================== //

export default function AlertDialog({openLabel='Enregistrer', title='Confirmation',
                                        message = 'Confirmez-vous l\'enregistrement ?',actionDisabled=true,
                                        type='submit', confirmLabel='Confirmer', cancelLabel='Annuler', handleConfirmation}) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onConfirm = ()=>
    {
        handleConfirmation();
        setOpen(false);
    }
    return (
        <>
            <Button disabled={actionDisabled} variant="outlined" onClick={handleClickOpen}>
                {openLabel}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 3 }}
            >
                {open && (
                    <>
                        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="body2" component="span">
                                    {message}
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button
                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                onClick={handleClose}
                                color="secondary"
                            >
                                {cancelLabel}
                            </Button>
                            <Button variant="contained" size="small" type={type} onClick={onConfirm} autoFocus>
                                {confirmLabel}
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}
