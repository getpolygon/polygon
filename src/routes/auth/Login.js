const router = require("express").Router();
const LoginController =
  require("../../controllers/auth/Login.controller").default;

router.post("/", LoginController);

module.exports = router;
