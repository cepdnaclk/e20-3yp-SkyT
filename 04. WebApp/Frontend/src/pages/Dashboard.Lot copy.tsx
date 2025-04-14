import {
  Card,
  Divider,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { useLocation } from "react-router-dom";
import ParameterCard from "../components/ParameterCard";
import { WiHumidity } from "react-icons/wi";
import { IoMdSpeedometer } from "react-icons/io";
import {
  TbCircleLetterKFilled,
  TbCircleLetterNFilled,
  TbCircleLetterPFilled,
} from "react-icons/tb";
import { LineChart } from "@mui/x-charts";
import ImagePreviewGrid from "../components/ImagePreviewGrid";

interface ParamCardProps {
  title: string;
  value?: number | string;
  Icon: React.ElementType;
  units?: string;
}

interface DataProps {
  Temperature: number;
  Humidity: number;
  PH: number;
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
}

const Params: Omit<ParamCardProps, "value">[] = [
  {
    title: "Temperature",
    Icon: LiaTemperatureHighSolid,
    units: "°C",
  },
  { title: "Humidity", Icon: WiHumidity, units: "%" },
  { title: "PH", Icon: IoMdSpeedometer },
  {
    title: "Nitrogen",
    Icon: TbCircleLetterNFilled,
    units: "mg/kg",
  },
  {
    title: "Phosphorus",
    Icon: TbCircleLetterPFilled,
    units: "mg/kg",
  },
  {
    title: "Potassium",
    Icon: TbCircleLetterKFilled,
    units: "mg/kg",
  },
];

const DATA: DataProps = {
  Temperature: 30,
  Humidity: 20,
  PH: 5,
  Nitrogen: 50,
  Phosphorus: 70,
  Potassium: 40,
};

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },

  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];

function Lot() {
  const lotId = useLocation().pathname.split("/")[5];

  const [loading, setLoading] = useState<boolean>(true);
  const [latestData, setLatestData] = useState<DataProps>();

  const update = async () => {
    console.log("Updating Data");
    setLatestData(DATA);
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* Summary Section */}

      <Grid size={12}>
        <Typography fontFamily={"inherit"} fontWeight={600} variant="h6">
          Today's Summary
        </Typography>
      </Grid>
      {latestData &&
        Params?.map((param, index) => (
          <Grid
            key={index}
            size={{ xs: 12, md: 6, lg: 4 }}
            display={"flex"}
            justifyContent={"center"}
          >
            <ParameterCard
              title={param.title}
              Icon={param.Icon}
              units={param.units}
              value={latestData[param.title as keyof DataProps]}
            />
          </Grid>
        ))}

      {/* Graph Section */}
      <Grid size={{ xs: 12, md: 6 }} container bgcolor={"royalblue"}>
        <Grid size={12}>
          <Typography fontFamily={"inherit"} fontWeight={600} variant="h6">
            Analytics
          </Typography>
        </Grid>

        <Grid size={12} bgcolor={"rosybrown"}>
          <Card elevation={3} sx={{ width: "100%", height: "400px" }}>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
                {
                  data: [1, 6.5, 5, 4.5, 1, 2],
                },
                {
                  data: [2, 5.5, 3, 5.5, 7.5, 12],
                },
                {
                  data: [9, 8.5, 7, 5.5, 4.5, 1],
                },
              ]}
              width={500}
              height={300}
            />
          </Card>
        </Grid>
      </Grid>

      {/* Gallery Section */}
      <Grid size={{ xs: 12, md: 6 }} container bgcolor={"rebeccapurple"}>
        <Grid size={12}>
          <Typography fontFamily={"inherit"} fontWeight={600} variant="h6">
            Gallary
          </Typography>
        </Grid>

        <Grid size={12} bgcolor={"gold"} p={0} m={0}>
          <Card
            elevation={5}
            sx={{ bgcolor: "royalblue", width: "100%", height: "400px" }}
          >
            <ImagePreviewGrid />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Lot;
