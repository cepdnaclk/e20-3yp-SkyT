import express from "express";
import { employees } from "../controllers/estates/estates.employees";
import { estateList } from "../controllers/estates/estates.estateList";

const router = express.Router();

router.get("/employees/:userId", employees);

router.get("/list/:userId", estateList);

export default router;
