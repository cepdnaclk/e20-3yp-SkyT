import { CSSProperties } from "react";
import { PulseLoader } from "react-spinners";
import { Box } from "@mui/material";
import { useLoading } from "../context/LoadingContext";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
};

export default function LoadingSpinner() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        width: "100vw",
        bgcolor: "rgba(20, 20, 20, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "100",
      }}
    >
      <PulseLoader
        color="white"
        loading={loading}
        cssOverride={override}
        size={15}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </Box>
  );
}
