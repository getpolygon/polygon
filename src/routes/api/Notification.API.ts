import { fetch } from "../../controllers/api/Notification.API.controller";

const router = require("express").Router();

// Getting all notifications from current account
router.get("/fetch", fetch);

export default router;
