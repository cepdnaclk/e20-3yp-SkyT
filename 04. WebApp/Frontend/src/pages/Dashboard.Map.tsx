import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import LeafletMap from "../components/LeafletMap";
import { useEffect, useState } from "react";

interface CenterProps {
  name: string;
  location: [number, number];
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

const PeraCom: [number, number] = [7.254670434402384, 80.5912347236105];

const Nodes: NodeProps[] = [
  {
    id: "1",
    nodeId: "NODE-A1",
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
    nodeId: "NODE-B2",
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
    nodeId: "NODE-C3",
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
    nodeId: "NODE-D4",
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
    nodeId: "NODE-E5",
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
    nodeId: "NODE-F6",
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
    nodeId: "NODE-G7",
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
    nodeId: "NODE-H8",
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
    nodeId: "NODE-I9",
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
    nodeId: "NODE-J10",
    location: [7.2518, 80.593],
    temperature: 28.6,
    humididty: 73,
    ph: 6.7,
    n: 40,
    p: 29,
    k: 49,
  },
];

function LotMap() {
  const lotId = useLocation().pathname.split("/")[5];

  const [center, setCenter] = useState<CenterProps>();
  const [lotInfo, setLotInfo] = useState<NodeProps[]>();

  const getInfo = async (lotId: string) => {
    console.log("Find info on estate: ", lotId);
    setCenter({ name: "PeraCom", location: PeraCom });
    setLotInfo(Nodes);
  };

  useEffect(() => {
    getInfo(lotId);
  }, [lotId]);

  return (
    <Box bgcolor={"rosybrown"} width={"100%"} height={"100%"}>
      <LeafletMap office={center} nodes={lotInfo} />
    </Box>
  );
}

export default LotMap;
