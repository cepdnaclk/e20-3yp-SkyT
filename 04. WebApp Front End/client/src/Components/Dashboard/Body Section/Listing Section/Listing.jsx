import { useEffect, useState } from "react";
import "./listing.css";
import SmallCard from "../../../widgets/smallCard";
import { Box, Grid2 as Grid } from "@mui/material";

// Icons
import { LiaTemperatureHighSolid } from "react-icons/lia";
import { getData } from "../../../../Api/Api";
import { WiHumidity } from "react-icons/wi";
import { IoMdSpeedometer } from "react-icons/io";
import { TbCircleLetterNFilled } from "react-icons/tb";
import { TbCircleLetterKFilled } from "react-icons/tb";
import { TbCircleLetterPFilled } from "react-icons/tb";

const Listing = () => {
  const [cardParams, setCardParams] = useState([
    {
      id: 1,
      title: "Temperature",
      value: "Loading...",
      Icon: LiaTemperatureHighSolid,
    },
    { id: 2, title: "Humidity", value: "Loading...", Icon: WiHumidity },
    { id: 3, title: "PH", value: "Loading...", Icon: IoMdSpeedometer },
    {
      id: 4,
      title: "Nitrogen",
      value: "Loading...",
      Icon: TbCircleLetterNFilled,
    },
    {
      id: 5,
      title: "Phosphorus",
      value: "Loading...",
      Icon: TbCircleLetterPFilled,
    },
    {
      id: 6,
      title: "Potassium",
      value: "Loading...",
      Icon: TbCircleLetterKFilled,
    },
  ]);

  useEffect(() => {
    // Function to fetch and update sensor data
    const fetchAndUpdateData = async () => {
      const newData = await getData("data");
      if (newData.length > 0) {
        // Map new values to cardParams
        setCardParams((prevParams) =>
          prevParams.map((card, index) => ({
            ...card,
            value: newData[index]?.value || "N/A", // Assign new value if available
          }))
        );
      }
    };

    // Fetch initially
    fetchAndUpdateData();

    // Fetch data every 30 seconds
    const interval = setInterval(fetchAndUpdateData, 30000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box width={"100%"}>
      <Grid container spacing={3}>
        {cardParams.map((item) => (
          <Grid
            key={item.id}
            size={{ xs: 12, md: 6, lg: 4 }}
            display={"flex"}
            justifyContent={"center"}
          >
            <SmallCard title={item.title} value={item.value} Icon={item.Icon} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Listing;
