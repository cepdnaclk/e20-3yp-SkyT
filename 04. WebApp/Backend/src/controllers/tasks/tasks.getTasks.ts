import { RequestHandler } from "express";
import createHttpError from "http-errors";
import TaskModel from "../../model/tasks";
import EstateModel from "../../model/estates";
import LotModel from "../../model/lot";

export const getTask: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const estateId = parseInt(req.params.estateId);

    console.log("Requesting tasks: userId " + userId + " estate: " + estateId);

    // Validate input
    if (isNaN(userId) || isNaN(estateId)) {
      throw createHttpError(400, "Required fields missing");
    }

    // Find office
    const office = await EstateModel.getOfficeById(estateId, userId);

    if (office === null) {
      throw createHttpError(401, "Invalid user or estate");
    }

    // Find lots
    const lots = await LotModel.getLotsByEstate(estateId);

    if (lots === null) {
      throw createHttpError(404, "Lots not found");
    }

    // Find Tasks
    const tasks = await TaskModel.getTasksByEstate(estateId);

    console.log({ office, lots, tasks });
    res
      .status(200)
      .json({ message: "Data got successfully.", office, lots, tasks });
  } catch (error) {
    next(error);
  }
};
