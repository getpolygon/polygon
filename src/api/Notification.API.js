const router = require("express").Router();
const NotificationController = require("../controllers/api/Notification.API.controller");

// Getting the notifications for the current account
router.get("/fetch", NotificationController.getAllNotifications);

module.exports = router;
