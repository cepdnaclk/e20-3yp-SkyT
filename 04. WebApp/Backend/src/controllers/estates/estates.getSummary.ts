import { RequestHandler } from "express";
import createHttpError from "http-errors";
import LotModel from "../../model/lot";
import EstateModel from "../../model/estates";

export const getEstateSummary: RequestHandler = async (req, res, next) => {
  try {
    const { userId, estateId } = req.body;

    console.log("User " + userId + " requests summary on estate " + estateId);

    if (isNaN(userId) || isNaN(estateId)) {
      throw createHttpError(400, "Missing required fields");
    }

    const office = await EstateModel.getOfficeById(estateId, userId);

    if (office === null) {
      throw createHttpError(401, "Invalid user or estate");
    }

    const summary = await LotModel.getLotSummaryByEstate(estateId);

    if (summary === null) {
      throw createHttpError(404, "Lots not found");
    }

    console.log("Result: ", { office, summary });

    res
      .status(200)
      .json({ message: "Summary get successfully.", office, summary });
  } catch (error) {
    next(error);
  }
};
