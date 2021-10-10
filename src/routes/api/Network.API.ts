import express from "express";
import { status, heartbeat } from "../../controllers/Network.API.controller";

const router = express.Router();

// Check the connection of a certain user
router.get("/status", status);
router.get("/heartbeat", heartbeat);

export default router;
