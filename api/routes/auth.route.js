import express from "express";
import { signin, signup, google } from "../controllers/auth.controller.js";
import exp from "constants";
const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
export default router;
