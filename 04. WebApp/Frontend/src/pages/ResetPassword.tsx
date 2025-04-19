import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import logo from "../assets/login_asserts/Logotr.png";
import FillButton from "../components/FillButton";
import TextBox from "../components/TextBox";
import { postData } from "../api/NodeBackend";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { token } = useParams();

  //console.log("Reset token: ", token);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    resetPassword();
  };

  const resetPassword = async () => {
    setLoading(true);
    const data = { newPassword, token };

    try {
      //console.log("Resetting password with token:", token);
      //console.log("New password: ", password);
      const serverResposnse = await postData(data, "auth/reset");
      if (serverResposnse.status === 200) {
        setSubmitted(true);
        console.log(serverResposnse.data.message);
        setError("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.log("Error: ", err);
      setError("Unable to reset password. Please try again later!");
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
          Reset Your Password
        </Typography>
        <Typography
          variant="body2"
          mb={2}
          fontFamily={"inherit"}
          fontWeight={500}
        >
          Enter your new password below.
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {submitted ? (
          <Alert severity="success" sx={{ mt: 4, mb: 2 }}>
            Password changed successfully!
          </Alert>
        ) : (
          <>
            <TextBox
              fullWidth
              label="New Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              error={!!error}
            />

            <TextBox
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!error}
            />

            <FillButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                padding: "0.8rem",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Change Password"
              )}
            </FillButton>
          </>
        )}
      </Box>
    </Box>
  );
}
