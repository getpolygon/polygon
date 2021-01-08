const router = require("express").Router();
const _ = require("lodash");
const AccountSchema = require("../models/account");

// Getting the notifications for the current account
router.get("/fetch", async (req, res) => {
  // Getting current account
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  res.json(currentAccount.friends.pending);
});

module.exports = router;
