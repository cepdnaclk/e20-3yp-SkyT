import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LotSummaryProps {
  lotId: number;
  lot: string;
  lastUpdate: string;
  location: [number, number];
  temperature: number;
  humididty: number;
  ph: number;
  n: number;
  p: number;
  k: number;
}

interface NodeProps {
  id: string;
  nodeId: string;
  location: [number, number];
  temperature: number;
  humididty: number;
  ph: number;
  n: number;
  p: number;
  k: number;
}

interface MapInterfaceProps {
  lots?: LotSummaryProps[];
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

export default function LeafletMap({
  lots,
  nodes,
  office,
  searching,
  handleNavigate,
}: MapInterfaceProps) {
  const mapCenter = office?.location ?? [7.2575, 80.5918]; // Fallback to Peradeniya if office is not given

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

      {/* Office Marker */}
      {office && (
        <Marker position={office.location} icon={defaultIcon}>
          <Popup>{office.name}</Popup>
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
            <br />
            Temp: {lot.temperature}°C
            <br />
            Humidity: {lot.humididty}%
            <br />
            pH: {lot.ph}
            <br />
            N: {lot.n}, P: {lot.p}, K: {lot.k}
            <br />
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
        <Marker key={node.id} position={node.location} icon={greenIcon}>
          <Popup>
            <strong>{node.nodeId}</strong>
            <br />
            Temp: {node.temperature}°C
            <br />
            Humidity: {node.humididty}%
            <br />
            pH: {node.ph}
            <br />
            N: {node.n}, P: {node.p}, K: {node.k}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
