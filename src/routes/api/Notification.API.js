const router = require("express").Router();
const NotificationController = require("../../controllers/api/Notification.API.controller");

// Getting all notifications from current account
router.get("/fetch", NotificationController.getAll);

module.exports = router;
