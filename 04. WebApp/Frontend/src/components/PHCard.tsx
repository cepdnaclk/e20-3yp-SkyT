import { Box, Typography, Card, Tooltip, IconButton } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";

interface PHCardProps {
  low?: number;
  optimal?: number;
  high?: number;
}

export default function PHCard({ low, optimal, high }: PHCardProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if all values are defined
    if (low !== undefined && optimal !== undefined && high !== undefined) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [low, optimal, high]);

  const handleClick = () => {
    console.log("Analysis...");
  };

  const valueFormatter = (item: { value: number }) =>
    `${item.value}/${low! + optimal! + high!}`;

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
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          PH Value
        </Typography>

        <Tooltip title="Analysis">
          <IconButton
            onClick={handleClick}
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

      {/* Chart Area */}
      <Box>
        <PieChart
          series={[
            {
              data: [
                { label: "Low", value: low!, color: "#dd0130" },
                { label: "Optimal", value: optimal!, color: "#04aa6d" },
                { label: "High", value: high!, color: "#1a76d2" },
              ],
              highlightScope: { fade: "global", highlight: "item" },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: "gray",
              },
              valueFormatter,
            },
          ]}
          height={180}
          loading={loading}
          slotProps={{
            legend: {
              itemMarkWidth: 12,
              itemMarkHeight: 12,
              labelStyle: {
                fontFamily: "Montserrat",
                fontWeight: 600,
              },
            },
          }}
        />
      </Box>
    </Card>
  );
}
