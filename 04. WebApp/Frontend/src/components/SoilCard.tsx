import React from "react";
import {
  Box,
  Typography,
  Card,
  LinearProgress,
  Tooltip,
  IconButton,
  Stack,
  Skeleton,
} from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";

interface NutrientProps {
  label: string;
  value: number; // 0–100
  color: string;
}

interface SoilCardProps {
  n?: number;
  p?: number;
  k?: number;
}

const NutrientBar: React.FC<NutrientProps> = ({ label, value, color }) => (
  <Box mb={2}>
    <Box
      display="flex"
      justifyContent="space-between"
      fontFamily={"Montserrat"}
    >
      <Typography
        variant="body2"
        fontWeight="bold"
        fontFamily={"inherit"}
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography variant="body2">
        {value !== undefined && value !== null ? `${value} mg/kg` : "--"}
      </Typography>
    </Box>

    {value ? (
      <Tooltip
        title={
          <>
            <div>{label}</div>
            <div>{value} mg/kg</div>
          </>
        }
      >
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: "#f0f0f0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: color,
            },
          }}
        />
      </Tooltip>
    ) : (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={10}
        sx={{ borderRadius: 5, bgcolor: "#e0e0e0" }}
      />
    )}
  </Box>
);

function SoilCard({ n, p, k }: SoilCardProps) {
  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        width: 320,
        borderRadius: 2,
        fontFamily: "Montserrat",
        height: 200,
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          Soil Quality
        </Typography>

        <Tooltip title="Analysis">
          <IconButton
            //onClick={handleClick}
            sx={{
              border: "1px solid #00796b",
              borderRadius: 2,
              padding: "1px",
            }}
          >
            <TimelineIcon sx={{ color: "#00796b" }} />
          </IconButton>
        </Tooltip>
      </Box>

      <Stack direction={"column"} gap={0.5} p={0.5}>
        <NutrientBar label="Nitrogen (N)" value={n!} color="#4caf50" />

        <NutrientBar label="Phosphorus (P)" value={p!} color="#ff9800" />

        <NutrientBar label="Potassium (K)" value={k!} color="#2196f3" />
      </Stack>
    </Card>
  );
}

export default SoilCard;
