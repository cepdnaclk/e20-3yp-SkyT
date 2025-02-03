import express from "express";
import { createAdmin, getAdmins, upateAdmins } from "../controllers/admin";

const router = express.Router();

router.post("/", createAdmin);

router.get("/", getAdmins);

router.patch("/", upateAdmins);

export default router;
