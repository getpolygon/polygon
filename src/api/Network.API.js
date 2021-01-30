const router = require("express").Router();
const NetworkController = require("../controllers/api/Network.API.controller");

router.ws("/", NetworkController.onConnect);
router.get("/active", NetworkController.getActiveUsers);

module.exports = router;
