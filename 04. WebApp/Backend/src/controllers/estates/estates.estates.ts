import { RequestHandler } from "express";
import createHttpError from "http-errors";
import EstateModel from "../../model/estates";

export const estates: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log("Employee: ", userId);

    if (isNaN(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const estList = await EstateModel.getEstates(userId);

    if (estList.length === 0) {
      throw createHttpError(404, "Estates not found");
    }

    console.log("Estates: ", estList);

    res.status(200).json({ message: "Estates found successfully", estList });
  } catch (error) {
    next(error);
  }
};
