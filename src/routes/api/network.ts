import express from "express";
import { status, heartbeat } from "../../controllers/api/network";

const router = express.Router();

// Check the connection of a certain user
router.get("/status/:id", status);
router.get("/heartbeat", heartbeat);

export default router;
