import { Box, Card, IconButton, Tooltip, Typography } from "@mui/material";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import LeafletMap from "./LeafletMap";

interface GallaryCardProps {
  path?: string;
  center?: {
    name: string;
    location: [number, number];
  };
}

export default function MapCard({ path, center }: GallaryCardProps) {
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
        mb={1}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          Map
        </Typography>

        <Tooltip title={"Explore"}>
          <IconButton
            href={path + "/map"}
            color="success"
            sx={{
              border: "1px solid  #00796b",
              borderRadius: 2,
              padding: "1px",
              textAlign: "center",
            }}
          >
            <ExploreOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box width={"100%"} height={"160px"}>
        <LeafletMap office={center} />
      </Box>
    </Card>
  );
}
