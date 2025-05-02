import { renderToString } from "react-dom/server";
import { TbDrone } from "react-icons/tb";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useState } from "react";

interface DroneStatusProps {
  type: string;
  location: [number, number];
  battery: number; // 0-100
  signal: number; // 0-100
  status: "Active" | "Available" | "Removed" | "Maintenance";
}

export default function DroneMarker({
  type,
  location,
  battery,
  signal,
  status,
}: DroneStatusProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  // Function to get status color
  const getStatusColor = () => {
    switch (status) {
      case "Active":
        return "#4caf50"; // green
      case "Available":
        return "#2196f3"; // blue
      case "Maintenance":
        return "#f44336"; // red
      default:
        return "#9e9e9e"; // gray
    }
  };

  // Function to get battery color
  const getBatteryColor = () => {
    if (battery > 50) return "#4caf50"; // green
    if (battery > 20) return "#ff9800"; // orange
    return "#f44336"; // red
  };

  // Custom Drone Icon SVG with inline styles
  const droneIconSvg = renderToString(
    <div style={{ position: "relative", width: "40px", height: "40px" }}>
      {/* Battery Bar */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "0",
          width: "100%",
          height: "6px",
          backgroundColor: "#cccccc",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${battery}%`,
            height: "100%",
            backgroundColor: getBatteryColor(),
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Drone Icon */}
      <TbDrone
        style={{
          fontSize: "36px",
          color: getStatusColor(),
          transform: hovered ? "scale(1.2)" : "scale(1)",
          transition: "transform 0.2s ease",
        }}
      />
    </div>
  );

  // Create the Leaflet Icon
  const droneMarker = new L.DivIcon({
    className: "",
    html: droneIconSvg,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  return (
    <Marker
      position={location}
      icon={droneMarker}
      eventHandlers={{
        mouseover: () => setHovered(true),
        mouseout: () => setHovered(false),
      }}
    >
      {/* Tooltip on Hover */}
      {hovered && (
        <Tooltip direction="top" offset={[0, -45]} opacity={1} permanent>
          <div
            style={{
              textAlign: "center",
              padding: "8px 12px",
              borderRadius: "12px",
              backgroundColor: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              fontSize: "12px",
              color: "#333",
            }}
          >
            <h4 style={{ margin: "0 0 6px", fontSize: "14px", color: "#555" }}>
              {type} Drone
            </h4>
            <p style={{ margin: "4px 0" }}>
              <strong>Status:</strong>{" "}
              <span style={{ color: getStatusColor() }}>{status}</span>
            </p>
            <p style={{ margin: "4px 0" }}>🔋 Battery: {battery}%</p>
            <p style={{ margin: "4px 0" }}>📶 Signal: {signal}%</p>
          </div>
        </Tooltip>
      )}
    </Marker>
  );
}
