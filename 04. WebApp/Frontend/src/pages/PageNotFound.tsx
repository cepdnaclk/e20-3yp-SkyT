import { Box, Button, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function PageNotFound() {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      color="#00796b"
      fontFamily={"Montserrat"}
    >
      <Typography variant="h1" fontWeight={800} fontFamily={"inherit"}>
        404
      </Typography>
      <Typography
        variant="h4"
        mt={2}
        mb={1}
        fontFamily={"inherit"}
        fontWeight={600}
      >
        Oops! Page not found.
      </Typography>
      <Typography
        variant="body1"
        mb={4}
        fontFamily={"inherit"}
        fontWeight={500}
      >
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        component={NavLink}
        to="/home"
        variant="contained"
        sx={{
          backgroundColor: "#00796b",
          borderRadius: "10px",
          padding: "0.8rem",
          color: "#fff",
          width: "120px",
          fontWeight: "700",
          "&:hover": {
            backgroundColor: "#004d40",
            color: "#fff",
          },
        }}
      >
        Go Home
      </Button>
    </Box>
  );
}
