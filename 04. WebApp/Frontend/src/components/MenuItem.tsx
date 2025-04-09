import { Box, Typography } from "@mui/material";
import { ReactElement } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface ItemProps {
  label: string;
  icon: ReactElement;
  path: string;
}

export default function MenuItem({ label, icon, path }: ItemProps) {
  const isActive = useLocation().pathname == path;

  return (
    <Box
      component={NavLink}
      to={path}
      display="flex"
      alignItems="center"
      gap={1}
      mb={1}
      padding="10px 16px"
      width="80%"
      color={isActive ? "rgb(0,0,0)" : "rgb(0,0,0,0.5)"}
      sx={{
        cursor: "pointer",
        "&:hover": {
          color: "rgb(0,0,0)",
        },
        textDecoration: "none",
      }}
    >
      <Box
        bgcolor={"rgb(34, 197, 94)"}
        width={"5px"}
        height={"100%"}
        mr={1.5}
        borderRadius={"0px 10px 10px 0"}
      />
      {icon}
      <Typography
        fontFamily={"Montserrat"}
        variant="subtitle1"
        fontWeight={600}
      >
        {label}
      </Typography>
    </Box>
  );
}
