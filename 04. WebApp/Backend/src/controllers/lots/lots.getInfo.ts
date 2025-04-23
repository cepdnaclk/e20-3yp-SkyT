import { RequestHandler } from "express";
import createHttpError from "http-errors";
import LotModel from "../../model/lot";

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

interface SummaryCardProps {
  id?: string;
  due?: string;
  task?: string;
  tag?: string;
}

const LOWER_PH_BOUND = 3.0;
const UPPER_PH_BOUND = 6.0;

const TASKS: SummaryCardProps[] = [
  {
    id: "task-001",
    due: "Apr 25",
    task: "Check irrigation",
    tag: "Irrigation",
  },
  {
    id: "task-002",
    due: "Apr 30",
    task: "Soil pH sampling",
    tag: "Soil",
  },
];

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
    const taskList = TASKS;

    console.log({ latest, center, latestImage, taskList });
    res.status(200).json({
      message: "Estates found successfully",
      latest,
      center,
      latestImage,
      taskList,
    });
  } catch (error) {
    next(error);
  }
};
