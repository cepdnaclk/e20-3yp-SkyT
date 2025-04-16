import express from "express";
import {
  createSiteAdmin,
  deleteSiteAdmin,
  getSiteAdmins,
  upateSiteAdmins,
  verifySiteAdmin,
} from "../controllers/siteAdmin";

const router = express.Router();

router.post("/id", verifySiteAdmin);

router.post("/", createSiteAdmin);

router.patch("/", upateSiteAdmins);

router.get("/", getSiteAdmins);

router.delete("/", deleteSiteAdmin);

export default router;
