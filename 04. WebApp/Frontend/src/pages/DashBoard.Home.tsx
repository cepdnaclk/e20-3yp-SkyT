import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { ToastAlert } from "../components/ToastAlert";
import defaultImage from "../assets/dashboard_asserts/Estate.jpg";

interface estateProps {
  id: number;
  estate: string;
  address: string;
  image: string;
}

interface estateCardProps {
  estate: estateProps;
}

interface savedProps {
  id: number;
  estate: string;
}

interface ErrorResponse {
  error: string;
}

interface ServerResponse {
  message: string;
  estList: estateProps[];
}

function EstateCard({ estate }: estateCardProps) {
  return (
    <Grid
      size={{ xs: 12, md: 6, lg: 4 }}
      display={"flex"}
      justifyContent={"center"}
    >
      <Card
        component={NavLink}
        to={`/home/estate/${estate.id}`}
        elevation={3}
        sx={{
          width: 345,
          maxHeight: 242,
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="150"
            image={estate.image || defaultImage}
            alt={estate.estate}
          />

          <CardContent sx={{ fontFamily: "Montserrat" }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              fontFamily={"inherit"}
              fontWeight={600}
            >
              {estate.estate}
            </Typography>
            <Typography
              variant="body2"
              fontFamily={"inherit"}
              fontWeight={550}
              sx={{ color: "text.secondary" }}
            >
              {estate.address}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

function Dashboard({ search }: { search: string }) {
  const { user } = useAuth();
  const [estates, setEstates] = useState<estateProps[]>();

  useEffect(() => {
    const getInfo = async () => {
      const url = `estates/${user?.userId}`;

      try {
        const serverResponse = await getData(url);
        if (serverResponse.status === 200) {
          const { message, estList }: ServerResponse = serverResponse.data;
          console.log(message);
          setEstates(estList);

          const savedList: savedProps[] = [];
          estList.map((estate) => {
            const item = { id: estate.id, estate: estate.estate };
            savedList.push(item);
          });
          sessionStorage.setItem("estates", JSON.stringify(savedList));
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 404 || status === 400) {
          console.log(error.response?.data?.error);
          errMsg = error.response?.data?.error;
        }

        console.log("Estate Error:", errMsg);
        ToastAlert({
          type: "error",
          title: errMsg || "Something went wrong",
        });
      }
    };

    getInfo();
  }, [user?.userId]);

  const filteredEstates = estates?.filter(
    (est) =>
      est.estate.toLowerCase().includes(search.toLowerCase()) ||
      est.address.toLowerCase().includes(search.toLowerCase())
  );

  return filteredEstates?.map((estate) => (
    <EstateCard key={estate.id} estate={estate} />
  ));
}

export default Dashboard;
