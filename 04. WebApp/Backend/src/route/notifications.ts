import express from "express";
import { getNotifications } from "../controllers/messages/messages.get";
import { markAsRead } from "../controllers/messages/messages.markAsRead";
import { deleteMessage } from "../controllers/messages/messages.delete";

const router = express.Router();

router.get("/:userId", getNotifications);

router.patch("/", markAsRead);

router.delete("/", deleteMessage);

export default router;
