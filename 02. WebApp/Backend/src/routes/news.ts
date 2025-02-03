import express from "express";
import {
  createNews,
  deleteNews,
  getNewsList,
  updateNews,
} from "../controllers/news";

const router = express.Router();

router.post("/", createNews);

router.get("/", getNewsList);

router.patch("/", updateNews);

router.delete("/", deleteNews);

export default router;
