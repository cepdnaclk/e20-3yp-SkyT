import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { useDate } from "../utils/useDate";
import { IoWaterOutline } from "react-icons/io5";
import { TbTemperatureSun } from "react-icons/tb";
import { FiWind } from "react-icons/fi";
import { WiDayRainMix } from "react-icons/wi";
import sunImage from "../assets/dashboard_asserts/sun6.png";

import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
interface WeatherCardProps {
  temparature?: string | number;
  humidity?: string | number;
  wind?: string | number;
  rain?: string | number;
  sunset?: string;
  sunrise?: string;
}

export default function WeatherCard({
  temparature,
  humidity,
  rain,
  wind,
  sunset,
  sunrise,
}: WeatherCardProps) {
  const date = useDate();
  const path = import.meta.env.VITE_WEATHER_CHANNEL;

  return (
    <Paper
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
        mb={2}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          Weather
        </Typography>

        <Typography
          color="text.secondary"
          variant="h6"
          fontFamily={"inherit"}
          fontWeight={600}
        >
          {date.date}
        </Typography>

        <Tooltip title={"View More"}>
          <IconButton
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              border: "1px solid gray",
              borderRadius: 2,
              padding: "1px",
            }}
          >
            <ArrowOutwardIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Weather Stats */}
      <Grid container spacing={2} textAlign="center" mb={2}>
        <Grid size={3}>
          <TbTemperatureSun style={{ color: "gray", fontSize: "2rem" }} />
          {temparature ? (
            <Typography fontWeight="bold" variant="body1">
              {temparature}°C
            </Typography>
          ) : (
            <Skeleton width={"100%"} height={30} />
          )}

          <Typography
            color="textSecondary"
            variant="body2"
            fontFamily={"inherit"}
          >
            Temp
          </Typography>
        </Grid>

        <Grid size={3}>
          <IoWaterOutline style={{ color: "gray", fontSize: "2rem" }} />
          {humidity ? (
            <Typography fontWeight="bold" variant="body1">
              {humidity}%
            </Typography>
          ) : (
            <Skeleton width={"100%"} height={30} />
          )}
          <Typography
            color="textSecondary"
            variant="body2"
            fontFamily={"inherit"}
          >
            Humidity
          </Typography>
        </Grid>

        <Grid size={3}>
          <FiWind style={{ color: "gray", fontSize: "2rem" }} />
          {wind ? (
            <Typography fontWeight="bold" variant="body1">
              {wind}km/h
            </Typography>
          ) : (
            <Skeleton width={"100%"} height={30} />
          )}
          <Typography
            color="textSecondary"
            variant="body2"
            fontFamily={"inherit"}
          >
            Wind
          </Typography>
        </Grid>

        <Grid size={3}>
          <WiDayRainMix style={{ color: "gray", fontSize: "2rem" }} />
          {rain ? (
            <Typography fontWeight="bold" variant="body1">
              {rain}mm
            </Typography>
          ) : (
            <Skeleton width={"100%"} height={30} />
          )}
          <Typography
            color="textSecondary"
            variant="body2"
            fontFamily={"inherit"}
          >
            Rain
          </Typography>
        </Grid>
      </Grid>

      {/* Sunrise & Sunset */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box textAlign="center">
          {sunrise ? (
            <Typography fontWeight="bold" variant="body1">
              {sunrise} <span style={{ fontSize: "0.75rem" }}> am</span>
            </Typography>
          ) : (
            <Skeleton width={"100%"} height={30} />
          )}

          <Typography
            color="textSecondary"
            variant="body2"
            fontFamily={"inherit"}
          >
            Sunrise
          </Typography>
        </Box>

        <Box component={"img"} src={sunImage} width={"170px"} height={"50px"} />

        <Box textAlign="center">
          {sunset ? (
            <Typography fontWeight="bold" variant="body1">
              {sunset} <span style={{ fontSize: "0.75rem" }}> pm</span>
            </Typography>
          ) : (
            <Skeleton width={"100%"} height={30} />
          )}

          <Typography
            color="textSecondary"
            variant="body2"
            fontFamily={"inherit"}
          >
            Sunset
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
