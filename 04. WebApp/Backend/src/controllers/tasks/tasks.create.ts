import { RequestHandler } from "express";
import createHttpError from "http-errors";
import TaskModel from "../../model/tasks";

interface TaskProps {
  task: string;
  dueDate: string;
  dueTime: string;
  lots: string;
  tag: "Monitoring" | "Fertilizing" | "Memo";
  estateId: number;
  userId: number;
}

const ALLOWED_TAGS = ["Monitoring", "Fertilizing", "Memo"];

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const { userId, estateId } = req.body;
    const { task, dueDate, dueTime, tag, lots } = req.body.task;

    console.log("New request from: ", { task, userId, estateId, lots });

    // Validate input
    if (
      isNaN(userId) ||
      isNaN(estateId) ||
      !task ||
      !dueDate ||
      !dueTime ||
      !ALLOWED_TAGS.includes(tag) ||
      lots.length === 0
    ) {
      throw createHttpError(400, "Required fields missing");
    }

    // Create task
    const newTask: TaskProps = {
      task,
      dueDate,
      dueTime,
      tag,
      lots,
      estateId: parseInt(estateId),
      userId: parseInt(userId),
    };

    await TaskModel.addTask(newTask);

    console.log("New task has been created");

    res.status(201).json({ message: "Task created successfully!" });
  } catch (error) {
    next(error);
  }
};
