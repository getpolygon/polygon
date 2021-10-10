import express from "express";
import { posts } from "../../controllers/discover";

const router = express.Router();

router.get("/posts", posts);

export default router;
