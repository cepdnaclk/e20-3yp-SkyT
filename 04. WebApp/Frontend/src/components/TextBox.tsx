import { TextField, TextFieldProps } from "@mui/material";

function TextBox({ error, value, sx, slotProps, ...rest }: TextFieldProps) {
  return (
    <TextField
      fullWidth
      value={value || ""}
      error={error}
      {...rest}
      sx={{
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: error ? "red" : "#666666",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "red" : "#666666",
          },
        },
        ...sx,
      }}
      slotProps={{
        input: {
          sx: {
            fontFamily: "Montserrat",
          },
        },
        inputLabel: {
          color: error ? "error" : "default",
          sx: {
            fontFamily: "Montserrat",
          },
        },
        ...slotProps,
      }}
    />
  );
}

export default TextBox;
