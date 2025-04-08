import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Link as MuiLink,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { FaUserShield } from "react-icons/fa6";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";

import video from "../assets/login_asserts/login.mp4";
import logo from "../assets/login_asserts/Logotr.png";

const credentials = {
  username: "admin",
  password: "admin",
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and Password are required!");
      return;
    }
    verify();
  };

  const verify = () => {
    if (
      username === credentials.username &&
      password === credentials.password
    ) {
      alert("Login Successful!");
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left side with video and text */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          position: "relative",
          display: { xs: "none", md: "block" },
          height: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 7px 50px rgb(217,223,213)",
        }}
      >
        <video
          src={video}
          autoPlay
          muted
          loop
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "#fff",
            padding: 4,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Smarter Skies, Greener Growth
            </Typography>
            <Typography>
              Elevating Precision Agriculture into new heights!
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="body2">Don’t have an account?</Typography>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                background: "#fff",
                color: "#00796b",
                padding: "0.8rem 1.5rem",
                borderRadius: "10px",
                fontWeight: 400,
                "&:hover": {
                  background: "#004d40",
                  color: "#fff",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Grid>

      {/* Right side with form */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              borderRadius: "10px",
              background: "hsl(0,0%,95%)",
              boxShadow: "0 7px 50px rgb(217,223,213)",
            }}
          >
            <Box textAlign="center" mb={3}>
              <img src={logo} alt="logo" style={{ width: "90px" }} />
              <Typography variant="h5" mt={2}>
                Welcome Back!
              </Typography>
            </Box>

            <form onSubmit={handleLogin}>
              <Typography variant="body1" mb={2}>
                Enter your credentials to Log In
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUserShield />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsFillShieldLockFill />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                endIcon={<AiOutlineSwapRight />}
                sx={{
                  marginTop: 2,
                  backgroundColor: "#00796b",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#004d40",
                    color: "#fff",
                  },
                }}
              >
                Login
              </Button>

              <Typography variant="body2" align="center" mt={2}>
                Forgot your password?{" "}
                <MuiLink href="#" underline="hover">
                  Click here
                </MuiLink>
              </Typography>
            </form>
          </Paper>
        </Container>
      </Grid>
    </Grid>
  );
};

export default Login;
