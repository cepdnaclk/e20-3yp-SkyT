import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import LeafletMap from "../components/LeafletMap";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getData } from "../api/NodeBackend";
import { ToastAlert } from "../components/ToastAlert";
import { AxiosError } from "axios";
import { useLoading } from "../context/LoadingContext";

interface CenterProps {
  name: string;
  location: [number, number];
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

interface ErrorResponse {
  error: string;
}

function LotMap() {
  const lotId = useLocation().pathname.split("/")[5];
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const [center, setCenter] = useState<CenterProps>();
  const [lotInfo, setLotInfo] = useState<NodeProps[]>();

  useEffect(() => {
    const getInfo = async () => {
      const url = `lots/nodes/${user?.userId}/${lotId}`;
      setLoading(true);

      try {
        const serverResponse = await getData(url);
        if (serverResponse.status === 200) {
          const { message, home, nodes } = serverResponse.data;
          console.log(message);
          setCenter(home);
          setLotInfo(nodes);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 400) {
          console.log(error.response?.data?.error);
          errMsg = error.response?.data?.error;
        }

        console.log("Estate Error:", errMsg);
        ToastAlert({
          type: "error",
          title: errMsg || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lotId, user]);

  return (
    <Box bgcolor={"rosybrown"} width={"100%"} height={"100%"}>
      <LeafletMap office={center} nodes={lotInfo} />
    </Box>
  );
}

export default LotMap;
