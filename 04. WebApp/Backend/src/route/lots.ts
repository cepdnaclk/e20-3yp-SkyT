import express from "express";
import { getInfo } from "../controllers/lots/lots.getInfo";
import { getPHAnalytics } from "../controllers/lots/lots.phAnalytics";
import { getNPKAnalytics } from "../controllers/lots/lots.npkAnalytics";
import { getWeather } from "../controllers/lots/lots.weather";
import { getMapData } from "../controllers/lots/lots.mapData";
import { getGalleryImages } from "../controllers/lots/lots.GallaryImages";

const router = express.Router();

router.get("/weather/:lotId/:userId", getWeather);

router.get("/summary/:lotId/:userId", getInfo);

router.get("/nodes/:userId/:lotId", getMapData);

router.get("/images/:userId/:lotId/:lastId", getGalleryImages);

router.post("/ph", getPHAnalytics);

router.post("/npk", getNPKAnalytics);

export default router;
