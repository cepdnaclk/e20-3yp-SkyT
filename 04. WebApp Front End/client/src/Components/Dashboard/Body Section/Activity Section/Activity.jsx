<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../../widgets/card";
import defaultImage from "../../../../Assets/droneimage.jpeg"; // Default image

function Activity() {
  const [imageData, setImageData] = useState(null);
  const lotNumber =1;// Change as needed

  useEffect(() => {
    const fetchLatestImage = () => {
      axios.get(`http://localhost:5000/api/latest-image/${lotNumber}`).then((response) => {
    console.log("Fetched Image Data:", response.data);
    setImageData(response.data);
  })
  .catch((error) => {
    console.error("Error fetching image:", error);
  });
    };

    // Initial fetch
    fetchLatestImage();

    // Polling every 5 seconds
    const interval = setInterval(fetchLatestImage, 5000);

    return () => clearInterval(interval);
  }, [lotNumber]);

  // Use fetched image or default
  const imageSrc = imageData ? imageData.imageURL : defaultImage;

  return (
    <div>
      <Card
        timestamp={imageData?.timestamp || "10:58:22AM"}
        lotNo={lotNumber}
        imageSrc={imageSrc}
      />
    </div>
  );
}

=======
import MapChart from "./MapChart"; // Ensure correct import

=======
import MapChart from "./MapChart"; // Ensure correct import

>>>>>>> Stashed changes
=======
import MapChart from "./MapChart"; // Ensure correct import

>>>>>>> Stashed changes
const Activity = () => {
  return (
    <div className="activityContainer">
      <h2 className="activityTitle">Location Map</h2>
      <MapChart searchQuery="Kandy" />
    </div>
  );
};

<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
export default Activity;
