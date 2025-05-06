import { Button, ButtonProps } from "@mui/material";

function FillButton({ children, sx, ...rest }: ButtonProps) {
  return (
    <Button
      {...rest}
      sx={{
        backgroundColor: "#00796b",
        borderRadius: "10px",
        color: "#fff",
        fontWeight: "700",
        "&:hover": {
          backgroundColor: "#004d40",
          color: "#fff",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

export default FillButton;
