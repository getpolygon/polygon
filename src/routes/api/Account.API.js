const router = require("express").Router();
// const upload = require("../../middleware/multer");
const {
  updateAccount,
  deleteAccount,
  fetchAccount,
} = require("../../controllers/api/Account.API.controller");

// For fetching account details
router.get("/fetch", fetchAccount);
// For updating account
router.patch("/update", updateAccount);
// For deleting account
router.delete("/delete", deleteAccount);

module.exports = router;
