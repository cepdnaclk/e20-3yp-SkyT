import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Protected Route (Only accessible if authenticated)
router.get("/", authenticateUser);

export default router;
