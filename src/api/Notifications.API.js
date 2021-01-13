const jwt = require("jsonwebtoken");
const router = require("express").Router();
// const _ = require("lodash");

const AccountSchema = require("../models/account");

// Getting the notifications for the current account
router.get("/fetch", async (req, res) => {
  jwt.verify(req.cookies.jwt, process.env.JWT_TOKEN, async (err, data) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    else if (data) {
      const currentAccount = await AccountSchema.findById(data.id);
      return res.json(currentAccount.friends.pending);
    }
  });
});

module.exports = router;
