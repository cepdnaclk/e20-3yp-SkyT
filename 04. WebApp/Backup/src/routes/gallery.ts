import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers/gallery";

const router = express.Router();

router.post("/", createEvent);

router.get("/", getEvents);

router.patch("/", updateEvent);

router.delete("/", deleteEvent);

export default router;
