import express from "express";
import { accounts, posts } from "../../controllers/Discover.API.controller";

const router = express.Router();

router.get("/posts", posts);
router.get("/accounts", accounts);

export default router;
