import express from "express";
import { getImages } from "../controllers/nodeImages";

const router = express.Router();

router.get("/", getImages);

export default router;
