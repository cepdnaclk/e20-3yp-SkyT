import { TextField, InputAdornment, Card, TextFieldProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBox({ value, ...rest }: TextFieldProps) {
  return (
    <Card elevation={3} sx={{ py: "0.2rem" }}>
      <TextField
        variant="outlined"
        fullWidth
        value={value}
        {...rest}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon style={{ fontSize: "18px", cursor: "pointer" }} />
              </InputAdornment>
            ),
            sx: {
              height: "35px",
              fontSize: "15px",
              fontFamily: "Montserrat",
              fontWeight: 500,
              borderRadius: "5px",
              py: "1rem",
              color: "#666666",
            },
          },
        }}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
    </Card>
  );
}

export default SearchBox;
