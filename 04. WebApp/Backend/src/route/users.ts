import express from "express";
import { createUser } from "../controllers/users/users.create";
import { deleteAssistant } from "../controllers/users/users.delete";

const router = express.Router();

router.post("/", createUser);

router.delete("/", deleteAssistant);

export default router;
