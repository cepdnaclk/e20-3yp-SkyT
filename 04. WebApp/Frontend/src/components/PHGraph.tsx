import {
  alpha,
  Box,
  Button,
  Card,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { ArrowDropDown } from "@mui/icons-material";
import React, { useState } from "react";
import { DatasetElementType } from "@mui/x-charts/internals";

interface TimeRangeSelectorProps {
  range?: string;
  setRange: (value: string) => void;
}

interface PHGraphProps {
  loaded: boolean;
  dataset?: DatasetElementType<Date | number>[];
}

const ThemeColor = "#00796b"; // Color Theme

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

export default function PHGraph({ loaded, dataset }: PHGraphProps) {
  const [range, setRange] = useState<string>("Week");

  return (
    <Card
      id="ph-graph"
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        fontFamily: "Montserrat",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          pH Overview
        </Typography>

        <TimeRangeSelector range={range} setRange={setRange} />
      </Box>

      {/* Graph Section */}
      <LineChart
        height={300}
        grid={{ horizontal: true }}
        loading={!loaded}
        dataset={dataset}
        series={[
          {
            dataKey: "ph",
            area: true,
            label: "pH",
            showMark: false,
          },
        ]}
        xAxis={[
          {
            dataKey: "date",
            valueFormatter: (value: Date) => {
              if (range === "Week") {
                return `${value.getDate()} ${value.toLocaleDateString("en-US", {
                  weekday: "short",
                })}`;
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
            max: 10,
            label: "Average pH Value",
            colorMap: {
              type: "continuous",
              min: 0,
              max: 10,
              color: ["#e0f2f1", ThemeColor],
            },
          },
        ]}
        margin={{ top: 10, bottom: 25, right: 25, left: 40 }}
        slotProps={{ legend: { hidden: true } }}
      />
    </Card>
  );
}
