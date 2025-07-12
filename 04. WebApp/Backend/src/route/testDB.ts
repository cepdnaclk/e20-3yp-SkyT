import express from "express";
import { testDB } from "../controllers/testDB";

const router = express.Router();

router.get("/", testDB);

export default router;
