import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface AlertDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ fontFamily: "Montserrat" }}
    >
      <DialogTitle
        id="alert-dialog-title"
        fontFamily={"inherit"}
        fontWeight={600}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          fontFamily={"inherit"}
          textAlign={"justify"}
          fontWeight={550}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          sx={{ fontFamily: "inherit", fontWeight: 650 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          color="error"
          sx={{ fontFamily: "inherit", fontWeight: 650 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
