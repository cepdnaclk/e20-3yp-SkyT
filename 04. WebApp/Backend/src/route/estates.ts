import express from "express";
import { employees } from "../controllers/estates/estates.employees";
import { estateList } from "../controllers/estates/estates.estateList";
import { updateEstates } from "../controllers/estates/estate.updateUser";

const router = express.Router();

router.get("/employees/:userId", employees);

router.get("/list/:userId", estateList);

router.patch("/", updateEstates);

export default router;
