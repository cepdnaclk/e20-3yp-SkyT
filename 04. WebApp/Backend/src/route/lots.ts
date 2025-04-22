import express from "express";
import { getInfo } from "../controllers/lots/lots.getInfo";

const router = express.Router();

router.get("/:lotId/user/:userId", getInfo);

export default router;
