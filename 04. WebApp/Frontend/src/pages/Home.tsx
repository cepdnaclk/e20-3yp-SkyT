import { Box, Paper } from "@mui/material";
import SideBar from "../components/SideBar";

function DesktopView() {
  return (
    <Paper
      elevation={2}
      sx={{
        display: { xs: "none", md: "flex" },
        width: "calc(100% - 40px)",
        height: "calc(100% - 40px)",
        borderRadius: "10px",
      }}
    >
      {/* Sidebar */}
      <SideBar />

      {/* Body */}
      <Box
        height={"100%"}
        bgcolor={"rebeccapurple"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"calc(100%)"}
      >
        body
      </Box>
    </Paper>
  );
}

function MobileView() {
  return (
    <Box
      sx={{ display: { xs: "block", md: "none" } }}
      width={"100%"}
      height={"100%"}
    >
      {/* App bar */}
      {/* Body */}
    </Box>
  );
}

function Home() {
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {/* Desktop View */}
      <DesktopView />

      {/* Mobile View */}
      <MobileView />
    </Box>
  );
}

export default Home;
