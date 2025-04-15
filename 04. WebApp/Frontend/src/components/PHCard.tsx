import {
  Box,
  Typography,
  Card,
  Tooltip,
  IconButton,
  alpha,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

interface PHCardProps {
  low?: number;
  optimal?: number;
  high?: number;
  PH?: number;
}

interface ColorProps {
  optimal: string;
  low: string;
  high: string;
}

const COLOR_CODES: ColorProps = {
  optimal: "#4caf50",
  low: "#fe0032",
  high: "#2196f3",
};

const LOWER_BOUND = 3;
const UPPER_BOUND = 6;

export default function PHCard({ low, optimal, high, PH }: PHCardProps) {
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState<string>(COLOR_CODES.optimal);

  useEffect(() => {
    // Check if all values are defined
    if (
      low !== undefined &&
      optimal !== undefined &&
      high !== undefined &&
      PH !== undefined
    ) {
      setLoading(false);
      if (PH < LOWER_BOUND) setColor(COLOR_CODES.low);
      else if (UPPER_BOUND < PH) setColor(COLOR_CODES.high);
      else setColor(COLOR_CODES.optimal);
    } else {
      setLoading(true);
    }
  }, [low, optimal, high, PH]);

  const handleClick = () => {
    console.log("Analysis...");
    const phGraphElement = document.getElementById("ph-graph");
    if (phGraphElement) {
      phGraphElement.scrollIntoView({ behavior: "smooth" });
    }
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={0.5}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          PH Value
        </Typography>

        <Box
          border={"2px solid"}
          borderColor={color}
          width={"100px"}
          textAlign={"center"}
          borderRadius={5}
          bgcolor={alpha(color!, 0.3)}
        >
          <Typography
            variant="h6"
            fontFamily={"inherit"}
            fontWeight={600}
            color={color}
          >
            {PH}
          </Typography>
        </Box>

        <Tooltip title="Analysis">
          <IconButton
            onClick={handleClick}
            color="success"
            sx={{
              border: "1px solid #00796b",
              borderRadius: 2,
              padding: "1px",
            }}
          >
            <BarChartRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Chart Area */}
      <Box>
        <PieChart
          series={[
            {
              data: [
                {
                  label: "Low",
                  value: low!,
                  color: alpha(COLOR_CODES.low, 0.8),
                },
                {
                  label: "Optimal",
                  value: optimal!,
                  color: alpha(COLOR_CODES.optimal, 0.8),
                },
                {
                  label: "High",
                  value: high!,
                  color: alpha(COLOR_CODES.high, 0.8),
                },
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
          height={170}
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
