import express from "express";
import { getHighlights } from "../controllers/highlights";

const router = express.Router();

router.get("/", getHighlights);

export default router;
