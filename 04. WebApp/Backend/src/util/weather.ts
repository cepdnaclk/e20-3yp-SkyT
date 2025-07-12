import axios from "axios";
import env from "./validateEnv";

const API_KEY = env.ACCUWEATHER_API_KEY;
const BASE_URL = env.ACCUWEATHER_BASE_URL;

interface locationProps {
  lat: number;
  lng: number;
}

interface weatherProps {
  wind: number;
  rain: number;
  sunrise: string;
  sunset: string;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes}`;
}

export const getWeatherData = async ({
  lat,
  lng,
}: locationProps): Promise<weatherProps> => {
  try {
    // Step 1: Get Location Key
    const locationRes = await axios.get(
      `${BASE_URL}/locations/v1/cities/geoposition/search`,
      {
        params: {
          apikey: API_KEY,
          q: `${lat},${lng}`,
        },
      }
    );

    const locationKey = locationRes.data.Key;

    // Step 2: Get Forecasts Data
    const conditionRes = await axios.get(
      `${BASE_URL}/forecasts/v1/daily/1day/${locationKey}`,
      {
        params: {
          apikey: API_KEY,
          details: true,
          metric: true,
        },
      }
    );

    const data = conditionRes.data.DailyForecasts[0];

    const results: weatherProps = {
      sunrise: formatTime(data.Sun.Rise),
      sunset: formatTime(data.Sun.Set),
      wind: data.Day.Wind.Speed.Value,
      rain: data.Day.Rain.Value,
    };

    //console.log("Forecast data: ", results);

    return results;
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error("Failed to fetch weather data");
  }
};
