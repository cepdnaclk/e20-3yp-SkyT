import express from "express";
import jwtMiddleware from "../middleware/jwtMiddleware";

import { verifyToken } from "../controllers/auth/auth.user";
import { login } from "../controllers/auth/auth.login";
import { createToken } from "../controllers/auth/auth.create";
import { resetPassword } from "../controllers/auth/auth.reset";

const router = express.Router();

router.get("/", jwtMiddleware, verifyToken);

router.post("/create", createToken);

router.post("/reset", resetPassword);

router.post("/", login);

export default router;
