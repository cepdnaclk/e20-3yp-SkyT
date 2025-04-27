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
import { changeDateFormat, changeTimeFormat, useDate } from "../utils/useDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GrView } from "react-icons/gr";
import { RiDeleteBin6Line } from "react-icons/ri";
import AlertDialog from "./AlertDialog";
import TaskDialog from "./TaskDialog";

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
  lots?: LotProps[];
  setLots: (lots: LotProps[]) => void;
}

interface LotProps {
  lotId: number;
  lot: string;
}

const dummyTasks: TaskProps[] = [
  {
    taskId: 1,
    task: "Monitor Lot A",
    dueDate: "2025-04-30",
    dueTime: "10:00",
    lots: [101],
    tag: "Monitoring",
  },
  {
    taskId: 2,
    task: "Fertilize Lot B",
    dueDate: "2025-04-30",
    dueTime: "01:00",
    lots: [102],
    tag: "Fertilizing",
  },
  {
    taskId: 3,
    task: "Memo: Discuss drone routes",
    dueDate: "2025-04-30",
    dueTime: "03:30",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 4,
    task: "Monitor Lot C",
    dueDate: "2025-04-30",
    dueTime: "09:00",
    lots: [103],
    tag: "Monitoring",
  },
  {
    taskId: 5,
    task: "Fertilize Lot D",
    dueDate: "2025-04-30",
    dueTime: "02:00",
    lots: [104],
    tag: "Fertilizing",
  },
  {
    taskId: 6,
    task: "Memo: Soil condition report",
    dueDate: "2025-04-30",
    dueTime: "04:00",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 7,
    task: "Monitor Lot E",
    dueDate: "2025-04-30",
    dueTime: "08:00",
    lots: [105],
    tag: "Monitoring",
  },
  {
    taskId: 8,
    task: "Fertilize Lot F",
    dueDate: "2025-05-01",
    dueTime: "11:00",
    lots: [106],
    tag: "Fertilizing",
  },
  {
    taskId: 9,
    task: "Memo: Update software",
    dueDate: "2025-05-01",
    dueTime: "01:30",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 10,
    task: "Monitor Lot G",
    dueDate: "2025-05-01",
    dueTime: "07:00",
    lots: [107],
    tag: "Monitoring",
  },
  {
    taskId: 11,
    task: "Fertilize Lot H",
    dueDate: "2025-05-01",
    dueTime: "12:00",
    lots: [108],
    tag: "Fertilizing",
  },
  {
    taskId: 12,
    task: "Memo: Inspection notes",
    dueDate: "2025-05-01",
    dueTime: "03:00",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 13,
    task: "Monitor Lot I",
    dueDate: "2025-05-01",
    dueTime: "09:30",
    lots: [109],
    tag: "Monitoring",
  },
  {
    taskId: 14,
    task: "Fertilize Lot J",
    dueDate: "2025-05-02",
    dueTime: "01:30",
    lots: [110],
    tag: "Fertilizing",
  },
  {
    taskId: 15,
    task: "Memo: Drone battery check",
    dueDate: "2025-05-02",
    dueTime: "04:00",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 16,
    task: "Monitor Lot K",
    dueDate: "2025-05-02",
    dueTime: "08:30",
    lots: [111],
    tag: "Monitoring",
  },
  {
    taskId: 17,
    task: "Fertilize Lot L",
    dueDate: "2025-05-02",
    dueTime: "12:30",
    lots: [112],
    tag: "Fertilizing",
  },
  {
    taskId: 18,
    task: "Memo: Weather forecast review",
    dueDate: "2025-05-02",
    dueTime: "02:00",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 19,
    task: "Monitor Lot M",
    dueDate: "2025-05-02",
    dueTime: "10:00",
    lots: [113],
    tag: "Monitoring",
  },
  {
    taskId: 20,
    task: "Fertilize Lot N",
    dueDate: "2025-05-05",
    dueTime: "01:00",
    lots: [114],
    tag: "Fertilizing",
  },
  {
    taskId: 21,
    task: "Memo: Drone path optimization",
    dueDate: "2025-05-05",
    dueTime: "03:30",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 22,
    task: "Monitor Lot O",
    dueDate: "2025-05-05",
    dueTime: "09:00",
    lots: [115],
    tag: "Monitoring",
  },
  {
    taskId: 23,
    task: "Fertilize Lot P",
    dueDate: "2025-05-05",
    dueTime: "11:30",
    lots: [116],
    tag: "Fertilizing",
  },
  {
    taskId: 24,
    task: "Memo: Fertilizer stock check",
    dueDate: "2025-05-05",
    dueTime: "02:30",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 25,
    task: "Monitor Lot Q",
    dueDate: "2025-05-05",
    dueTime: "08:00",
    lots: [117],
    tag: "Monitoring",
  },
  {
    taskId: 26,
    task: "Fertilize Lot R",
    dueDate: "2025-05-05",
    dueTime: "01:00",
    lots: [118],
    tag: "Fertilizing",
  },
  {
    taskId: 27,
    task: "Memo: Review drone footage",
    dueDate: "2025-05-05",
    dueTime: "03:00",
    lots: [],
    tag: "Memo",
  },
  {
    taskId: 28,
    task: "Monitor Lot S",
    dueDate: "2025-05-05",
    dueTime: "10:00",
    lots: [119],
    tag: "Monitoring",
  },
  {
    taskId: 29,
    task: "Fertilize Lot T",
    dueDate: "2025-05-05",
    dueTime: "12:00",
    lots: [120],
    tag: "Fertilizing",
  },
  {
    taskId: 30,
    task: "Memo: Monthly maintenance",
    dueDate: "2025-05-05",
    dueTime: "03:30",
    lots: [],
    tag: "Memo",
  },
];

const COLOR = {
  safe: "#009a68",
  risk: "#e10034",
};

const LOTS: LotProps[] = [
  { lotId: 1, lot: "HR-L1" },
  { lotId: 2, lot: "HR-L2" },
  { lotId: 3, lot: "HR-L3" },
  { lotId: 4, lot: "HR-L4" },
  { lotId: 5, lot: "HR-L5" },
];

function TaskCard({ data, onDelete, onView }: TaskCardProps) {
  const { date: fullDate } = useDate();
  const [isToday, setIsToday] = useState<boolean>(false);
  const [formatedDate, setFormatedDate] = useState<string>("");

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

    const newDate = changeDateFormat(data.dueDate).split(",")[0];
    setFormatedDate(newDate);

    // Extract "Apr 14" part from "2025 Apr 14"
    const todayShort = fullDate.split(",")[0]; // "Apr 14"
    //console.log(todayShort);
    setIsToday(newDate === todayShort);
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
        {formatedDate}
        {data.dueTime && (
          <Typography variant="caption">
            {changeTimeFormat(data?.dueTime)}
          </Typography>
        )}
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

export default function TaskList({
  estateId,
  userId,
  lots,
  setLots,
}: TaskListProps) {
  const [searching, setSearching] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskProps[]>(dummyTasks);

  const [deleteId, setDeleteId] = useState<number>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<TaskProps>();
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const getTasks = async () => {
      console.log({ userId, estateId });
      setTasks(dummyTasks);
      setBtnLoading(false);
      setLots(LOTS);
    };

    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, estateId]);

  const handleView = (id: number) => {
    console.log("View clicked for", id);
    const select = tasks.find((t) => t.taskId === id);
    setSelectedTask(select);
    setTaskDialogOpen(true);
  };

  const handleCreate = () => {
    console.log("New Task");
    setSelectedTask(undefined);
    setTaskDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log("Delete clicked for", id);
    setDeleteDialogOpen(true);
    setDeleteId(id);
  };

  const deleteTask = async () => {
    setDeleteDialogOpen(false);
    console.log("Task: " + deleteId + " is deleted.");
  };

  const addTask = async (t: TaskProps) => {
    setTaskDialogOpen(false);
    console.log("Task Added:", t);
  };

  const normalizedWord = searching.toLowerCase();
  const filteredList = tasks.filter(
    (t) =>
      t.task.toLowerCase().includes(normalizedWord) ||
      t.dueDate.includes(normalizedWord) ||
      t.tag.toLowerCase().includes(normalizedWord)
  );

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
          onClick={handleCreate}
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
        {filteredList ? (
          filteredList.map((t) => (
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

      {/* Delete Confirmation Dialog Box */}
      <AlertDialog
        open={deleteDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteTask}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      {/* Task Dialog Box */}
      <TaskDialog
        task={selectedTask}
        open={taskDialogOpen}
        lots={lots}
        onClose={() => setTaskDialogOpen(false)}
        onCreate={(t) => addTask(t)}
      />
    </Box>
  );
}
