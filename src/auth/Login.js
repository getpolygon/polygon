const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();

const AccountSchema = require("../models/account");

router.post("/", async (req, res) => {
  const email = _.toLower(req.body.email);
  const password = req.body.password;

  if (email && password) {
    const Account = await AccountSchema.findOne({ email: email });
    if (Account) {
      bcrypt.compare(password, Account.password, (err, same) => {
        if (err) {
          return res.json({
            error: err
          });
        } else if (same) {
          jwt.sign({ id: Account._id }, process.env.JWT_TOKEN, (err, token) => {
            if (err) return res.json({ error: "Unexpected Error" });
            else if (token)
              return res.status(200).cookie("jwt", token, { httpOnly: true }).json({
                token: token
              });
          });
        } else {
          return res.json({
            error: "Forbidden"
          });
        }
      });
    } else {
      return res.json({
        error: "No Accounts"
      });
    }
  } else {
    return res.json({
      error: "Missing fields"
    });
  }
});

module.exports = router;
