import express from "express";
import { createDoner, getDoners, upateDoner } from "../controllers/doner";

const router = express.Router();

router.post("/", createDoner);

router.get("/", getDoners);

router.patch("/", upateDoner);

export default router;
