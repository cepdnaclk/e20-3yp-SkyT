import { Box, Paper } from "@mui/material";
import SideBar from "../components/SideBar";
import AppBar from "../components/AppBar";
import { IoNotifications, IoSpeedometer } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { MdPeopleAlt } from "react-icons/md";

const menuItems = [
  { label: "Dashboard", icon: <IoSpeedometer />, path: "/home" },
  {
    label: "Notifications",
    icon: <IoNotifications />,
    path: "/notifications",
  },
  { label: "People", icon: <MdPeopleAlt />, path: "/people" },
  { label: "Profile", icon: <FaUserCircle />, path: "/profile" },
];

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
      <SideBar menu={menuItems} />

      {/* Body */}
      <Box
        width={"calc(100% - 340px)"}
        height={"calc(100% - 50px)"}
        padding={"25px"}
      >
        <Outlet />
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
      <AppBar menu={menuItems} />

      {/* Body */}
      <Box
        width={"calc(100% - 50px)"}
        height={"calc(100% - 150px)"}
        padding={"25px"}
        overflow={"auto"}
      >
        <Outlet />
      </Box>
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
