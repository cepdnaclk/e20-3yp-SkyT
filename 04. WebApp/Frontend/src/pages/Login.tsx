import { Box, useMediaQuery } from "@mui/material";
import { LoginFormMD, LoginFormXS } from "../components/LoginForm";

import video from "../assets/login_asserts/login.mp4";
import { useState } from "react";
import { postData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth, UserProps } from "../context/AuthContext";

interface credentials {
  email: string;
  password: string;
}

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateLogin({ email, password }: credentials) {
  let err = false;

  if (!emailPattern.test(email)) err = true;

  if (!password || password.length < 6) err = true;

  return err;
}

function Login() {
  const isMediumUp = useMediaQuery("(min-width:570px)");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const login = async () => {
    console.log("Logging...");
    setLoading(true);

    const data = { email, password };

    try {
      const serverResponse = await postData(data, "users/login");
      console.log("Server Response: ", serverResponse.data.message);

      const token = serverResponse.data.token;
      const user = serverResponse.data.payload as UserProps;

      setUser(user);
      sessionStorage.setItem("token", token);

      navigate("/home");
    } catch (err) {
      const error = err as AxiosError;
      const status = error.response?.status;

      if (status === 404 || status === 401) {
        setError("Invalid credentials!");
      } else {
        setError("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Checking credentials");

    const err = validateLogin({ email, password });

    if (err) {
      setError("Invalid credentials!");
    } else {
      setError(null);
      login();
    }
  };

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "60%",
          },
          height: {
            xs: "100vh",
            md: "75vh",
          },
          borderRadius: {
            xs: "0",
            md: "10px",
          },
          overflow: "hidden",
          boxShadow: {
            md: "0 7px 50px rgb(217,223,213)",
          },
          position: "relative",
        }}
      >
        {/* Background Video */}
        <video
          src={video}
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />

        {/* Content on top of the video */}
        <Box
          position={"relative"}
          zIndex={1}
          width={"100%"}
          height={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={"rgb(0,0,0,0.1)"}
        >
          {isMediumUp ? (
            /* for medeium or above screens */
            <LoginFormMD
              email={email}
              password={password}
              error={error}
              loading={loading}
              show={show}
              setShow={setShow}
              setEmail={setEmail}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          ) : (
            /* other screens */
            <LoginFormXS
              email={email}
              password={password}
              loading={loading}
              error={error}
              show={show}
              setShow={setShow}
              setEmail={setEmail}
              setPassword={setPassword}
              handleLogin={handleLogin}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
