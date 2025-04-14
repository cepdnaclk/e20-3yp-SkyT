import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LotSummaryProps {
  id: string;
  lotId: string;
  lastUpdate: string;
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
  office?: [number, number];
  searching?: string[];
  handleNavigate: (lotId: string) => void;
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
  office,
  searching,
  handleNavigate,
}: MapInterfaceProps) {
  const mapCenter = office ?? [7.2575, 80.5918]; // Fallback to Peradeniya if office is not given

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
        <Marker position={office} icon={defaultIcon}>
          <Popup>Peracom Office</Popup>
        </Marker>
      )}

      {/* Lots Markers */}
      {lots?.map((lot) => (
        <Marker
          key={lot.id}
          position={lot.location}
          icon={searching?.includes(lot.id) ? redIcon : greenIcon}
        >
          <Popup>
            <strong>{lot.lotId}</strong>
            <br />
            Temp: {lot.temperature}°C
            <br />
            Humidity: {lot.humididty}%
            <br />
            pH: {lot.ph}
            <br />
            N: {lot.n}, P: {lot.p}, K: {lot.k}
            <br />
            <button onClick={() => handleNavigate(lot.id)}>View Lot</button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
