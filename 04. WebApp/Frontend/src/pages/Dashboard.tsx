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

  if (estateList) {
    try {
      const estates: estateProps[] = JSON.parse(estateList);

      allSections.forEach((section, index) => {
        // Home section (first section)
        if (index === 0) {
          breadcrumbs.push("Home"); // Push 'Home' breadcrumb
          links.push(section); // Push 'Home' link
        } else {
          // Subdirectories - sections after the first one
          if (index % 2 === 0) {
            const matchedEstate = estates.find(
              (estate) => estate.id === section
            );

            if (matchedEstate) {
              // If an estate with matching ID is found
              breadcrumbs.push(matchedEstate.estate);
              const link = allSections.slice(0, index + 1).join("/");
              links.push(link);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error parsing estate list from sessionStorage:", error);
    }
  } else {
    console.warn("No estate list found in sessionStorage.");
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
        height={"calc(100vh - 170px)"}
        overflow={"auto"}
        padding={"10px"}
      >
        <Outlet />
      </Grid>
    </Grid>
  );
}

export default DashboardArea;
