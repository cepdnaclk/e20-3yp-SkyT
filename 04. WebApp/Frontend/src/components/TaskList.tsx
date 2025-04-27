import {
  alpha,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import TextBox from "./TextBox";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import FillButton from "./FillButton";
import AddIcon from "@mui/icons-material/Add";
import { useDate } from "../utils/useDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";

interface TaskProps {
  taskId: number;
  task: string;
  dueDate: string;
  dueTime: string;
  lots: number[];
  tag: "Monitoring" | "Fertilizing" | "Memo";
}

interface TaskCardProps {
  data: TaskProps;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

interface TaskListProps {
  estateId?: number;
  userId?: number;
}

const dummyTasks: TaskProps[] = [
  {
    taskId: 1,
    task: "Monitor Lot A",
    dueDate: "Apr 27",
    dueTime: "10:00 AM",
    lots: [101],
    tag: "Monitoring",
  },
  {
    taskId: 2,
    task: "Fertilize Lot B",
    dueDate: "Apr 27",
    dueTime: "01:00 PM",
    lots: [102],
    tag: "Fertilizing",
  },
  {
    taskId: 3,
    task: "Memo: Discuss drone routes",
    dueDate: "Apr 27",
    dueTime: "03:30 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 4,
    task: "Monitor Lot C",
    dueDate: "Apr 28",
    dueTime: "09:00 AM",
    lots: [103],
    tag: "Monitoring",
  },
  {
    taskId: 5,
    task: "Fertilize Lot D",
    dueDate: "Apr 28",
    dueTime: "02:00 PM",
    lots: [104],
    tag: "Fertilizing",
  },
  {
    taskId: 6,
    task: "Memo: Soil condition report",
    dueDate: "Apr 28",
    dueTime: "04:00 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 7,
    task: "Monitor Lot E",
    dueDate: "Apr 29",
    dueTime: "08:00 AM",
    lots: [105],
    tag: "Monitoring",
  },
  {
    taskId: 8,
    task: "Fertilize Lot F",
    dueDate: "Apr 29",
    dueTime: "11:00 AM",
    lots: [106],
    tag: "Fertilizing",
  },
  {
    taskId: 9,
    task: "Memo: Update software",
    dueDate: "Apr 29",
    dueTime: "01:30 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 10,
    task: "Monitor Lot G",
    dueDate: "Apr 30",
    dueTime: "07:00 AM",
    lots: [107],
    tag: "Monitoring",
  },
  {
    taskId: 11,
    task: "Fertilize Lot H",
    dueDate: "Apr 30",
    dueTime: "12:00 PM",
    lots: [108],
    tag: "Fertilizing",
  },
  {
    taskId: 12,
    task: "Memo: Inspection notes",
    dueDate: "Apr 30",
    dueTime: "03:00 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 13,
    task: "Monitor Lot I",
    dueDate: "May 1",
    dueTime: "09:30 AM",
    lots: [109],
    tag: "Monitoring",
  },
  {
    taskId: 14,
    task: "Fertilize Lot J",
    dueDate: "May 1",
    dueTime: "01:30 PM",
    lots: [110],
    tag: "Fertilizing",
  },
  {
    taskId: 15,
    task: "Memo: Drone battery check",
    dueDate: "May 1",
    dueTime: "04:00 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 16,
    task: "Monitor Lot K",
    dueDate: "May 2",
    dueTime: "08:30 AM",
    lots: [111],
    tag: "Monitoring",
  },
  {
    taskId: 17,
    task: "Fertilize Lot L",
    dueDate: "May 2",
    dueTime: "12:30 PM",
    lots: [112],
    tag: "Fertilizing",
  },
  {
    taskId: 18,
    task: "Memo: Weather forecast review",
    dueDate: "May 2",
    dueTime: "02:00 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 19,
    task: "Monitor Lot M",
    dueDate: "May 3",
    dueTime: "10:00 AM",
    lots: [113],
    tag: "Monitoring",
  },
  {
    taskId: 20,
    task: "Fertilize Lot N",
    dueDate: "May 3",
    dueTime: "01:00 PM",
    lots: [114],
    tag: "Fertilizing",
  },
  {
    taskId: 21,
    task: "Memo: Drone path optimization",
    dueDate: "May 3",
    dueTime: "03:30 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 22,
    task: "Monitor Lot O",
    dueDate: "May 4",
    dueTime: "09:00 AM",
    lots: [115],
    tag: "Monitoring",
  },
  {
    taskId: 23,
    task: "Fertilize Lot P",
    dueDate: "May 4",
    dueTime: "11:30 AM",
    lots: [116],
    tag: "Fertilizing",
  },
  {
    taskId: 24,
    task: "Memo: Fertilizer stock check",
    dueDate: "May 4",
    dueTime: "02:30 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 25,
    task: "Monitor Lot Q",
    dueDate: "May 5",
    dueTime: "08:00 AM",
    lots: [117],
    tag: "Monitoring",
  },
  {
    taskId: 26,
    task: "Fertilize Lot R",
    dueDate: "May 5",
    dueTime: "01:00 PM",
    lots: [118],
    tag: "Fertilizing",
  },
  {
    taskId: 27,
    task: "Memo: Review drone footage",
    dueDate: "May 5",
    dueTime: "03:00 PM",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 28,
    task: "Monitor Lot S",
    dueDate: "May 6",
    dueTime: "10:00 AM",
    lots: [119],
    tag: "Monitoring",
  },
  {
    taskId: 29,
    task: "Fertilize Lot T",
    dueDate: "May 6",
    dueTime: "12:00 PM",
    lots: [120],
    tag: "Fertilizing",
  },
  {
    taskId: 30,
    task: "Memo: Monthly maintenance",
    dueDate: "May 6",
    dueTime: "03:30 PM",
    lots: [],
    tag: "Memo",
  },
];

const COLOR = {
  safe: "#009a68",
  risk: "#e10034",
};

function TaskCard({ data, onDelete, onView }: TaskCardProps) {
  const { date: fullDate } = useDate();
  const [isToday, setIsToday] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = (id: number) => {
    console.log("View clicked for", id);
    onView(id);
    handleClose();
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked for", id);
    onDelete(id);
    handleClose();
  };

  useEffect(() => {
    if (!data?.dueDate) return;

    // Extract "Apr 14" part from "2025 Apr 14"
    const todayShort = fullDate.split(",")[0]; // "Apr 14"
    //console.log(todayShort);
    setIsToday(data.dueDate === todayShort);
  }, [data?.dueDate, fullDate]);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Stack
      direction={"row"}
      border={"1.5px solid #cccccc"}
      fontFamily={"Montserrat"}
      justifyContent={"space-between"}
      alignItems={"center"}
      borderRadius={2}
      width={"90%"}
      padding={1}
      my={1}
      sx={{
        "&:hover .more-icon": {
          visibility: "visible",
        },
      }}
    >
      {/* Due Section */}
      <Box
        width={70}
        height={50}
        bgcolor={alpha(isToday ? COLOR.risk : COLOR.safe, 0.2)}
        borderRadius={2}
        flexDirection={"column"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        fontWeight={600}
        color={isToday ? COLOR.risk : COLOR.safe}
        mr={1}
      >
        {data?.dueDate}
        <Typography variant="caption">{data?.dueTime}</Typography>
      </Box>

      {/* Info Section */}
      <Box fontFamily={"Montserrat"} width={180}>
        <Typography fontFamily={"inherit"} fontWeight={600}>
          {data?.task}
        </Typography>

        <Typography
          fontFamily={"inherit"}
          fontWeight={550}
          bgcolor={"#d9d9d9"}
          borderRadius={2}
          width={95}
          textAlign={"center"}
          variant="subtitle2"
          color="text.secondary"
        >
          {data?.tag}
        </Typography>
      </Box>

      {/* Action Section */}
      <Tooltip title="More">
        <IconButton
          className="more-icon"
          onClick={handleMoreClick}
          sx={{
            visibility: "hidden",
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Tooltip>

      {/* Popup Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={() => handleView(data.taskId)}>
          <GrView size={"15px"} style={{ marginRight: "8px" }} /> View
        </MenuItem>
        <MenuItem onClick={() => handleDelete(data.taskId)}>
          <RiDeleteBin6Line size={"15px"} style={{ marginRight: "8px" }} />
          Delete
        </MenuItem>
      </Menu>
    </Stack>
  );
}

export default function TaskList({ estateId, userId }: TaskListProps) {
  const [searching, setSearching] = useState<string>();
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskProps[]>(dummyTasks);

  useEffect(() => {
    const getTasks = async () => {
      console.log({ userId, estateId });
      setTasks(dummyTasks);
      setBtnLoading(false);
    };

    getTasks();
  }, [userId, estateId]);

  const handleView = (id: number) => {
    console.log("View clicked for", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked for", id);
  };

  return (
    <Box
      width={"330px"}
      border={"1px solid #cccccc"}
      height={{ xs: "auto", md: "calc(100% - 32px)" }}
      maxHeight={"100%"}
      borderRadius={2}
      p={2}
    >
      {/* Headers */}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"start"}
      >
        <TextBox
          size="small"
          placeholder="Search task"
          value={searching}
          onChange={(e) => setSearching(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 2,
            bgcolor: "#F9FAFB",
            width: "200px",
          }}
        />

        <FillButton
          //onClick={handleAdd}
          variant="contained"
          disabled={btnLoading}
          sx={{
            borderRadius: "5px",
          }}
          startIcon={<AddIcon />}
        >
          {btnLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Create"
          )}
        </FillButton>
      </Stack>

      {/* taskList */}
      <Box
        height={"calc(100% - 50px)"}
        maxHeight={{ xs: "calc(100vh - 300px)", md: "calc(100vh - 233px)" }}
        sx={{ overflowY: "auto", overflowX: "hidden" }}
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
      >
        {tasks ? (
          tasks.map((t) => (
            <TaskCard
              key={t.taskId}
              data={t}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))
        ) : (
          <Skeleton height={70} variant="rectangular" />
        )}
      </Box>
    </Box>
  );
}
