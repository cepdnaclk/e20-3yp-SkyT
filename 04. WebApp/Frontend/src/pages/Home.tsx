import { Box, Paper } from "@mui/material";
import SideBar from "../components/SideBar";
import AppBar from "../components/AppBar";
import { IoNotifications, IoSpeedometer } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { MdPeopleAlt } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { ReactElement } from "react";

interface ItemProps {
  label: string;
  icon: ReactElement;
  path: string;
}

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

const protectedItems = ["people"];

const allowedUsers = ["owner", "admin"];

function DesktopView({ menu }: { menu: ItemProps[] }) {
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
      <SideBar menu={menu} />

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

function MobileView({ menu }: { menu: ItemProps[] }) {
  return (
    <Box
      sx={{ display: { xs: "block", md: "none" } }}
      width={"100%"}
      height={"100%"}
    >
      {/* App bar */}
      <AppBar menu={menu} />

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
  const { user } = useAuth();

  const filterdItems = menuItems.filter(
    (item) =>
      !allowedUsers.includes(user!.role.toLowerCase()) &&
      !protectedItems.includes(item.label.toLowerCase())
  );

  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      {/* Desktop View */}
      <DesktopView menu={filterdItems} />

      {/* Mobile View */}
      <MobileView menu={filterdItems} />
    </Box>
  );
}

export default Home;
