import { RequestHandler } from "express";
import createHttpError from "http-errors";
import TaskModel from "../../model/tasks";

export const removeTask: RequestHandler = async (req, res, next) => {
  try {
    const { userId, taskId } = req.body;

    console.log("Requesting to delete task " + taskId + " by user " + userId);

    // Validate input
    if (isNaN(userId) || isNaN(taskId)) {
      throw createHttpError(400, "Required fields missing");
    }

    const result = await TaskModel.removeTask(userId, taskId);

    console.log(result);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
