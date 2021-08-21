import express from "express";
import {
  status,
  heartbeat,
} from "../../controllers/api/Network.API.controller";

const router = express.Router();

// Check the connection of a certain user
router.get("/status", status);
// When the user connects
router.get("/heartbeat", heartbeat);

export default router;
