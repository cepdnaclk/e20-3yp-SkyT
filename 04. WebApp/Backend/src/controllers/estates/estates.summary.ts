import { RequestHandler } from "express";
import createHttpError from "http-errors";
import EstateModel from "../../model/estates";
import LotModel from "../../model/lot";
import DroneModel from "../../model/drones";

export const Summary: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const estateId = parseInt(req.params.estateId);
    console.log("Employee: " + userId + " requesting estate info " + estateId);

    if (isNaN(userId) || isNaN(estateId)) {
      throw createHttpError(400, "Invalid user ID or estate");
    }

    const office = await EstateModel.getOfficeById(estateId, userId);

    if (office === null) {
      throw createHttpError(404, "Estates not found");
    }

    const lots = await LotModel.getLotsByEstate(estateId);

    if (lots === null) {
      throw createHttpError(404, "Lots not found");
    }

    const drones = await DroneModel.getDroneSummary(estateId);

    console.log({ office, lots, drones });

    res
      .status(200)
      .json({ message: "Estates found successfully", office, lots, drones });
  } catch (error) {
    next(error);
  }
};
