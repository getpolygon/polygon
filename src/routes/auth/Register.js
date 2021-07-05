const router = require("express").Router();
const upload = require("../../middleware/multer").default;
const RegistrationController =
  require("../../controllers/auth/Registration.controller").default;

router.post("/", upload.single("avatar"), RegistrationController);

module.exports = router;
