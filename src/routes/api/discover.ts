import express from "express";
import { posts } from "controllers/api/discover";

const router = express.Router();

router.get("/posts", posts);

export default router;
