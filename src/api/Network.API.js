const router = require("express").Router();
const NetworkController = require("../controllers/api/Network.API.controller");

router.ws("/", NetworkController.onConnect);
router.get("/status", NetworkController.getUserStatus);

module.exports = router;
