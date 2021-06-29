const router = require("express").Router();
const upload = require("../../middleware/multer");
const AccountController =
  require("../../controllers/api/Account.API.controller").default;

// For updating account
router.patch("/update", AccountController.updateAccount);
// For fetching account details
router.get("/fetch", AccountController.fetchAccount);
// For deleting account
router.delete("/delete", AccountController.deleteAccount);

module.exports = router;
