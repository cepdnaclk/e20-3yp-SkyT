import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper, { PaperProps } from "@mui/material/Paper";
import Draggable from "react-draggable";
import { Stack, Typography } from "@mui/material";
import LetterAvatar from "./LetterAvatar";

interface messageProps {
  msgId: number;
  title: string;
  message: string;
  time: string;
  sender: string;
  isRead: boolean;
}

interface MessageDialogProps {
  message: messageProps;
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

function PaperComponent(props: PaperProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}

export default function MessageDialog({
  open,
  message,
  handleClose,
  handleDelete,
}: MessageDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
        display={"flex"}
        justifyContent={"space-between"}
        fontFamily={"Montserrat"}
      >
        <Stack direction={"row"} alignItems={"center"}>
          <LetterAvatar
            alt={message.sender}
            text={message.sender}
            style={{ width: 45, height: 45, marginRight: "16px" }}
          />

          <Stack>
            <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
              {message.sender}
            </Typography>

            <Typography
              color="text.secondary"
              fontFamily={"inherit"}
              variant="subtitle1"
              fontWeight={500}
            >
              {message.title}
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {message.time}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <DialogContentText textAlign={"justify"}>
          {message.message}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>

        <Button onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
