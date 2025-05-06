import express from "express";
import { employees } from "../controllers/estates/estates.employees";
import { estateList } from "../controllers/estates/estates.estateList";
import { updateEstates } from "../controllers/estates/estates.updateUser";
import { estates } from "../controllers/estates/estates.estates";
import { getEstateSummary } from "../controllers/estates/estates.getSummary";
import { Summary } from "../controllers/estates/estates.summary";

const router = express.Router();

router.get("/summary/:userId/:estateId", Summary);

router.get("/employees/:userId", employees);

router.get("/list/:userId", estateList);

router.get("/:userId", estates);

router.patch("/", updateEstates);

router.post("/", getEstateSummary);

export default router;
