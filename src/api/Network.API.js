const router = require("express").Router();
const NetworkController = require("../controllers/api/Network.API.controller");

// When the user connects
router.get("/heartbeat", NetworkController.heartbeat);
// Check the connection of a certain user
router.get("/status", NetworkController.status);

module.exports = router;
