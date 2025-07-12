import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LeafletMap from "../components/LeafletMap";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { postData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { ToastAlert } from "../components/ToastAlert";
import { useLoading } from "../context/LoadingContext";

interface OfficeProps {
  name: string;
  location: [number, number];
}

interface EstateProps {
  search: string;
}

interface LotSummaryProps {
  lotId: number;
  lot: string;
  lastUpdate: string;
  location: [number, number];
  temperature: number;
  humidity: number;
  ph: number;
  n: number;
  p: number;
  k: number;
}

interface savedProps {
  id: number;
  lot: string;
}

interface ErrorResponse {
  error: string;
}

interface serverResponse {
  message: string;
  summary: LotSummaryProps[];
  office: OfficeProps;
}

function Estate({ search }: EstateProps) {
  const estateId = useLocation().pathname.split("/")[3];
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setLoading } = useLoading();

  const [office, setOffice] = useState<OfficeProps>();
  const [estateInfo, setEstateInfo] = useState<LotSummaryProps[]>();

  useEffect(() => {
    const getInfo = async () => {
      console.log("Find info on estate: ", estateId);
      setLoading(true);

      try {
        const data = { userId: user?.userId, estateId };

        const serverResponse = await postData(data, "estates");

        if (serverResponse.status === 200) {
          const { message, summary, office }: serverResponse =
            serverResponse.data;
          console.log({ message, office });
          setOffice(office);
          setEstateInfo(summary);

          const savedList: savedProps[] = [];
          summary.map((l) => {
            const item = { id: l.lotId, lot: l.lot };
            savedList.push(item);
          });

          sessionStorage.setItem("lots", JSON.stringify(savedList));
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 401 || status === 400) {
          console.log(error.response?.data?.error);
          errMsg = error.response?.data?.error;
        }

        console.log("Dashboard Error:", errMsg);
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
  }, [estateId, user]);

  const searchedLots = estateInfo
    ?.filter(
      (lot) => search && lot.lot.toLowerCase().includes(search.toLowerCase())
    )
    .map((lot) => lot.lotId);

  const handleNavigate = (lotId: number) => {
    console.log("Navigate to: ", lotId);
    const path = `/home/estate/${estateId}/lot/${lotId}`;
    navigate(path);
  };

  return (
    <Box bgcolor={"rosybrown"} width={"100%"} height={"100%"}>
      <LeafletMap
        office={office}
        lots={estateInfo}
        searching={searchedLots}
        handleNavigate={handleNavigate}
      />
    </Box>
  );
}

export default Estate;
