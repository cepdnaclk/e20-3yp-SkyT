import { RequestHandler } from "express";
import createHttpError from "http-errors";
import LotModel from "../../model/lot";
import { getWeatherData } from "../../util/weather";

interface WeatherCardProps {
  wind?: string | number;
  rain?: string | number;
  sunset?: string;
  sunrise?: string;
}

export const getWeather: RequestHandler = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const lotId = parseInt(req.params.lotId);

    console.log(
      "Employee " + userId + " is trying to access weather data of lot " + lotId
    );

    if (isNaN(userId) || isNaN(lotId)) {
      throw createHttpError(400, "Missing required fields");
    }

    // Step 01: Get autherized
    const lot = await LotModel.isLotAccessibleByUser(userId, lotId);
    if (!lot) throw createHttpError(404, "Lot not found");

    // Step 02: Get weather data
    const location = { lat: lot.lat, lng: lot.lng };
    const weather: WeatherCardProps = await getWeatherData(location);

    console.log(weather);
    res.status(200).json({
      message: "Weather found successfully",
      weather,
    });
  } catch (error) {
    next(error);
  }
};
