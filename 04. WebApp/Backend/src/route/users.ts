import express from "express";
import { createUser } from "../controllers/users/users.create";
import { login } from "../controllers/users/users.login";

const router = express.Router();

router.post("/login", login);

router.post("/", createUser);

export default router;
