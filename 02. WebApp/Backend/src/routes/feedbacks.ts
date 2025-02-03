import express from "express";
import {
  createFeedback,
  deleteFeedback,
  getFeedbacks,
  updateFeedback,
} from "../controllers/feedbacks";

const router = express.Router();

router.post("/", createFeedback);

router.get("/", getFeedbacks);

router.patch("/", updateFeedback);

router.delete("/", deleteFeedback);

export default router;
