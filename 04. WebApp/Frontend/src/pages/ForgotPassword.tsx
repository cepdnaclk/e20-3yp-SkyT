import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import logo from "../assets/login_asserts/Logotr.png";
import FillButton from "../components/FillButton";
import TextBox from "../components/TextBox";
import { postData } from "../api/NodeBackend";

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [err, setErr] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verifying...");

    if (!emailPattern.test(email)) {
      setErr(true);
    } else {
      sendLink(email);
    }
  };

  const sendLink = async (data: string) => {
    setLoading(true);

    try {
      console.log("Send reset link to:", data);
      const serverResponse = await postData({ email: data }, "auth/create");
      console.log("Response: ", serverResponse);

      if (serverResponse.status === 201) {
        console.log(serverResponse.data.message);
        setSubmitted(true);
        setEmail("");
        setErr(false);
      }
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
        justifyContent: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "calc(100% - 100px)",
          maxWidth: "390px",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          bgcolor: "white",
          fontFamily: "Montserrat",
        }}
      >
        <Box component="img" src={logo} alt="logo" width={"70px"} />
        <Typography variant="h5" mb={2} fontFamily={"inherit"} fontWeight={700}>
          Forgot Password
        </Typography>
        <Typography
          variant="body2"
          mb={3}
          fontFamily={"inherit"}
          fontWeight={500}
        >
          Enter your registered email address. We'll send you a reset link.
        </Typography>

        <TextBox
          fullWidth
          label="Email address"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={err}
          helperText={err && "Invalid email. Try again!"}
        />

        {submitted ? (
          <Typography variant="body2" color="success.main" mt={2}>
            Reset link sent! Check your inbox.
          </Typography>
        ) : (
          <FillButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              padding: "0.8rem",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </FillButton>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
