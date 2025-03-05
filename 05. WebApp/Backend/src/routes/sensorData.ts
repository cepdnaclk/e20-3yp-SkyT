import express from "express";
import { deleteData, getData } from "../controllers/sensorData";

const router = express.Router();

router.get("/", getData);

router.delete("/", deleteData);

export default router;
