const router = require("express").Router();
const NetworkController = require("../controllers/api/Network.API.controller");

// To connect to the network via websocket
router.ws("/", NetworkController.onConnect);
// To get user status (active, dnd, idle)
router.get("/status", NetworkController.getUserStatus);

module.exports = router;
