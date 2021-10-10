import express from "express";
import { status, heartbeat } from "../../controllers/network";

const router = express.Router();

// Check the connection of a certain user
router.get("/status", status);
router.get("/heartbeat", heartbeat);

export default router;
