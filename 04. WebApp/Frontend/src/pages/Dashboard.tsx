import {
  Badge,
  Breadcrumbs,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconMenu from "../components/IconMenu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import Link from "@mui/material/Link";

interface DashboardAreaProps {
  search: string;
  setSearch: (text: string) => void;
}

interface estateProps {
  id: string;
  estate: string;
}

interface lotProps {
  id: string;
  lot: string;
}

const USER = "John";

function DashboardArea({ search, setSearch }: DashboardAreaProps) {
  const navigator = useNavigate();

  // Get the path and split it
  const path = useLocation().pathname;
  const allSections = path.split("/").filter(Boolean); // remove empty strings

  // Separate into links and breadcrumbs
  const links: string[] = [];
  const breadcrumbs: string[] = [];
  const estateList: string | null = sessionStorage.getItem("estates");
  const lotList: string | null = sessionStorage.getItem("lots");

  // Home Section
  if (allSections.length > 0) {
    breadcrumbs.push("Home");
    links.push("home");
  }

  // Estate Section
  if (allSections.length > 2 && estateList) {
    try {
      const estates: estateProps[] = JSON.parse(estateList);
      const matchedEstate = estates.find(
        (estate) => estate.id === allSections[2]
      );

      if (matchedEstate) {
        // If an estate with matching ID is found
        breadcrumbs.push(matchedEstate.estate);
        const link = allSections.slice(0, 3).join("/");
        links.push(link);
      }
    } catch (error) {
      console.error("Error parsing estate list from sessionStorage:", error);
    }
  }

  // Lot Section
  if (allSections.length > 4 && lotList) {
    try {
      const lots: lotProps[] = JSON.parse(lotList);
      const matchedLot = lots.find((lot) => lot.id === allSections[4]);

      if (matchedLot) {
        // If an lot with matching ID is found
        breadcrumbs.push(matchedLot.lot);
        const link = allSections.slice(0, 5).join("/");
        links.push(link);
      }
    } catch (error) {
      console.error("Error parsing lot list from sessionStorage:", error);
    }
  }

  // Special Option Section
  if (allSections.length > 5) {
    const word =
      allSections[5].charAt(0).toUpperCase() + allSections[5].slice(1);
    breadcrumbs.push(word);
  }

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
      <Grid size={{ xs: 12, sm: 6 }}>
        <Typography fontWeight={700} fontFamily={"inherit"} variant="h5" noWrap>
          Welcome {user}
        </Typography>

        <Breadcrumbs aria-label="breadcrumb">
          {breadcrumbs?.slice(0, -1).map((section, index) => {
            const goto = "/" + links[index];
            return (
              <Link key={index} underline="hover" color="inherit" href={goto}>
                {section}
              </Link>
            );
          })}

          <Typography
            sx={{ color: "text.primary" }}
            fontFamily={"Montserrat"}
            fontWeight={500}
          >
            {breadcrumbs?.[breadcrumbs.length - 1]}
          </Typography>
        </Breadcrumbs>
      </Grid>

      {/* Quick Links */}
      <Grid size={{ xs: 12, sm: 6 }} display={"flex"} justifyContent={"end"}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={{ xs: "start", md: "end" }}
          width={"100%"}
        >
          {allSections.length < 4 && (
            <SearchBox
              placeholder="Search"
              value={search}
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
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
        height={{ xs: "calc(100vh - 170px)", md: "calc(100vh - 165px)" }}
        overflow={"auto"}
        padding={"2px"}
      >
        <Outlet />
      </Grid>
    </Grid>
  );
}

export default DashboardArea;
