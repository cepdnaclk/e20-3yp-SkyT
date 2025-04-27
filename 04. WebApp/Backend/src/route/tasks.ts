import express from "express";
import { createTask } from "../controllers/tasks/tasks.create";
import { getTask } from "../controllers/tasks/tasks.getTasks";

const router = express.Router();

router.get("/:userId/:estateId", getTask);

router.post("/", createTask);

export default router;
