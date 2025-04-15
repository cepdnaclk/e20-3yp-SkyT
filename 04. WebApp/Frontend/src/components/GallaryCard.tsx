import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";

interface GallaryCardProps {
  lastUpdate?: string;
  img?: string;
  path?: string;
}

export default function GallaryCard({
  lastUpdate,
  img,
  path,
}: GallaryCardProps) {
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

        <Typography
          color="text.secondary"
          variant="caption"
          fontFamily={"inherit"}
          fontWeight={600}
        >
          Last Update On: <br /> {lastUpdate}
        </Typography>

        <Tooltip title={"View More"}>
          <IconButton
            href={path + "/gallary"}
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
        <Box
          component={"img"}
          src={img}
          alt="image"
          width={"100%"}
          height={"155px"}
        />
      </CardActionArea>
    </Card>
  );
}
