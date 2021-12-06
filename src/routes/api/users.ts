import express from "express";
import { me, others, close } from "controllers/api/users";

const router = express.Router();

// For fetching current account details
router.get("/me", me);
// For closing account
router.delete("/close", close);
// For fetching account details
router.get("/:username", others);

export default router;
