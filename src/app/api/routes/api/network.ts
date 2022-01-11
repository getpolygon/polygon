import express from "express";
import { uuidValidator } from "middleware/uuidValidator";
import { status, heartbeat } from "api/controllers/network";

const router = express.Router();

router.get("/heartbeat", heartbeat);
// Check the connection of a certain user
router.get("/status/:id", uuidValidator(), status);

export default router;
