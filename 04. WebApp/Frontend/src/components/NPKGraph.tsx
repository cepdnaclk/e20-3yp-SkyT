import {
  alpha,
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ArrowDropDown } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { DatasetElementType } from "@mui/x-charts/internals";
import { postData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { ToastAlert } from "./ToastAlert";

interface TimeRangeSelectorProps {
  range?: string;
  setRange: (value: string) => void;
}

interface CheckboxListProps {
  visibleParas: string[];
  setVisibleParas: (paras: string[]) => void;
}

interface NPKGraphProps {
  userId?: number;
  lotId?: number;
}

interface NPKProps {
  date: string;
  n: number;
  p: number;
  k: number;
}

interface ErrorResponse {
  error: string;
}

const ThemeColor = "#00796b"; // Color Theme

const COLORS: Record<string, string> = {
  N: "#4caf50",
  P: "#ff9800",
  K: "#2196f3",
};

function TimeRangeSelector({ range, setRange }: TimeRangeSelectorProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title={"Range"}>
        <Button
          endIcon={<ArrowDropDown />}
          variant="outlined"
          onClick={handleClick}
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 20,
            width: "145px",
            border: "2px solid",
            bgcolor: alpha(ThemeColor, 0.15),
            color: ThemeColor,
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          Last {range}
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: "120px",
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => setRange("Week")}
          sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
        >
          Last Week
        </MenuItem>

        <MenuItem
          onClick={() => setRange("Month")}
          sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
        >
          Last Month
        </MenuItem>

        <MenuItem
          onClick={() => setRange("Year")}
          sx={{ fontFamily: "Montserrat", fontWeight: 500 }}
        >
          Last Year
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

function CheckboxList({ visibleParas, setVisibleParas }: CheckboxListProps) {
  const handleParamChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name.toLowerCase();
    const updated = visibleParas.includes(name)
      ? visibleParas.filter((param) => param !== name)
      : [...visibleParas, name];

    setVisibleParas(updated);
  };

  return (
    <FormGroup
      row
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {Object.keys(COLORS).map((param) => (
        <FormControlLabel
          key={param}
          control={
            <Checkbox
              checked={visibleParas.includes(param.toLowerCase())}
              onChange={handleParamChange}
              name={param}
              sx={{
                color: COLORS[param],
                "&.Mui-checked": { color: COLORS[param] },
              }}
            />
          }
          label={param}
        />
      ))}
    </FormGroup>
  );
}

export default function NPKGraph({ userId, lotId }: NPKGraphProps) {
  const [range, setRange] = useState<string>("Week");
  const [visibleParas, setVisibleParas] = useState<string[]>(["n", "p", "k"]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [dataset, setDataset] = useState<DatasetElementType<Date | number>[]>();

  const generateDataSet = (data: NPKProps[]) =>
    data.map((item) => {
      const stdDate = new Date(new Date(item.date).setHours(0, 0, 0, 0));
      const element = { ...item, date: stdDate };
      return element;
    });

  useEffect(() => {
    const getPhData = async () => {
      const data = { userId, lotId, range };
      setLoaded(false);
      try {
        const serverResponse = await postData(data, "lots/npk");
        if (serverResponse.status === 200) {
          const { message, npkData } = serverResponse.data;
          console.log({ message, npkData });
          setDataset(generateDataSet(npkData));
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        const status = error.response?.status;

        let errMsg;

        if (status === 400 || status === 404) {
          console.log(error.response?.data?.error);
          errMsg = error.response?.data?.error;
        }

        console.log("Dashboard Error:", errMsg);
        ToastAlert({
          type: "error",
          title: errMsg || "Something went wrong",
        });
      } finally {
        setLoaded(true);
      }
    };

    getPhData();
  }, [range, userId, lotId]);

  return (
    <Card
      id="npk-graph"
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        fontFamily: "Montserrat",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          NPK Overview
        </Typography>

        <TimeRangeSelector range={range} setRange={setRange} />
      </Box>

      <CheckboxList
        setVisibleParas={setVisibleParas}
        visibleParas={visibleParas}
      />

      {/* Graph Section */}
      {loaded ? (
        <LineChart
          height={274}
          loading={!loaded}
          grid={{ horizontal: true }}
          dataset={dataset}
          series={[
            {
              id: "N",
              label: "Nitrogen (N)",
              dataKey: "n",
              color: COLORS.N,
            },
            {
              id: "P",
              label: "Phosphorus (P)",
              dataKey: "p",
              color: COLORS.P,
            },
            {
              id: "K",
              label: "Potassium (K)",
              dataKey: "k",
              color: COLORS.K,
            },
          ].filter((item) => visibleParas?.includes(item.id.toLowerCase()))}
          xAxis={[
            {
              dataKey: "date",
              valueFormatter: (value: Date) => {
                if (range === "Week") {
                  return `${value.getDate()} ${value.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                    }
                  )}`;
                } else if (range === "Month") {
                  return value.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                } else if (range === "Year") {
                  return value.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  });
                }
                return value.toDateString();
              },
              label: "Date",
              min: dataset?.[0]?.date,
              max: dataset?.[dataset.length - 1]?.date,
              scaleType: "time",
            },
          ]}
          yAxis={[
            {
              min: 0,
              label: "Average N,P,K Values (mg/kg)",
            },
          ]}
          margin={{ top: 10, bottom: 25, left: 40, right: 25 }}
          slotProps={{ legend: { hidden: true } }}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            height: "300px",
            borderRadius: "0 0 8px 8px",
          }}
        />
      )}
    </Card>
  );
}
