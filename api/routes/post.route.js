import express from "express";
import { createPost } from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";
import { getPosts } from "../controllers/post.controller.js";
import { deletePost, updatePost } from "../controllers/post.controller.js";
const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getposts", getPosts);
router.get("/deletepost/:postId/:userId", verifyUser, deletePost);
router.put("/updatepost/:postId/:userId", verifyUser, updatePost);
export default router;
