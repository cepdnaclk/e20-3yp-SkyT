import {
  Badge,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconMenu from "../components/IconMenu";
import { Outlet, useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox";

interface DashboardAreaProps {
  search: string;
  setSearch: (text: string) => void;
}

const USER = "John";

function DashboardArea({ search, setSearch }: DashboardAreaProps) {
  const navigator = useNavigate();
  const [user, setUser] = useState<string>();

  const [msgCount, setMsgCount] = useState<number>();

  const getInfo = async () => {
    setMsgCount(10);
    setUser(USER);
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Grid container spacing={3} fontFamily={"Montserrat"}>
      {/* Welcome Message */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography fontWeight={700} fontFamily={"inherit"} variant="h5" noWrap>
          Welcome {user}
        </Typography>
        <Typography>Logie Estate/ Lot LD5</Typography>
      </Grid>

      {/* Quick Links */}
      <Grid size={{ xs: 12, md: 6 }} display={"flex"} justifyContent={"end"}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={{ xs: "start", md: "end" }}
          width={"100%"}
        >
          <SearchBox
            placeholder="Search"
            value={search}
            fullWidth
            onChange={(e) => setSearch(e.target.value)}
          />

          <Stack direction={"row"} display={{ xs: "none", md: "flex" }}>
            <Tooltip title={"Notifications"} sx={{ ml: 2 }}>
              <IconButton
                onClick={() => {
                  navigator("/notifications");
                }}
              >
                <Badge badgeContent={msgCount} color="primary" max={9}>
                  <NotificationsIcon color="action" sx={{ fontSize: 30 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconMenu />
          </Stack>
        </Stack>
      </Grid>

      {/* Body Section */}
      <Grid
        size={12}
        container
        maxHeight={"calc(100vh - 185px)"}
        overflow={"auto"}
        padding={"10px"}
      >
        <Outlet />
      </Grid>
    </Grid>
  );
}

export default DashboardArea;
