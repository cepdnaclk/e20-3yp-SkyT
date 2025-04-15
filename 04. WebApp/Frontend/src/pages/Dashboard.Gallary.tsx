import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface ImageCardProps {
  id: string;
  img: string;
  date: string;
}

const imageCardData: ImageCardProps[] = [
  {
    id: "img1",
    img: "https://via.placeholder.com/300x200?text=Image+1",
    date: "Apr 01, 2025",
  },
  {
    id: "img2",
    img: "https://via.placeholder.com/300x200?text=Image+2",
    date: "Apr 02, 2025",
  },
  {
    id: "img3",
    img: "https://via.placeholder.com/300x200?text=Image+3",
    date: "Apr 03, 2025",
  },
  {
    id: "img4",
    img: "https://via.placeholder.com/300x200?text=Image+4",
    date: "Apr 04, 2025",
  },
  {
    id: "img5",
    img: "https://via.placeholder.com/300x200?text=Image+5",
    date: "Apr 05, 2025",
  },
  {
    id: "img6",
    img: "https://via.placeholder.com/300x200?text=Image+6",
    date: "Apr 06, 2025",
  },
  {
    id: "img7",
    img: "https://via.placeholder.com/300x200?text=Image+7",
    date: "Apr 07, 2025",
  },
  {
    id: "img8",
    img: "https://via.placeholder.com/300x200?text=Image+8",
    date: "Apr 08, 2025",
  },
  {
    id: "img9",
    img: "https://via.placeholder.com/300x200?text=Image+9",
    date: "Apr 09, 2025",
  },
  {
    id: "img10",
    img: "https://via.placeholder.com/300x200?text=Image+10",
    date: "Apr 10, 2025",
  },
];

export default function Gallary() {
  const path = useLocation().pathname;
  const lotId = path.split("/")[5];

  const [latestImages, setLatestImages] = useState<ImageCardProps[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const getImages = (lot: string, lastItem: string) => {
    setLoading(true);
    console.log("Fetching early images: " + lot + "lastId: " + lastItem);
    setLatestImages(imageCardData);
    setLoading(false);
  };

  useEffect(() => {
    getImages(lotId, "img1");
  }, [lotId]);

  const handleClick = () => {
    console.log("Fetching more images!");
    const len = latestImages?.length;
    const lastId = latestImages?.[len! - 1].id;
    if (lastId) {
      getImages(lotId, lastId);
    }
  };

  return (
    <Box width={"100%"}>
      <Typography
        fontFamily={"Montserrat"}
        variant="h5"
        fontWeight={600}
        noWrap
        mb={1}
      >
        Gallary
      </Typography>

      <Grid
        size={12}
        maxHeight={"calc(100vh - 250px)"}
        overflow={"auto"}
        container
        py={"10px"}
        display={"flex"}
        justifyContent={"space-around"}
      >
        {latestImages?.map((image) => (
          <Card
            key={image.id}
            elevation={3}
            sx={{
              p: 2,
              width: "320px",
              borderRadius: 2,
              fontFamily: "Montserrat",
              height: "200px",
              m: 1,
            }}
          >
            <CardMedia
              component="img"
              height="170"
              image={image.img}
              alt={image.id}
            />
            <CardContent>
              <Typography
                textAlign={"center"}
                variant="body2"
                sx={{ color: "text.secondary" }}
              >
                Captured on: {image.date}
              </Typography>
            </CardContent>
          </Card>
        ))}

        <Stack
          mt={2}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Button
            variant="outlined"
            onClick={handleClick}
            disabled={loading}
            color="success"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 600,
              width: "150px",
              border: "2px solid",
              borderRadius: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "View More"
            )}
          </Button>
        </Stack>
      </Grid>
    </Box>
  );
}
