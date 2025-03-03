import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet for custom icons
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "./MapChart.css";

// Fix missing marker icon
const customIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41], // Default size
  iconAnchor: [12, 41], // Default anchor
});

const MapChart = ({ searchQuery }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json`
        );
        const data = await response.json();
        if (data.length > 0) {
          setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: searchQuery });
        } else {
          console.error("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, [searchQuery]);

  return (
    <div className="mapCard">
      <div className="mapCardBody">
        {location ? (
          <MapContainer center={[location.lat, location.lng]} zoom={12} className="h-64 w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]} icon={customIcon}>
              <Popup>{location.name}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="mapCardHeader">
        <h4>Site Map</h4>
      </div>
    </div>
  );
};

export default MapChart;
