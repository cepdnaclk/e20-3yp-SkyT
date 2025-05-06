import { RequestHandler } from "express";
import createHttpError from "http-errors";
import LotModel from "../../model/lot";
import TaskModel from "../../model/tasks";

interface DataProps {
  Temperature: number;
  Humidity: number;
  lowPH: number;
  highPH: number;
  optimalPH: number;
  PH: number;
  Nitrogen: number;
  Phosphorus: number;
  Potassium: number;
}

interface CenterProps {
  name: string;
  location: [number, number];
}

const LOWER_PH_BOUND = 3.0;
const UPPER_PH_BOUND = 6.0;

export const getInfo: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const lotId = parseInt(req.params.lotId);

    console.log("Employee " + userId + " is trying to access lot " + lotId);

    if (isNaN(userId) || isNaN(lotId)) {
      throw createHttpError(400, "Missing required fields");
    }

    // Step 01: Get autherized
    const lot = await LotModel.isLotAccessibleByUser(userId, lotId);
    if (!lot) throw createHttpError(404, "Lot not found");

    // Step 02: Get Docking point
    const center: CenterProps = {
      name: lot.lot,
      location: [lot.lat, lot.lng],
    };

    // Step 03: Get latest lot data
    const latest: DataProps = await LotModel.getLotDataById(
      lotId,
      LOWER_PH_BOUND,
      UPPER_PH_BOUND
    );

    // Step 04: Get latest lot image
    const latestImage = await LotModel.getLatestLotImage(lotId);

    // Step 05: Get tasks
    const taskList = await TaskModel.getTasksByLot(lotId);

    console.log({ latest, center, latestImage, taskList });
    res.status(200).json({
      message: "Lot data found successfully",
      latest,
      center,
      latestImage,
      taskList,
    });
  } catch (error) {
    next(error);
  }
};
