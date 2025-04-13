import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import PHCard from "../components/PHCard";
import SoilCard from "../components/SoilCard";

interface WeatherCardProps {
  temparature?: string | number;
  humidity?: string | number;
  wind?: string | number;
  rain?: string | number;
  sunset?: string;
  sunrise?: string;
}

interface DataProps {
  Temperature: number;
  Humidity: number;
  lowPH: number;
  highPH: number;
  optimalPH: number;
  PH: number;
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
}

const WEATHER: WeatherCardProps = {
  temparature: 27,
  humidity: 30,
  wind: 10,
  rain: 50,
  sunrise: "10:00",
  sunset: "10:00",
};

const DATA: DataProps = {
  Temperature: 30,
  Humidity: 20,
  lowPH: 20,
  highPH: 10,
  optimalPH: 70,
  PH: 5.5,
  Nitrogen: 50,
  Phosphorus: 70,
  Potassium: 40,
};

function Lot() {
  const lotId = useLocation().pathname.split("/")[5];

  const [weatherData, setWetherData] = useState<WeatherCardProps>();
  const [latestData, setLatestData] = useState<DataProps>();

  useEffect(() => {
    const update = async () => {
      console.log("Updating Data", lotId);
      setLatestData(DATA);
      setWetherData(WEATHER);
    };
    update();
  }, [lotId]);

  return (
    <Grid container spacing={3} width={"100%"}>
      {/* Weather Card */}
      <Grid
        size={{ xs: 12, lg: 6, xl: 4 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <WeatherCard
          temparature={latestData?.Temperature}
          humidity={latestData?.Humidity}
          wind={weatherData?.wind}
          rain={weatherData?.rain}
          sunrise={weatherData?.sunrise}
          sunset={weatherData?.sunset}
        />
      </Grid>

      {/* PH Card */}
      <Grid
        size={{ xs: 12, lg: 6, xl: 4 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <PHCard
          low={latestData?.lowPH}
          high={latestData?.highPH}
          optimal={latestData?.optimalPH}
          PH={latestData?.PH}
        />
      </Grid>

      {/* NPK Card */}
      <Grid
        size={{ xs: 12, lg: 6, xl: 4 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <SoilCard
          n={latestData?.Nitrogen}
          p={latestData?.Phosphorus}
          k={latestData?.Potassium}
        />
      </Grid>
    </Grid>
  );
}

export default Lot;
