const router = require("express").Router();
const NetworkController = require("../../controllers/api/Network.API.controller");

// Check the connection of a certain user
router.get("/status", NetworkController.status);
// When the user connects
router.get("/heartbeat", NetworkController.heartbeat);

module.exports = router;
