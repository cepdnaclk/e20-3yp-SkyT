import { Box, useMediaQuery } from "@mui/material";
import { LoginFormMD, LoginFormXS } from "../components/LoginForm";

import video from "../assets/login_asserts/login.mp4";

function Login() {
  const isMediumUp = useMediaQuery("(min-width:570px)");

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
            <LoginFormMD />
          ) : (
            /* other screens */
            <LoginFormXS />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
