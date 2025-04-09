import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FaUserShield } from "react-icons/fa6";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import logo from "../assets/login_asserts/Logotr.png";

interface credentials {
  username: string | null;
  password: string | null;
}

function validateLogin({ username, password }: credentials) {
  let err = false;

  if (username == null || username.length < 3) err = true;

  if (password == null || password.length < 6) err = true;

  return err;
}

function login() {
  console.log("logging");
}

export function LoginFormMD() {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Checking credentials");

    const err = validateLogin({ username, password });

    if (err) {
      setError("Invalid credentials!");
    } else {
      setError(null);
      login();
    }
  };

  return (
    <Grid container width={"100%"} height={"100%"} bgcolor={"rgb(0,0,0,0.1)"}>
      {/* Left side */}
      <Grid size={6} p={2}>
        <Box
          color={"white"}
          textAlign={"center"}
          height={"calc(100% - 60px)"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "25px",
                lg: "35px",
              },
              fontWeight: 800,
            }}
            fontFamily={"Montserrat"}
          >
            Smarter Skies, Greener Growth
          </Typography>
          <Typography padding={"1rem"} fontWeight={400}>
            Elevating Precision Agriculture into new heights!
          </Typography>
        </Box>

        <Box
          sx={{
            padding: "0 1rem",
            height: "60px",
            background: "rgba(255,255,255,0.248)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(1px)",
            borderRadius: "10px",
            width: "calc(100% - 30px)",
            color: "white ",
          }}
        >
          <Typography variant="body2">Don't have an account?</Typography>
          <Button
            component={NavLink}
            to="/register"
            variant="contained"
            color="success"
            sx={{
              width: "120px",
              background: "#fff",
              color: "#00796b",
              borderRadius: "10px",
              fontWeight: 400,
              height: "40px",
              "&:hover": {
                background: "#004d40",
                color: "#fff",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Grid>

      {/* Right side */}
      <Grid
        size={6}
        bgcolor={"hsl(0,0%,95%)"}
        height={"100%"}
        overflow={"auto"}
      >
        <Container
          sx={{
            height: "100%",
            minHeight: "450px",
            width: "80%",
            minWidth: "270px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            p: 1,
          }}
        >
          <Box textAlign="center" overflow={"auto"}>
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{ width: { xs: "70px", lg: "90px" } }}
            />
            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  lg: "25px",
                },
                fontWeight: 600,
              }}
              fontFamily={"Montserrat"}
            >
              Welcome Back!
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Typography variant="subtitle2" textAlign={"center"} mb={2}>
              Enter your credentials to Log In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUserShield />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsFillShieldLockFill />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              endIcon={<AiOutlineSwapRight />}
              sx={{
                mt: 1,
                backgroundColor: "#00796b",
                borderRadius: "10px",
                padding: { xs: 1, lg: "0.8rem" },
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
              Forgot your password? <NavLink to={"/reset"}>Click here</NavLink>
            </Typography>
          </form>
        </Container>
      </Grid>
    </Grid>
  );
}

export function LoginFormXS() {
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Checking credentials");

    const err = validateLogin({ username, password });

    if (err) {
      setError("Invalid credentials!");
    } else {
      setError(null);
      login();
    }
  };

  return (
    <Grid container width={"100%"} spacing={2}>
      {/* Top */}
      <Grid size={12} p={2}>
        <Box
          textAlign={"center"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            sx={{
              fontSize: "25px",
              fontWeight: 600,
            }}
            fontFamily={"Montserrat"}
          >
            Smarter Skies, Greener Growth
          </Typography>
          <Typography padding={"0.7rem"} fontWeight={300}>
            Elevating Precision Agriculture into new heights!
          </Typography>
        </Box>
      </Grid>

      {/* Middle side */}
      <Grid size={12}>
        <Container
          sx={{
            bgcolor: "hsl(0,0%,95%)",
            width: "80%",
            minWidth: "320px",
            borderRadius: "10px",
            p: 3,
          }}
        >
          <Box textAlign="center">
            <Box component="img" src={logo} alt="logo" width={"70px"} />
            <Typography
              fontSize={"18px"}
              fontWeight={600}
              fontFamily={"Montserrat"}
            >
              Welcome Back!
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Typography variant="subtitle2" textAlign={"center"} mb={2}>
              Enter your credentials to Log In
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaUserShield />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <BsFillShieldLockFill />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              endIcon={<AiOutlineSwapRight />}
              sx={{
                mt: 1,
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
              Forgot your password? <NavLink to={"/reset"}>Click here</NavLink>
            </Typography>
          </form>
        </Container>
      </Grid>

      {/* Bottom */}
      <Grid size={12} p={2} display={"flex"} justifyContent={"center"}>
        <Box
          sx={{
            padding: "0 1rem",
            height: "60px",
            background: "rgba(255,255,255,0.248)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(1px)",
            borderRadius: "10px",
            width: "80%",
            color: "white ",
          }}
        >
          <Typography variant="body2">Don't have an account?</Typography>
          <Button
            component={NavLink}
            to="/register"
            variant="contained"
            color="success"
            sx={{
              width: "120px",
              background: "#fff",
              color: "#00796b",
              borderRadius: "10px",
              fontWeight: 300,
              height: "40px",
              "&:hover": {
                background: "#004d40",
                color: "#fff",
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
