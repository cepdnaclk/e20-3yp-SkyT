import express from "express";
import jwtMiddleware from "../middleware/jwtMiddleware";
import { verifyToken } from "../controllers/users/users.auth";

const router = express.Router();

router.get("/", jwtMiddleware, verifyToken);

export default router;
