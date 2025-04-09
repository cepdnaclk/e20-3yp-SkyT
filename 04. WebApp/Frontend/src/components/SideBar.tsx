import { Box, Button, Divider, Typography } from "@mui/material";
import logo from "../assets/login_asserts/Logotr.png";
import { IoPower, IoSpeedometer } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { ReactElement } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

interface ItemProps {
  label: string;
  icon: ReactElement;
  path: string;
}

const menuItems = [
  { label: "Dashboard", icon: <IoSpeedometer />, path: "/home" },
  { label: "Settings", icon: <IoMdSettings />, path: "/settings" },
  { label: "Profile", icon: <FaUserCircle />, path: "/profile" },
];

function MenuItem({ label, icon, path }: ItemProps) {
  const isActive = useLocation().pathname == path;

  return (
    <Box
      component={NavLink}
      to={path}
      display="flex"
      alignItems="center"
      gap={1}
      mb={1}
      padding="10px 16px"
      width="70%"
      color={isActive ? "rgb(0,0,0)" : "rgb(0,0,0,0.5)"}
      sx={{
        cursor: "pointer",
        "&:hover": {
          color: "rgb(0,0,0)",
        },
        textDecoration: "none",
      }}
    >
      <Box
        bgcolor={"rgb(34, 197, 94)"}
        width={"5px"}
        height={"100%"}
        mr={1.5}
        borderRadius={"0px 10px 10px 0"}
      />
      {icon}
      <Typography
        fontFamily={"Montserrat"}
        variant="subtitle1"
        fontWeight={600}
      >
        {label}
      </Typography>
    </Box>
  );
}

function SideBar() {
  const navigator = useNavigate();
  return (
    <Box
      width={"250px"}
      height={"calc(100% - 40px)"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      padding={"20px"}
      borderRadius={"10px 0px 0px 10px"}
      boxShadow={3}
      fontFamily={"Montserrat"}
    >
      <Box
        component="img"
        src={logo}
        alt="logo"
        width={"90px"}
        mb={3}
        onClick={() => navigator("/home")}
        sx={{ cursor: "pointer" }}
      />

      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          path={item.path}
          label={item.label}
          icon={item.icon}
        />
      ))}

      {/* Divider & Logout */}
      <Box mt="auto">
        <Divider sx={{ my: 2, width: "200px" }} />
        <Button
          component={NavLink}
          to="/"
          fullWidth
          startIcon={<IoPower />}
          sx={{
            bgcolor: "#fff",
            color: "text.secondary",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#f5f5f5",
              color: "#000",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default SideBar;
