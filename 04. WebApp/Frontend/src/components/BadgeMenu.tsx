import * as React from "react";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { FaUserCircle } from "react-icons/fa";
import { IoPower } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function BadgeMenu({ msgCount }: { msgCount: number }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigator = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Loging Out");
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Badge badgeContent={msgCount} color="primary" max={9}>
              <NotificationsIcon color="action" sx={{ fontSize: 30 }} />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: "120px",
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => navigator("/profile")}
          sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
        >
          <FaUserCircle style={{ marginRight: 8 }} /> Profile
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
        >
          <IoPower style={{ marginRight: 8 }} /> Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
