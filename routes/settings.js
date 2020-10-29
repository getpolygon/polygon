const router = require("express").Router();
const mongoose = require("mongoose");

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
  let email = req.cookies.email;
  let password = req.cookies.password;

  if (!email || !password) {
    res.redirect("/");
  } else {
    const currentAccount = await AccountSchema.findOne({
      email: email,
      password: password,
    });
    res.render("settings", { currentAccount: currentAccount, title: "Settings | ArmSocial" });
  }
});

module.exports = router;
