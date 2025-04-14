import {
  alpha,
  Box,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useDate } from "../utils/useDate";
import { useEffect, useState } from "react";

interface SummaryCardProps {
  id?: string;
  due?: string;
  task?: string;
  tag?: string;
}

interface TaskCardProps {
  path?: string;
  tasks?: SummaryCardProps[];
}

const COLOR = {
  safe: "#009a68",
  risk: "#e10034",
};

function SummaryCard({ data }: { data?: SummaryCardProps }) {
  const { date: fullDate } = useDate(); // e.g., "2025 Apr 14"
  const [isToday, setIsToday] = useState<boolean>(false);

  useEffect(() => {
    if (!data?.due) return;

    // Extract "Apr 14" part from "2025 Apr 14"
    const todayShort = fullDate.split(",")[0]; // "Apr 14"
    //console.log(todayShort);
    setIsToday(data.due === todayShort);
  }, [data?.due, fullDate]);

  return (
    <Stack
      direction={"row"}
      border={"1.5px solid #cccccc"}
      borderRadius={2}
      padding={1}
      width={"95%"}
      my={0.75}
    >
      <Box
        width={70}
        height={50}
        bgcolor={alpha(isToday ? COLOR.risk : COLOR.safe, 0.2)}
        borderRadius={2}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        fontWeight={600}
        color={isToday ? COLOR.risk : COLOR.safe}
        mr={1}
      >
        {data?.due}
      </Box>

      <Box fontFamily={"Montserrat"}>
        <Typography fontFamily={"inherit"} fontWeight={600}>
          {data?.task}
        </Typography>
        <Typography
          fontFamily={"inherit"}
          fontWeight={550}
          bgcolor={"#d9d9d9"}
          borderRadius={2}
          width={80}
          textAlign={"center"}
          variant="subtitle2"
          color="text.secondary"
        >
          {data?.tag}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function TaskSummaryCard({ path, tasks }: TaskCardProps) {
  return (
    <Card
      elevation={3}
      sx={{
        p: 2,
        width: "320px",
        borderRadius: 2,
        fontFamily: "Montserrat",
        height: "200px",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h6" fontFamily={"inherit"} fontWeight={600}>
          Task Managment
        </Typography>

        <Tooltip title={"View More"}>
          <IconButton
            href={path + "/taskmanager"}
            color="success"
            sx={{
              border: "1px solid  #00796b",
              borderRadius: 2,
              padding: "1px",
              textAlign: "center",
            }}
          >
            <ArrowOutwardIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Stack alignItems={"center"} justifyContent={"center"}>
        {tasks ? (
          tasks.map((task) => <SummaryCard key={task.id} data={task} />)
        ) : (
          <Box
            width={"100%"}
            height={"160px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography>No pending tasks!</Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
