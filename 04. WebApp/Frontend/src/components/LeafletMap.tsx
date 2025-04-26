import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { Typography } from "@mui/material";

interface LotProps {
  lotId: number;
  lot: string;
  location: [number, number];
  lastUpdate?: string;
  temperature?: number;
  humidity?: number;
  ph?: number;
  n?: number;
  p?: number;
  k?: number;
}

interface NodeProps {
  nodeId: number;
  node: string;
  location: [number, number];
  temperature: string;
  humididty: string;
  ph: string;
  n: string;
  p: string;
  k: string;
}

interface MapInterfaceProps {
  lots?: LotProps[];
  nodes?: NodeProps[];
  office?: {
    name: string;
    location: [number, number];
  };
  searching?: number[];
  handleNavigate?: (lotId: number) => void;
}

// Custom Marker Icons
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultCenter: [number, number] = [7.2575, 80.5918];

function SetMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LeafletMap({
  lots,
  nodes,
  office,
  searching,
  handleNavigate,
}: MapInterfaceProps) {
  const mapCenter = office?.location || defaultCenter;

  return (
    <MapContainer
      center={mapCenter}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SetMapCenter center={mapCenter} />

      {/* Office Marker */}
      {office && (
        <Marker position={office.location} icon={defaultIcon}>
          <Popup>
            <strong>{office.name}</strong>
          </Popup>
        </Marker>
      )}

      {/* Lots Markers */}
      {lots?.map((lot) => (
        <Marker
          key={lot.lotId}
          position={lot.location}
          icon={searching?.includes(lot.lotId) ? redIcon : greenIcon}
        >
          <Popup>
            <strong>{lot.lot}</strong>

            {lot.lastUpdate && (
              <Typography variant="body2" color="text.secondary">
                {lot.temperature && `Temperature: ${lot.temperature}°C`}
                <br />
                {lot.humidity && `Humidity: ${lot.humidity}%`}
                <br />
                {lot.ph && `pH: ${lot.ph}`}
                <br />
                {lot.n && `N: ${lot.n} mg/kg`}
                <br />
                {lot.p && `P: ${lot.p} mg/kg`}
                <br />
                {lot.k && `K: ${lot.k} mg/kg`}
                <br />
              </Typography>
            )}
            {handleNavigate && (
              <button onClick={() => handleNavigate(lot.lotId)}>
                View Lot
              </button>
            )}
          </Popup>
        </Marker>
      ))}

      {/* Node Markers */}
      {nodes?.map((node) => (
        <Marker key={node.nodeId} position={node.location} icon={greenIcon}>
          <Popup>
            <strong>{node.node}</strong>
            <br />
            Temp: {node.temperature}°C
            <br />
            Humidity: {node.humididty}%
            <br />
            pH: {node.ph}
            <br />
            N: {node.n}mg/kg <br />
            P: {node.p}mg/kg <br />
            K: {node.k}mg/kg
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
