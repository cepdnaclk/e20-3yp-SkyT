import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LeafletMap from "../components/LeafletMap";
import { useEffect, useState } from "react";

interface EstateProps {
  search: string;
}

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

const PeraCom: [number, number] = [7.254670434402384, 80.5912347236105];

const LOTS: LotSummaryProps[] = [
  {
    id: "1",
    lotId: "LOT-A1",
    lastUpdate: "2025-04-10T10:00:00Z",
    location: [7.2531, 80.591],
    temperature: 28.5,
    humididty: 75,
    ph: 6.7,
    n: 40,
    p: 30,
    k: 45,
  },
  {
    id: "2",
    lotId: "LOT-B2",
    lastUpdate: "2025-04-10T10:15:00Z",
    location: [7.254, 80.5925],
    temperature: 29.0,
    humididty: 73,
    ph: 6.5,
    n: 42,
    p: 28,
    k: 46,
  },
  {
    id: "3",
    lotId: "LOT-C3",
    lastUpdate: "2025-04-10T10:30:00Z",
    location: [7.2538, 80.593],
    temperature: 28.2,
    humididty: 70,
    ph: 6.6,
    n: 41,
    p: 32,
    k: 44,
  },
  {
    id: "4",
    lotId: "LOT-D4",
    lastUpdate: "2025-04-10T10:45:00Z",
    location: [7.2525, 80.591],
    temperature: 27.9,
    humididty: 76,
    ph: 6.8,
    n: 39,
    p: 31,
    k: 43,
  },
  {
    id: "5",
    lotId: "LOT-E5",
    lastUpdate: "2025-04-10T11:00:00Z",
    location: [7.2542, 80.59],
    temperature: 28.7,
    humididty: 72,
    ph: 6.4,
    n: 43,
    p: 29,
    k: 42,
  },
  {
    id: "6",
    lotId: "LOT-F6",
    lastUpdate: "2025-04-10T11:15:00Z",
    location: [7.255, 80.5917],
    temperature: 29.1,
    humididty: 71,
    ph: 6.9,
    n: 46,
    p: 33,
    k: 41,
  },
  {
    id: "7",
    lotId: "LOT-G7",
    lastUpdate: "2025-04-10T11:30:00Z",
    location: [7.2515, 80.592],
    temperature: 28.3,
    humididty: 74,
    ph: 6.7,
    n: 44,
    p: 30,
    k: 47,
  },
  {
    id: "8",
    lotId: "LOT-H8",
    lastUpdate: "2025-04-10T11:45:00Z",
    location: [7.2536, 80.594],
    temperature: 28.9,
    humididty: 70,
    ph: 6.6,
    n: 47,
    p: 27,
    k: 48,
  },
  {
    id: "9",
    lotId: "LOT-I9",
    lastUpdate: "2025-04-10T12:00:00Z",
    location: [7.252, 80.5908],
    temperature: 29.2,
    humididty: 69,
    ph: 6.5,
    n: 42,
    p: 28,
    k: 46,
  },
  {
    id: "10",
    lotId: "LOT-J10",
    lastUpdate: "2025-04-10T12:15:00Z",
    location: [7.2518, 80.593],
    temperature: 28.6,
    humididty: 73,
    ph: 6.7,
    n: 40,
    p: 29,
    k: 49,
  },
];

function Estate({ search }: EstateProps) {
  const estateId = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();

  const [center, setCenter] = useState<[number, number]>();
  const [estateInfo, setEstateInfo] = useState<LotSummaryProps[]>();

  const getInfo = async (estateId: string) => {
    console.log("Find info on estate: ", estateId);
    setCenter(PeraCom);
    setEstateInfo(LOTS);
  };

  useEffect(() => {
    getInfo(estateId);
  }, [estateId]);

  const searchedLots = estateInfo
    ?.filter(
      (lot) => search && lot.lotId.toLowerCase().includes(search.toLowerCase())
    )
    .map((lot) => lot.id);

  const handleNavigate = (lotId: string) => {
    console.log("Navigate to: ", lotId);
    const path = `/home/estate/${estateId}/lot/${lotId}`;
    navigate(path);
  };

  return (
    <Box bgcolor={"rosybrown"} width={"100%"} height={"100%"}>
      <LeafletMap
        office={center}
        lots={estateInfo}
        searching={searchedLots}
        handleNavigate={handleNavigate}
      />
    </Box>
  );
}

export default Estate;
