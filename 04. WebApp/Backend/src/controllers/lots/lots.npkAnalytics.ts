import { RequestHandler } from "express";
import LotModel from "../../model/lot";
import createHttpError from "http-errors";

interface phReqProps {
  lotId: number;
  userId: number;
  range: string;
}

export const getNPKAnalytics: RequestHandler = async (req, res, next) => {
  const { lotId, userId, range }: phReqProps = req.body;

  console.log(
    "User " +
      userId +
      " is requesting NPK data for last " +
      range +
      " of lot " +
      lotId
  );

  try {
    if (isNaN(lotId) || isNaN(userId) || !range)
      throw createHttpError(400, "Missing required fields");

    // Fetch PH analytics data
    const npkData = await LotModel.getNPKAnalyticsData(
      lotId,
      range.toLowerCase()
    );

    console.log(npkData);

    // Send response with PH data
    res.status(200).json({ message: "NPK data get successfully", npkData });
  } catch (err) {
    next(err);
  }
};
