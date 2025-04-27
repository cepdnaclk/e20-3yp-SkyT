import * as React from "https://cdn.skypack.dev/react@18.2.0";
    import * as ReactDOM from "https://cdn.skypack.dev/react-dom@18.2.0";
    import {
      Box,
      Checkbox,
      Container,
      IconButton,
      InputAdornment,
      Paper,
      Table,
      TableBody,
      TableCell,
      TableContainer,
      TableHead,
      TableRow,
      TextField,
      Typography,
      Chip,
      Stack,
      Pagination,
      PaginationItem,
    } from "https://cdn.skypack.dev/@mui/material@5.13.7";
    import SearchIcon from "https://cdn.skypack.dev/@mui/icons-material/Search";
    import InfoIcon from "https://cdn.skypack.dev/@mui/icons-material/InfoOutlined";
    import ArrowBackIosNewIcon from "https://cdn.skypack.dev/@mui/icons-material/ArrowBackIosNew";
    import ArrowForwardIosIcon from "https://cdn.skypack.dev/@mui/icons-material/ArrowForwardIos";

    interface Order {
      id: string;
      date: string;
      enabled: boolean;
      online: boolean;
      error: boolean;
      disabled: boolean;
      offline: boolean;
    }

    const orders: Order[] = [
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: true, online: true, error: false, disabled: false, offline: false },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: true, online: true, error: false, disabled: false, offline: false },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: true, online: false, error: true, disabled: false, offline: false },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: false, online: false, error: false, disabled: true, offline: true },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: true, online: true, error: false, disabled: false, offline: false },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: false, online: false, error: false, disabled: true, offline: true },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: true, online: false, error: true, disabled: false, offline: false },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: false, online: false, error: false, disabled: true, offline: true },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: true, online: false, error: true, disabled: false, offline: false },
      { id: "AG-02-000123", date: "Oct 12, 2023", enabled: false, online: false, error: false, disabled: true, offline: true },
    ];

    const StatusChip: React.FC<{ label: string; color: "blue" | "green" | "red" | "gray"; icon?: React.ReactNode }> = ({
      label,
      color,
      icon,
    }) => {
      const colorMap = {
        blue: { bg: "#DBEAFE", text: "#2563EB" },
        green: { bg: "#DCFCE7", text: "#16A34A" },
        red: { bg: "#FEE2E2", text: "#B91C1C" },
        gray: { bg: "#E5E7EB", text: "#6B7280" },
      };
      const { bg, text } = colorMap[color];
      return (
        <Chip
          label={
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ fontSize: 10, fontWeight: 600 }}>
              {label}
              {icon}
            </Stack>
          }
          sx={{
            bgcolor: bg,
            color: text,
            height: 22,
            fontWeight: 600,
            fontSize: 10,
            borderRadius: 1,
            px: 1.5,
          }}
          size="small"
        />
      );
    };

    const App: React.FC = () => {
      const [search, setSearch] = React.useState("");

      const filteredOrders = orders.filter(
        (order) =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.date.toLowerCase().includes(search.toLowerCase())
      );

      return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #E5E7EB",
              p: 3,
            }}
          >
            <Box component="form" mb={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search orders"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9CA3AF" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: "#F9FAFB",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#60A5FA",
                    boxShadow: "0 0 0 2px #BFDBFE",
                  },
                  "& input::placeholder": {
                    color: "#9CA3AF",
                    fontSize: 14,
                  },
                }}
                inputProps={{ "aria-label": "Search orders" }}
              />
            </Box>
            <TableContainer>
              <Table size="small" aria-label="orders table" sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: "#F9FAFB",
                      color: "#9CA3AF",
                      fontSize: 12,
                      fontWeight: 400,
                      "& th": { borderBottom: "none", color: "#9CA3AF", fontWeight: 400, fontSize: 12 },
                    }}
                  >
                    <TableCell sx={{ width: 40, pl: 1 }}>
                      <Checkbox size="small" inputProps={{ "aria-label": "Select all orders" }} />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        bgcolor: "white",
                        borderRadius: 2,
                        boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
                        "& td": { borderBottom: "none", verticalAlign: "top", py: 1.5 },
                      }}
                    >
                      <TableCell sx={{ pl: 1 }}>
                        <Checkbox size="small" />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600} fontSize={14} color="#111827">
                          {order.id}
                        </Typography>
                        <Typography fontSize={12} color="#9CA3AF" mt={0.3}>
                          {order.date}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {order.enabled && <StatusChip label="Enabled" color="blue" />}
                          {order.disabled && <StatusChip label="Disabled" color="gray" />}
                          {order.online && <StatusChip label="Online" color="green" />}
                          {order.offline && <StatusChip label="Offline" color="gray" />}
                          {order.error && <StatusChip label="Error" color="red" icon={<InfoIcon sx={{ fontSize: 12 }} />} />}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box mt={4} display="flex" justifyContent="center" alignItems="center" color="#9CA3AF" fontSize={20} userSelect="none">
              <IconButton aria-label="Previous page" size="small" sx={{ color: "inherit" }}>
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <Stack direction="row" spacing={1} mx={2} alignItems="center">
                <Box width={8} height={8} borderRadius="50%" bgcolor="#6B7280" />
                <Box
                  width={8}
                  height={8}
                  borderRadius="50%"
                  border="1px solid #6B7280"
                  sx={{ backgroundColor: "transparent" }}
                />
              </Stack>
              <IconButton aria-label="Next page" size="small" sx={{ color: "inherit" }}>
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Container>
      );