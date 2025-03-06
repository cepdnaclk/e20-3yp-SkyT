import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const LotCard = ({ timestamp, lotNo, imageSrc }) => {
  return (
    <Card
      elevation={4}
      sx={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        padding: "1rem",
      }}
    >
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" component="div">
          Lot No: {lotNo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {timestamp}
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        image={imageSrc}
        alt="Lot Image"
        sx={{
          width: "100%",
          height: "auto",
          borderRadius: "10px",
        }}
      />
    </Card>
  );
};

export default LotCard;
