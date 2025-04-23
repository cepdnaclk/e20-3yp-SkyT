import express from "express";
import { getInfo } from "../controllers/lots/lots.getInfo";
import { getPHAnalytics } from "../controllers/lots/lots.phAnalytics";
import { getNPKAnalytics } from "../controllers/lots/lots.npkAnalytics";

const router = express.Router();

router.get("/:lotId/user/:userId", getInfo);

router.post("/ph", getPHAnalytics);

router.post("/npk", getNPKAnalytics);

export default router;
