import { Box, Button, Card, Grid, Skeleton, Typography } from "@mui/material";
import DroneCard from "../components/DroneCard";
import MapCard from "../components/MapCard";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { ToastAlert } from "../components/ToastAlert";

interface DroneProps {
  monAct: number;
  monAva: number;
  ferAct: number;
  ferAva: number;
}

interface OfficeProps {
  name: string;
  location: [number, number];
}

interface LotProps {
  lotId: number;
  lot: string;
  location: [number, number];
}

interface LotButtonProps extends Omit<LotProps, "location"> {
  handleClick: (id: number) => void;
}

interface ErrorResponse {
  error: string;
}

function LotButton({ lotId, lot, handleClick }: LotButtonProps) {
  return (
    <Button
      variant="outlined"
      onClick={() => handleClick(lotId)}
      sx={{
        border: "3px solid",
        color: "#009245",
        borderRadius: "30px",
        paddingX: 3,
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "1rem",
        transition: "0.3s",
        boxShadow: 2,
        ":hover": {
          boxShadow: 5,
          bgcolor: "#e6f4ec",
        },
      }}
    >
      {lot}
    </Button>
  );
}

export default function EstateSummary() {
  const estateId = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();
  const { user } = useAuth();

  const [office, setOffice] = useState<OfficeProps>();
  const [drones, setDrones] = useState<DroneProps>();
  const [lots, setLots] = useState<LotProps[]>();

  useEffect(() => {
    const getInfo = async () => {
      const url = `estates/summary/${user?.userId}/${estateId}`;

      try {
        console.log(url);
        const serverResponse = await getData(url);
        console.log(serverResponse.data);
        if (serverResponse.status === 200) {
          const { drones, office, message, lots } = serverResponse.data;
          console.log(message);
          setDrones(drones);
          setOffice(office);
          setLots(lots);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 400 || status === 404) {
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

    if (estateId && user?.userId) {
      getInfo();
    }
  }, [user?.userId, estateId]);

  const handleNavigate = (lotId: number) => {
    console.log("Navigate to: ", lotId);
    const path = `/home/estate/${estateId}/lot/${lotId}`;
    navigate(path);
  };

  return (
    <Box width={"100%"} height={"100%"}>
      {/* Drone Summary Section */}
      <Typography
        fontFamily={"Montserrat"}
        fontWeight={600}
        variant="h6"
        mb={2}
      >
        Drone Overview
      </Typography>

      <Grid
        container
        spacing={2}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-around"}
        mb={3}
      >
        <DroneCard
          count={drones?.monAct}
          type="Monitoring - Active"
          color="#f44336" // red
        />
        <DroneCard
          count={drones?.monAva}
          type="Monitoring - Available"
          color="#2196f3" // blue
        />
        <DroneCard
          count={drones?.ferAct}
          type="Fertilizing - Active"
          color="#ff9800" // orange
        />
        <DroneCard
          count={drones?.ferAva}
          type="Fertilizing - Available"
          color="#4caf50" // green
        />
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Access */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card
            elevation={3}
            sx={{
              width: "calc(100% - 32px)",
              padding: 2,
              height: { xs: "auto", lg: "calc(100vh - 400px)" },
              borderRadius: 2,
            }}
          >
            <Typography
              fontFamily={"Montserrat"}
              fontWeight={600}
              variant="h6"
              mb={3}
            >
              Quick Lot Access
            </Typography>

            <Grid
              container
              display={"flex"}
              spacing={2}
              justifyContent={"space-around"}
            >
              {lots ? (
                lots.map((lot) => (
                  <LotButton
                    key={lot.lotId}
                    lot={lot.lot}
                    lotId={lot.lotId}
                    handleClick={handleNavigate}
                  />
                ))
              ) : (
                <Skeleton
                  width={"100%"}
                  variant="rectangular"
                  sx={{
                    minHeight: 100,
                    height: { xs: "auto", lg: "calc(100vh - 455px)" },
                  }}
                />
              )}
            </Grid>
          </Card>
        </Grid>

        {/* Map */}
        <Grid size={{ xs: 12, lg: 6 }} height={"100%"}>
          <MapCard
            center={office}
            path={`/home/estate/${estateId}`}
            height={{ xs: "30vh", lg: "calc(100vh - 400px)" }}
            width={"100%"}
            locationList={lots}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
