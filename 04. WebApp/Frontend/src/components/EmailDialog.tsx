import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import TextBox from "./TextBox";

interface EmailVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
  onResend: () => void;
  code: string;
  setCode: (code: string) => void;
}

interface SixDigitInputProps {
  value: string;
  onChange: (value: string) => void;
  error: boolean;
}

const TIME_OUT = 120; // in seconds

const SixDigitInput: React.FC<SixDigitInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d?$/.test(char)) return; // Only digits or empty

    const newValue = value.split("");
    newValue[index] = char;
    const updated = newValue.join("");
    onChange(updated);

    // Focus next input
    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      const newValue = value.split("");
      newValue[index - 1] = "";
      onChange(newValue.join(""));
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    }
  };

  return (
    <Box display="flex" gap={1} justifyContent="center" mt={1}>
      {[...Array(6)].map((_, i) => (
        <TextBox
          key={i}
          inputRef={(el) => (inputsRef.current[i] = el)}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          error={error}
          slotProps={{
            htmlInput: {
              maxLength: 1,
              style: {
                textAlign: "center",
                fontSize: "1rem",
                width: "2rem",
              },
            },
          }}
        />
      ))}
    </Box>
  );
};

const EmailDialog: React.FC<EmailVerificationDialogProps> = ({
  open,
  onClose,
  onSubmit,
  onResend,
  code,
  setCode,
}) => {
  const [error, setError] = useState<boolean>(false);
  const [enable, setEnable] = useState<boolean>(false);

  const handleSubmit = () => {
    if (code.length !== 6) {
      setError(true);
      return;
    }
    onSubmit(code);
    setCode("");
  };

  const handleClose = () => {
    setCode("");
    setError(false);
    onClose();
  };

  useEffect(() => {
    if (!enable) {
      const timeout = setTimeout(() => {
        setEnable(true);
      }, 1000 * TIME_OUT);

      return () => clearTimeout(timeout); // Cleanup on re-render
    }
  }, [enable]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle fontFamily={"Montserrat"} fontWeight={600}>
        Verify Your Email
      </DialogTitle>

      <DialogContent sx={{ fontFamily: "Montserrat", textAlign: "center" }}>
        <Typography
          variant="body2"
          mb={2}
          fontFamily={"inherit"}
          fontWeight={500}
        >
          Enter the 6-digit code sent to your new email address.
        </Typography>

        <SixDigitInput value={code} onChange={setCode} error={error} />

        <Box mt={2}>
          <Button
            onClick={() => {
              setEnable(false);
              onResend();
            }}
            size="small"
            sx={{ color: "gray" }}
            disabled={!enable}
          >
            Resend Code
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          color="success"
          variant="contained"
          disabled={code.length < 6}
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailDialog;
