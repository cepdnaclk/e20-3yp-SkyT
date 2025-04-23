import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import PHCard from "../components/PHCard";
import SoilCard from "../components/SoilCard";
import PHGraph from "../components/PHGraph";
import NPKGraph from "../components/NPKGraph";
import GallaryCard from "../components/GallaryCard";
import MapCard from "../components/MapCard";
import TaskSummaryCard from "../components/TaskSummaryCard";
import { useAuth } from "../context/AuthContext";
import { getData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { ToastAlert } from "../components/ToastAlert";

interface WeatherCardProps {
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

interface ImageProps {
  url: string | null;
  uploadedAt: string | null;
}

interface CenterProps {
  name: string;
  location: [number, number];
}

interface SummaryCardProps {
  id?: number;
  due?: string;
  task?: string;
  tag?: string;
}

interface ErrorResponse {
  error: string;
}

interface serverResponse {
  message: string;
  weather: WeatherCardProps;
  latest: DataProps;
  center: CenterProps;
  latestImage: ImageProps;
  taskList: SummaryCardProps[];
}

export function Lot() {
  const path = useLocation().pathname;
  const lotId = path.split("/")[5];
  const { user } = useAuth();

  const [weatherData, setWetherData] = useState<WeatherCardProps>();
  const [latestData, setLatestData] = useState<DataProps>();

  const [center, setCenter] = useState<CenterProps>();
  const [tasks, setTasks] = useState<SummaryCardProps[]>();
  const [image, setImage] = useState<ImageProps | null>();

  useEffect(() => {
    const update = async () => {
      console.log("Updating Data", { lotId, userId: user?.userId });

      const url = `lots/summary/${lotId}/${user?.userId}`;

      try {
        const serverResponse = await getData(url);

        if (serverResponse.status === 200) {
          const {
            message,
            latest,
            center,
            latestImage,
            taskList,
          }: serverResponse = serverResponse.data;
          console.log(message);
          setLatestData(latest);
          setCenter(center);
          setImage(latestImage);
          setTasks(taskList);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 401 || status === 400) {
          console.log(error.response?.data?.error);
          errMsg = error.response?.data?.error;
        }

        console.log("Dashboard Error:", errMsg);
        ToastAlert({
          type: "error",
          title: errMsg || "Something went wrong",
        });
      }
    };

    const getWeather = async () => {
      console.log("Updating Weather Data", { lotId, userId: user?.userId });

      const url = `lots/weather/${lotId}/${user?.userId}`;

      try {
        const serverResponse = await getData(url);

        if (serverResponse.status === 200) {
          const { message, weather }: serverResponse = serverResponse.data;
          console.log(message);
          setWetherData(weather);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 401 || status === 400) {
          console.log(error.response?.data?.error);
          errMsg = error.response?.data?.error;
        }

        console.log("Dashboard Error:", errMsg);
        ToastAlert({
          type: "error",
          title: errMsg || "Something went wrong",
        });
      }
    };

    update();
    getWeather();
  }, [lotId, user?.userId]);

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

      {/* Gallary */}
      <Grid
        size={{ xs: 12, lg: 6, xl: 4 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <GallaryCard
          lastUpdate={image?.uploadedAt}
          img={image?.url}
          path={path}
        />
      </Grid>

      {/* Map */}
      <Grid
        size={{ xs: 12, lg: 6, xl: 4 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <MapCard center={center} path={path} />
      </Grid>

      {/* Task Managment */}
      <Grid
        size={{ xs: 12, lg: 6, xl: 4 }}
        display={"flex"}
        justifyContent={"center"}
      >
        <TaskSummaryCard tasks={tasks} />
      </Grid>

      {/* PH Analysis Card */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <PHGraph userId={user?.userId} lotId={parseInt(lotId)} />
      </Grid>

      {/* NPK Analysis Card */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <NPKGraph userId={user?.userId} lotId={parseInt(lotId)} />
      </Grid>
    </Grid>
  );
}

export default Lot;
