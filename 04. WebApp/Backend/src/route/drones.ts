import express from "express";
import { liveStatus } from "../controllers/drones/drones.liveStatus";

const router = express.Router();

router.get("/:userId/:estateId", liveStatus);

export default router;
