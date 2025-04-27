import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useEffect, useState } from "react";
import TextBox from "./TextBox";
import { addDaysToDate, useDate } from "../utils/useDate";

interface TaskProps {
  taskId: number;
  task: string;
  dueDate: string;
  dueTime: string;
  lots: number[];
  tag: "Monitoring" | "Fertilizing" | "Memo";
}

interface LotProps {
  lotId: number;
  lot: string;
}

interface TaskDialogProps {
  task?: TaskProps;
  lots?: LotProps[];
  open: boolean;
  onClose: () => void;
  onCreate: (task: TaskProps) => void;
}

interface ErrorProps {
  task: boolean;
  date: boolean;
  time: boolean;
  lots: boolean;
}

const TASK_TYPES = ["Monitoring", "Fertilizing", "Memo"] as const;

const EMPTY_TASK: TaskProps = {
  taskId: -1,
  task: "",
  dueDate: "",
  dueTime: "",
  lots: [],
  tag: "Memo",
};

const ERROR_FREE: ErrorProps = {
  task: false,
  date: false,
  time: false,
  lots: false,
};

const MAX_DAYS = 7;

export default function TaskDialog({
  task,
  lots,
  open,
  onClose,
  onCreate,
}: TaskDialogProps) {
  const today = useDate().dateISO;
  const maxDate = today ? addDaysToDate(today, MAX_DAYS) : "9999-12-31";

  const [taskData, setTaskData] = useState<TaskProps>(EMPTY_TASK);
  const [viewOnly, setViewOnly] = useState<boolean>(false);
  const [err, setErr] = useState<ErrorProps>(ERROR_FREE);

  useEffect(() => {
    if (task && task.taskId > 0) {
      setTaskData(task);
      setViewOnly(true);
    } else {
      setTaskData(EMPTY_TASK);
      setViewOnly(false);
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChecked = (lotId: number) => {
    const selected = taskData.lots.includes(lotId);
    const updatedLots = selected
      ? taskData.lots.filter((id) => id !== lotId)
      : [...taskData.lots, lotId];

    setTaskData((prev) => ({
      ...prev,
      lots: updatedLots,
    }));
  };

  const handleSubmit = () => {
    // Verification
    const error: ErrorProps = {
      task: !taskData.task,
      date:
        !taskData.dueDate ||
        taskData.dueDate < today ||
        taskData.dueDate > maxDate,
      time: !taskData.dueTime,
      lots: !taskData.lots || taskData.lots.length === 0,
    };

    setErr(error);

    if (!error.date && !error.lots && !error.task && !error.time) {
      //console.log("New task: ", taskData);
      onCreate(taskData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ fontFamily: "Montserrat" }}
    >
      <DialogTitle fontFamily={"inherit"} fontWeight={600}>
        {viewOnly ? "Task Information" : "Add New Task"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Task Name */}
          <Grid size={12}>
            <TextBox
              label="Task"
              name="task"
              value={taskData.task}
              onChange={handleChange}
              fullWidth
              required
              disabled={viewOnly}
              error={err.task}
              helperText={err.task && "Invalid Task"}
            />
          </Grid>

          {/* Due Date */}
          <Grid size={6}>
            <TextBox
              label="Due Date"
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
              fullWidth
              required
              disabled={viewOnly}
              error={err.date}
              helperText={
                err.date && `Date must be within ${MAX_DAYS} days from today.`
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: today, max: maxDate },
              }}
            />
          </Grid>

          {/* Due Time */}
          <Grid size={6}>
            <TextBox
              label="Time"
              type="time"
              name="dueTime"
              value={taskData.dueTime}
              onChange={handleChange}
              fullWidth
              required
              disabled={viewOnly}
              error={err.time}
              helperText={err.time && `Invalid Time`}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          {/* Task Type */}
          <Grid size={12}>
            <FormControl fullWidth>
              <Typography fontFamily={"Montserrat"}>Task Type*</Typography>
              <RadioGroup
                row
                name="tag"
                value={taskData.tag}
                onChange={handleChange}
              >
                <Grid container width={"100%"}>
                  {TASK_TYPES.map((type, idx) => (
                    <Grid size={4} key={idx}>
                      <FormControlLabel
                        value={type}
                        control={<Radio />}
                        label={type}
                        disabled={viewOnly}
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Assigned Lots */}
          <Grid size={12}>
            <FormControl
              required
              error={err.lots}
              component="fieldset"
              variant="standard"
              fullWidth
            >
              <Typography fontFamily={"Montserrat"}>Assigned Lots*</Typography>
              <FormGroup>
                <Grid container>
                  {lots?.map((lot) => (
                    <Grid size={4} key={lot.lotId}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={taskData.lots.includes(lot.lotId)}
                            onChange={() => handleChecked(lot.lotId)}
                            disabled={viewOnly}
                          />
                        }
                        label={lot.lot}
                      />
                    </Grid>
                  ))}
                </Grid>
                {/* Helper Text when error */}
                {err.lots && (
                  <Typography
                    fontSize="0.75rem"
                    color="error"
                    marginTop="4px"
                    marginLeft="14px"
                  >
                    Please select at least one lot.
                  </Typography>
                )}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ fontFamily: "inherit", fontWeight: 650 }}
        >
          {viewOnly ? "Back" : "Cancel"}
        </Button>

        {!viewOnly && (
          <Button
            onClick={handleSubmit}
            sx={{ fontFamily: "inherit", fontWeight: 650 }}
          >
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
