import { Box, Grid, MenuItem, Typography } from "@mui/material";
import LeafletMap from "../components/LeafletMap";
import TextBox from "../components/TextBox";
import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";
import { getData } from "../api/NodeBackend";

interface EstateProps {
  id: number;
  estate: string;
}

interface LotProps {
  lotId: number;
  lot: string;
  location: [number, number];
}

interface OfficeProps {
  name: string;
  location: [number, number];
}

interface DroneStatusProps {
  droneId: number;
  type: string;
  location: [number, number];
  battery: number;
  signal: number;
  status: "Active" | "Available" | "Removed" | "Maintenance";
}

const PERIOD = 10; // in seconds

export default function TaskManager() {
  const ests = sessionStorage.getItem("estates");
  const estates: EstateProps[] = ests ? JSON.parse(ests) : null;
  const { user } = useAuth();

  const [estate, setEstate] = useState<EstateProps>(estates[0]);
  const [lots, setLots] = useState<LotProps[]>();
  const [office, setOffice] = useState<OfficeProps>();
  const [drones, setDrones] = useState<DroneStatusProps[]>();

  const handleChange = (name: string) => {
    console.log("Selected:", name);
    const selected = estates.find((est) => est.estate === name);
    if (selected) {
      setEstate(selected);
    }
  };

  // Fetching live data of drones
  useEffect(() => {
    const fetchDroneData = async () => {
      const url = `drones/${user?.userId}/${estate.id}`;

      try {
        const serverResponse = await getData(url);

        if (serverResponse.status === 200) {
          console.log(serverResponse.data);
          setDrones(serverResponse.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDroneData(); // first call
    const intervalId = setInterval(fetchDroneData, 1000 * PERIOD); // every 5 seconds

    return () => clearInterval(intervalId); // cleanup
  }, [estate.id, user?.userId]);

  return (
    <Box width={"100%"} height={"100%"}>
      {/* Header Section */}
      <Grid spacing={2} container mb={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            fontFamily={"Montserrat"}
            fontSize={"30px"}
            fontWeight={600}
            noWrap
          >
            Task Manager
          </Typography>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6 }}
          display={"flex"}
          justifyContent={{ xs: "space-around", lg: "end" }}
        >
          <TextBox
            select
            label="Select an estate"
            value={estate.estate}
            onChange={(e) => handleChange(e.target.value)}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 2, maxWidth: "350px" }}
          >
            {estates.map((estate) => (
              <MenuItem key={estate.id} value={estate.estate}>
                {estate.estate}
              </MenuItem>
            ))}
          </TextBox>
        </Grid>
      </Grid>

      {/* Body Section */}
      <Grid
        spacing={2}
        container
        sx={{
          width: "100%",
          height: { xs: "calc(100% - 60px)", md: "calc(100% - 60px)" },
        }}
      >
        {/* Features Section */}
        <Grid
          size={{ xs: 12, sm: "auto" }}
          height={{ xs: "auto", md: "100%" }}
          display={"flex"}
          justifyContent={"center"}
        >
          <TaskList
            estateId={estate.id}
            userId={user?.userId}
            lots={lots}
            setLots={setLots}
            setOffice={setOffice}
          />
        </Grid>

        {/* Map Section */}
        <Grid
          size={{ xs: 12, sm: "grow" }}
          height={"auto"}
          minHeight={"370px"}
          bgcolor={"red"}
        >
          <LeafletMap office={office} lots={lots} drones={drones} />
        </Grid>
      </Grid>
    </Box>
  );
}
