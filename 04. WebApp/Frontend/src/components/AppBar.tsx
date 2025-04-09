import {
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { ReactElement, useState } from "react";
import MenuItem from "./MenuItem";
import { NavLink } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../assets/login_asserts/Logotr.png";
import IconMenu from "./IconMenu";

// Width of the drawer
const drawerWidth = 230;

interface ItemProps {
  label: string;
  icon: ReactElement;
  path: string;
}

const msgCount = 10;

export default function AppBar1({ menu }: { menu: ItemProps[] }) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  //const [msgCount, setMessageCount] = useState<number>(0);

  return (
    <AppBar position="sticky" color="default">
      <Toolbar
        sx={{
          px: 2,
          py: 1,
          height: 9,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Menu Icon */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon sx={{ fontSize: 30 }} />
        </IconButton>

        {/* User profile */}
        <Stack direction={"row"} gap={1} alignItems={"center"}>
          <Badge
            component={NavLink}
            to={"/notifications"}
            badgeContent={msgCount}
            color="primary"
          >
            <NotificationsIcon color="action" sx={{ fontSize: 30 }} />
          </Badge>

          <IconMenu />
        </Stack>

        {/* Drawer */}
        <Drawer
          anchor="left"
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "ghostwhite",
            },
          }}
        >
          <Box
            role="presentation"
            display={"flex"}
            flexDirection={"column"}
            alignItems={"end"}
          >
            <IconButton
              sx={{ m: 1, mb: 2 }}
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon sx={{ fontSize: 30, color: "black" }} />
            </IconButton>

            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              width={"100%"}
            >
              <Box
                component="img"
                src={logo}
                alt="logo"
                width={"90px"}
                mb={3}
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
            </Box>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
