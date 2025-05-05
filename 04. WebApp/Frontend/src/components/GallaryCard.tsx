import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import { NavLink } from "react-router-dom";

interface GallaryCardProps {
  lastUpdate?: string | null;
  img?: string | null;
  path: string;
}

export default function GallaryCard({
  lastUpdate,
  img,
  path,
}: GallaryCardProps) {
  const BASE_URL = import.meta.env.VITE_BACKEND;
  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        width: "320px",
        borderRadius: 2,
        fontFamily: "Montserrat",
        height: "200px",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={0.5}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          Gallary
        </Typography>

        {lastUpdate && (
          <Typography
            color="text.secondary"
            variant="caption"
            fontFamily={"inherit"}
            fontWeight={600}
          >
            Last Update On: <br /> {lastUpdate}
          </Typography>
        )}

        <Tooltip title={"View More"}>
          <IconButton
            component={NavLink}
            to={path + "/gallary"}
            color="success"
            sx={{
              border: "1px solid  #00796b",
              borderRadius: 2,
              padding: "1px",
              textAlign: "center",
            }}
          >
            <LandscapeRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <CardActionArea href={path + "/gallary"}>
        {img ? (
          <Box
            component={"img"}
            src={`${BASE_URL}/${img}`}
            alt="image"
            width={"100%"}
            height={"155px"}
          />
        ) : (
          <Box
            width={"100%"}
            height={"155px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            fontWeight={500}
          >
            No Data ...
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
}
