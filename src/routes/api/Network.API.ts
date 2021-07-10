import Express from "express";
const router = Express.Router();
import {
  status,
  heartbeat,
} from "../../controllers/api/Network.API.controller";

// Check the connection of a certain user
router.get("/status", status);
// When the user connects
router.get("/heartbeat", heartbeat);

export default router;
