import express from "express";
import { createTask } from "../controllers/tasks/tasks.create";
import { getTask } from "../controllers/tasks/tasks.getTasks";
import { removeTask } from "../controllers/tasks/tasks.remove";

const router = express.Router();

router.get("/:userId/:estateId", getTask);

router.post("/", createTask);

router.delete("/", removeTask);

export default router;
