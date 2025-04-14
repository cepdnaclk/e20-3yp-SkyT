import { Box, ImageList, ImageListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FillButton from "./FillButton";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
];

export default function ImagePreviewGrid() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "400px",
        position: "relative",
        bgcolor: "darkblue",
        m: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ImageList
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
        cols={2}
        rowHeight={200}
      >
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=200&h=200&fit=crop&auto=format`}
              srcSet={`${item.img}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {hovered && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(255, 255, 255, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          <FillButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/gallery")}
          >
            View Gallery
          </FillButton>
        </Box>
      )}
    </Box>
  );
}
