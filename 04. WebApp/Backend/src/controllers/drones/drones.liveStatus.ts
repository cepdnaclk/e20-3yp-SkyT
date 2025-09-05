import { RequestHandler } from "express";
import createHttpError from "http-errors";
import DroneModel from "../../model/drones";

export const liveStatus: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const estateId = parseInt(req.params.estateId);

    if (isNaN(userId) || isNaN(estateId)) {
      throw createHttpError(400, "Required fields missing");
    }

    const drones = await DroneModel.getDroneStatusByEstate(estateId, userId);

    console.log("Drone Status: ", drones);

    res.status(200).json(drones);
  } catch (err) {
    next(err);
  }
};
