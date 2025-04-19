import express from "express";
import { createUser } from "../controllers/users/users.create";

const router = express.Router();

router.post("/", createUser);

export default router;
