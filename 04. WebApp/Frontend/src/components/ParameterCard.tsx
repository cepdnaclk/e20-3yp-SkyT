import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

interface ParamCardProps {
  title: string;
  value?: number | string;
  Icon: React.ElementType;
  units?: string;
}

function ParameterCard({ title, value, Icon, units }: ParamCardProps) {
  const iconWrapperStyles: SxProps = {
    background: `linear-gradient(to bottom right, #2ecc6d, #d9f5e4)`,
    borderBottomRightRadius: "30px",
    borderTopLeftRadius: "5px",
    width: "20%",
    height: "100%",
    paddingRight: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const bodyStyles: SxProps = {
    width: "80%",
    height: "100%",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  };

  return (
    <Card
      elevation={3}
      sx={{
        width: "300px",
        height: "60px",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: "5px 0 5px 0",
      }}
    >
      <Box sx={iconWrapperStyles}>
        <Icon style={{ color: "#fff", fontSize: "2.5rem" }} />
      </Box>

      <Box sx={bodyStyles} fontFamily={"Montserrat"}>
        <Typography variant="body1" fontWeight={630} fontFamily={"inherit"}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={500}
          color="#666666"
          fontFamily={"inherit"}
        >
          {value ? `${value} ${units ?? ""}` : "Loading..."}
        </Typography>
      </Box>
    </Card>
  );
}

export default ParameterCard;
