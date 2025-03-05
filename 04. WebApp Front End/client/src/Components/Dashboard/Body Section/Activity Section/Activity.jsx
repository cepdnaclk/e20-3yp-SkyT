import { useEffect, useState } from "react";
import Card from "../../../widgets/card";
import { Grid2 as Grid } from "@mui/material";
import { getData } from "../../../../Api/Api";
import dronecapture from "../../../../Assets/droneimage.jpeg";

function Activity() {
  const [imageCards, setImageCards] = useState([]);

  useEffect(() => {
    // Fetch data once on mount
    const fetchImages = async () => {
      try {
        const data = await getData("images?lotId=1"); // Fetch JSON data
        console.log("Images: ", data.data);
        if (data.data && Array.isArray(data.data)) {
          setImageCards(data.data);
        }
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    fetchImages(); // Call fetch function once on mount
  }, []); // Empty dependency array ensures it runs only once

  return (
    <Grid container spacing={3} width={"100%"}>
      {imageCards.length > 0 ? (
        imageCards.map((item) => (
          <Grid key={item.id} size={{ xs: 12, md: 6, lg: 3 }}>
            <Card
              timestamp={item.timestamp || "Unknown Time"}
              lotNo={item.lotNo || "Unknown Lot"}
              imageSrc={item.imageSrc || dronecapture} // Default image if missing
            />
          </Grid>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </Grid>
  );
}

export default Activity;
