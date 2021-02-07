const router = require("express").Router();
const AccountController = require("../controllers/api/Account.API.controller");

// For fetching account details
router.get("/fetch", AccountController.fetchAccount);
// For getting random accounts
router.get("/random", AccountController.getRandomAccounts);
// For updating account
router.put("/update", AccountController.updateAccount);
// For deleting account
router.delete("/delete", AccountController.deleteAccount);

module.exports = router;
