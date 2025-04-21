import express from "express";
import { createUser } from "../controllers/users/users.create";
import { deleteAssistant } from "../controllers/users/users.delete";
import { getInfo } from "../controllers/users/users.getInfo";
import { updateUser } from "../controllers/users/users.update";
import { createUploadMiddleware } from "../middleware/uploadMiddleware";

const router = express.Router();

const uploadProfilePic = createUploadMiddleware("users");

router.get("/:userId", getInfo);

router.post("/", createUser);

router.patch("/", uploadProfilePic, updateUser);

router.delete("/", deleteAssistant);

export default router;
