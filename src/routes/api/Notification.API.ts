const router = require("express").Router();
import { fetch } from "../../controllers/api/Notification.API.controller";

// Getting all notifications from current account
router.get("/fetch", fetch);

export default router;
