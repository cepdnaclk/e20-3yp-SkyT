import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verifying...");

    if (!email || email.length < 3) {
      setErr(true);
    } else {
      sendLink(email);
    }
  };

  const sendLink = async (data: string) => {
    setLoading(true);

    try {
      console.log("Send reset link to:", data);
      setSubmitted(true);
      setErr(false);
    } catch (error) {
      console.log("Err:", error);
      setSubmitted(false);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        bgcolor: "hsl(0,0%,95%)",
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 380,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          bgcolor: "white",
          fontFamily: "Montserrat",
        }}
      >
        <Typography variant="h5" mb={2} fontFamily={"inherit"} fontWeight={700}>
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          mb={3}
          fontFamily={"inherit"}
          fontWeight={500}
        >
          Enter your username or registered email address. We'll send you a
          reset link.
        </Typography>

        <TextField
          fullWidth
          label="username or email address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={err}
          helperText={err && "Invalid email or username. Try again!"}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{
            mt: 3,
            backgroundColor: "#00796b",
            borderRadius: "10px",
            padding: "0.8rem",
            color: "#fff",
            fontWeight: "700",
            "&:hover": {
              backgroundColor: "#004d40",
              color: "#fff",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {submitted && (
          <Typography variant="body2" color="success.main" mt={2}>
            Reset link sent! Check your inbox.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
