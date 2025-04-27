import { Box, Grid, MenuItem, Typography } from "@mui/material";
import LeafletMap from "../components/LeafletMap";
import TextBox from "../components/TextBox";
import { useState } from "react";
import TaskList from "../components/TaskList";
import { useAuth } from "../context/AuthContext";

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

export default function TaskManager() {
  const ests = sessionStorage.getItem("estates");
  const estates: EstateProps[] = ests ? JSON.parse(ests) : null;
  const { user } = useAuth();

  const [estate, setEstate] = useState<EstateProps>(estates[0]);
  const [lots, setLots] = useState<LotProps[]>();
  const [office, setOffice] = useState<OfficeProps>();

  const handleChange = (name: string) => {
    console.log("Selected:", name);
    const selected = estates.find((est) => est.estate === name);
    if (selected) {
      setEstate(selected);
    }
  };

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
          <LeafletMap office={office} lots={lots} />
        </Grid>
      </Grid>
    </Box>
  );
}
