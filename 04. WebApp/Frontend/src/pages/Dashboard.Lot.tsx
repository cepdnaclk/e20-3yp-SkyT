import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import PHCard from "../components/PHCard";
import SoilCard from "../components/SoilCard";
import PHGraph from "../components/PHGraph";
import NPKGraph from "../components/NPKGraph";
import { DatasetElementType } from "@mui/x-charts/internals";
import GallaryCard from "../components/GallaryCard";
import img from "../assets/dashboard_asserts/Estate.jpg";
import MapCard from "../components/MapCard";
import TaskSummaryCard from "../components/TaskSummaryCard";

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

interface NPKGraphProps {
  date: string;
  n: number;
  p: number;
  k: number;
}

interface PHProps {
  date: string;
  ph: number;
}

interface CenterProps {
  name: string;
  location: [number, number];
}

interface SummaryCardProps {
  id?: string;
  due?: string;
  task?: string;
  tag?: string;
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
  PH: 8.5,
  Nitrogen: 50,
  Phosphorus: 70,
  Potassium: 40,
};

const PH_Data_Set: PHProps[] = [
  { date: "2025-04-14", ph: 6.0 },
  { date: "2025-04-15", ph: 2.0 },
  { date: "2025-04-16", ph: 5.2 },
  { date: "2025-04-17", ph: 3.8 },
  { date: "2025-04-18", ph: 4.2 },
  { date: "2025-04-19", ph: 8.2 },
  { date: "2025-04-20", ph: 10.0 },
];

const NPK_DATA_Set: NPKGraphProps[] = [
  { date: "2025-04-15", n: 310, p: 14, k: 160 },
  { date: "2025-04-16", n: 305, p: 15, k: 165 },
  { date: "2025-04-17", n: 320, p: 13, k: 155 },
  { date: "2025-04-18", n: 295, p: 16, k: 170 },
  { date: "2025-04-19", n: 315, p: 12, k: 150 },
  { date: "2025-04-20", n: 300, p: 17, k: 162 },
  { date: "2025-04-21", n: 308, p: 14, k: 158 },
];

const PeraCom: [number, number] = [7.254670434402384, 80.5912347236105];

const TASKS: SummaryCardProps[] = [
  {
    id: "task-001",
    due: "Apr 15",
    task: "Check irrigation",
    tag: "Irrigation",
  },
  {
    id: "task-002",
    due: "Apr 22",
    task: "Soil pH sampling",
    tag: "Soil",
  },
];

function Lot() {
  const path = useLocation().pathname;
  const lotId = path.split("/")[5];

  const [weatherData, setWetherData] = useState<WeatherCardProps>();
  const [latestData, setLatestData] = useState<DataProps>();
  const [phLoaded, setPhLoaded] = useState<boolean>(false);
  const [phDataSet, setPhDataSet] =
    useState<DatasetElementType<Date | number>[]>();
  const [npkLoaded, setNpkLoaded] = useState<boolean>(false);
  const [npkDataSet, setNpkDataSet] =
    useState<DatasetElementType<Date | number>[]>();
  const [center, setCenter] = useState<CenterProps>();
  const [tasks, setTasks] = useState<SummaryCardProps[]>();

  useEffect(() => {
    const update = async () => {
      console.log("Updating Data", lotId);
      setLatestData(DATA);
      setWetherData(WEATHER);
      setPhLoaded(true);
      setPhDataSet(generateDataSet(PH_Data_Set));
      setNpkLoaded(true);
      setNpkDataSet(generateDataSet(NPK_DATA_Set));
      setCenter({
        name: "PeraCom",
        location: PeraCom,
      });
      setTasks(TASKS);
    };

    update();
  }, [lotId]);

  const generateDataSet = (data: PHProps[] | NPKGraphProps[]) =>
    data.map((item) => {
      const stdDate = new Date(new Date(item.date).setHours(0, 0, 0, 0));
      const element = { ...item, date: stdDate };
      return element;
    });

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
        <GallaryCard lastUpdate="2025-04-14 at 04:20AM" img={img} path={path} />
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
        <TaskSummaryCard path={path} tasks={tasks} />
      </Grid>

      {/* PH Analysis Card */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <PHGraph loaded={phLoaded} dataset={phDataSet} />
      </Grid>

      {/* NPK Analysis Card */}
      <Grid size={{ xs: 12, lg: 6 }}>
        <NPKGraph dataset={npkDataSet} loaded={npkLoaded} />
      </Grid>
    </Grid>
  );
}

export default Lot;
