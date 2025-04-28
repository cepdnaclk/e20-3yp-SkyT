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
import { deleteData, getData, postData } from "../api/NodeBackend";
import { AxiosError } from "axios";
import { ToastAlert } from "./ToastAlert";

interface TaskProps {
  taskId: number;
  task: string;
  dueDate: string;
  dueTime: string;
  lots: number[];
  tag: "Monitoring" | "Fertilizing" | "Memo";
  status: "Completed" | "InProgress" | "Pending";
}

interface TaskCardProps {
  data: TaskProps;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

interface TaskListProps {
  estateId: number;
  userId?: number;
  lots?: LotProps[];
  setLots: (lots: LotProps[]) => void;
  setOffice: (lots: OfficeProps) => void;
}

interface OfficeProps {
  name: string;
  location: [number, number];
}

interface LotProps {
  lotId: number;
  lot: string;
  location: [number, number];
}

interface ErrorResponse {
  error: string;
}

const COLOR = {
  safe: "#009a68",
  risk: "#e10034",
  inprogress: "#ff9800",
  pending: "#2196f3",
};

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
        height={"100%"}
        minHeight={50}
        bgcolor={alpha(isToday ? COLOR.risk : COLOR.safe, 0.2)}
        borderRadius={2}
        flexDirection={"column"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        fontWeight={600}
        color={isToday ? COLOR.risk : COLOR.safe}
        mr={0.8}
      >
        {formatedDate}
        {data.dueTime && (
          <Typography variant="caption">
            {changeTimeFormat(data?.dueTime)}
          </Typography>
        )}
      </Box>

      {/* Info Section */}
      <Box fontFamily={"Montserrat"} width={200}>
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
              data.status === "Pending" ? COLOR.pending : COLOR.inprogress,
              0.2
            )}
            borderRadius={2}
            sx={{
              color:
                data.status === "Pending" ? COLOR.pending : COLOR.inprogress,
            }}
            width={88}
            textAlign={"center"}
            variant="subtitle2"
            color="text.secondary"
          >
            {data.status}
          </Typography>
        </Stack>
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
  setOffice,
}: TaskListProps) {
  const [searching, setSearching] = useState<string>("");
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskProps[]>();
  const [taskLoading, setTaskLoading] = useState<boolean>();

  const [deleteId, setDeleteId] = useState<number>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const [selectedTask, setSelectedTask] = useState<TaskProps>();
  const [taskDialogOpen, setTaskDialogOpen] = useState<boolean>(false);

  const getTasks = async () => {
    const url = `tasks/${userId}/${estateId}`;

    setTaskLoading(true);

    try {
      const serverResponse = await getData(url);

      if (serverResponse.status === 200) {
        const { tasks, message, lots, office } = serverResponse.data;
        console.log(message);
        setLots(lots);
        setTasks(tasks);
        setOffice(office);
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 401 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Dashboard Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, estateId]);

  const handleView = (id: number) => {
    console.log("View clicked for", id);
    const select = tasks?.find((t) => t.taskId === id);
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

    const data = { userId, taskId: deleteId };

    setTaskLoading(true);

    try {
      const serverResponse = await deleteData(data, "tasks");
      if (serverResponse.status === 200) {
        console.log(serverResponse.data.message);
        ToastAlert({
          type: "success",
          title: "Task removed successfully",
          onClose: getTasks,
        });
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 401 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Dashboard Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setTaskLoading(false);
    }
  };

  const addTask = async (t: TaskProps) => {
    setTaskDialogOpen(false);
    setTaskLoading(true);
    setBtnLoading(true);
    console.log("Task Added:", t);

    const data = { task: t, userId, estateId };

    try {
      const serverResponse = await postData(data, "tasks");
      if (serverResponse.status === 201) {
        console.log(serverResponse.data.message);
        ToastAlert({
          type: "success",
          title: "Task added successfully",
          onClose: getTasks,
        });
      }
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const status = error.response?.status;

      let errMsg;

      if (status === 401 || status === 400) {
        console.log(error.response?.data?.error);
        errMsg = error.response?.data?.error;
      }

      console.log("Dashboard Error:", errMsg);
      ToastAlert({
        type: "error",
        title: errMsg || "Something went wrong",
      });
    } finally {
      setTaskLoading(false);
      setBtnLoading(false);
    }
  };

  const normalizedWord = searching.toLowerCase();
  const filteredList = tasks?.filter(
    (t) =>
      t.task.toLowerCase().includes(normalizedWord) ||
      t.dueDate.includes(normalizedWord) ||
      t.tag.toLowerCase().includes(normalizedWord)
  );

  return (
    <Box
      width={"340px"}
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
        {!taskLoading ? (
          filteredList ? (
            filteredList.map((t) => (
              <TaskCard
                key={t.taskId}
                data={t}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))
          ) : (
            <Typography fontFamily={"Montserrat"} fontWeight={500}>
              No tasks to show. Enjoy your day!
            </Typography>
          )
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
