import { RequestHandler } from "express";
import LotModel from "../../model/lot";
import createHttpError from "http-errors";

interface phReqProps {
  lotId: number;
  userId: number;
  range: string;
}

export const getPHAnalytics: RequestHandler = async (req, res, next) => {
  const { lotId, userId, range }: phReqProps = req.body;

  console.log(
    "User " +
      userId +
      " is requesting ph data for last " +
      range +
      " of lot " +
      lotId
  );

  try {
    if (isNaN(lotId) || isNaN(userId) || !range)
      throw createHttpError(400, "Missing required fields");

    // Fetch PH analytics data
    const phData = await LotModel.getPHAnalyticsData(
      lotId,
      userId,
      range.toLowerCase()
    );

    console.log(phData);

    // Send response with PH data
    res.status(200).json({ message: "pH data get successfully", phData });
  } catch (err) {
    next(err);
  }
};
