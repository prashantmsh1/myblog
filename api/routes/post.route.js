import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { getPosts } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getposts", getPosts);
export default router;
