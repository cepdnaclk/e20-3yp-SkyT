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
import { changeDateFormat, changeTimeFormat, useDate } from "../utils/useDate";
import { useEffect, useState } from "react";

interface SummaryCardProps {
  taskId?: number;
  task?: string;
  dueDate?: string;
  dueTime?: string;
  tag: "Monitoring" | "Fertilizing" | "Memo";
  status: "Completed" | "InProgress" | "Pending";
}

interface TaskCardProps {
  path: string;
  tasks?: SummaryCardProps[];
}

const COLOR = {
  safe: "#009a68",
  risk: "#e10034",
  inprogress: "#ff9800",
  pending: "#2196f3",
};

function SummaryCard({ data }: { data?: SummaryCardProps }) {
  const { date: fullDate } = useDate(); // e.g., "2025 Apr 14"
  const [isToday, setIsToday] = useState<boolean>(false);
  const [formatedDate, setFormatedDate] = useState<string>("");

  useEffect(() => {
    if (!data?.dueDate) return;

    const newDate = changeDateFormat(data.dueDate).split(",")[0];
    setFormatedDate(newDate);

    // Extract "Apr 14" part from "2025 Apr 14"
    const todayShort = fullDate.split(",")[0]; // "Apr 14"
    //console.log(todayShort);
    setIsToday(newDate === todayShort);
  }, [data?.dueDate, fullDate]);

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
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        fontWeight={600}
        color={isToday ? COLOR.risk : COLOR.safe}
        mr={1}
      >
        {formatedDate}
        {data?.dueTime && (
          <Typography variant="caption">
            {changeTimeFormat(data?.dueTime)}
          </Typography>
        )}
      </Box>

      <Box fontFamily={"Montserrat"}>
        <Typography fontFamily={"inherit"} fontWeight={600}>
          {data?.task}
        </Typography>

        <Stack direction={"row"} gap={0.8}>
          <Typography
            fontFamily={"inherit"}
            fontWeight={550}
            bgcolor={"#d9d9d9"}
            borderRadius={2}
            width={90}
            textAlign={"center"}
            variant="subtitle2"
            color="text.secondary"
          >
            {data?.tag}
          </Typography>

          <Typography
            fontFamily={"inherit"}
            fontWeight={550}
            bgcolor={alpha(
              data?.status === "Pending" ? COLOR.pending : COLOR.inprogress,
              0.2
            )}
            borderRadius={2}
            sx={{
              color:
                data?.status === "Pending" ? COLOR.pending : COLOR.inprogress,
            }}
            width={88}
            textAlign={"center"}
            variant="subtitle2"
            color="text.secondary"
          >
            {data?.status}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}

export default function TaskSummaryCard({ tasks, path }: TaskCardProps) {
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
            href={path}
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
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => <SummaryCard key={task.taskId} data={task} />)
        ) : (
          <Box
            width={"100%"}
            height={"160px"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Typography fontFamily={"Montserrat"} fontWeight={500}>
              No tasks to show. Enjoy your day!
            </Typography>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
