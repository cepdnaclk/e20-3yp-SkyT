import { Box, Button, Divider } from "@mui/material";
import logo from "../assets/login_asserts/Logotr.png";
import { IoPower } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import { ReactElement } from "react";

interface ItemProps {
  label: string;
  icon: ReactElement;
  path: string;
}

function SideBar({ menu }: { menu: ItemProps[] }) {
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

      {menu.map((item, index) => (
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
