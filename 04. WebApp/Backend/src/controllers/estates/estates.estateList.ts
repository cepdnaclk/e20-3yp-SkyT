import { RequestHandler } from "express";
import createHttpError from "http-errors";
import EstateModel from "../../model/estates";

export const estateList: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log("Manager: ", userId);

    if (isNaN(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const estates = await EstateModel.getEstateSummay(userId);

    if (estates.length === 0) {
      throw createHttpError(404, "Estates not found");
    }

    console.log("Estates: ", estates);

    res.status(200).json({ message: "Estates found successfully", estates });
  } catch (error) {
    next(error);
  }
};
