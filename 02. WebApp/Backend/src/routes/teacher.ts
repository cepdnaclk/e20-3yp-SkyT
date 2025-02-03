import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getTeachers,
  updateTeacher,
} from "../controllers/teacher";

const router = express.Router();

router.post("/", createTeacher);

router.get("/", getTeachers);

router.patch("/", updateTeacher);

router.delete("/", deleteTeacher);

export default router;
