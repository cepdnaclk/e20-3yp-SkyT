import { Card, CardContent, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

interface DroneCardProps {
  type: string;
  color: string;
  count?: number;
}

export default function DroneCard({ type, color, count = 0 }: DroneCardProps) {
  const [displayCount, setDisplayCount] = useState<number>();

  useEffect(() => {
    let current = -1;
    const interval = setInterval(() => {
      current += 1;
      setDisplayCount(current);
      if (current >= count) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <Card
      sx={{
        minWidth: { xs: 300, md: 250 },
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f9f9f9",
        borderLeft: `6px solid ${color}`,
        transition: "0.3s",
        ":hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {type}
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {displayCount}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            drones
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
