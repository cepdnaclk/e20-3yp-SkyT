import React from "react";
import MapChart from "./MapChart"; // Ensure correct import

const Activity = () => {
  return (
    <div className="activityContainer">
      <h2 className="activityTitle">Location Map</h2>
      <MapChart searchQuery="Kandy" />
    </div>
  );
};

export default Activity;
