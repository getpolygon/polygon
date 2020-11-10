const router = require("express").Router();

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
  let email = req.cookies.email;
  let password = req.cookies.password;

  try {
    if (!email || !password) {
      res.redirect("/");
    } else {
      const currentAccount = await AccountSchema.findOne({
        email: email,
        password: password,
      });
      if (currentAccount == null) {
        res
          .clearCookie("email")
          .clearCookie("password")
          .redirect("/auth/login")
      }
      else res.render("settings", { currentAccount: currentAccount, title: "Settings | ArmSocial" });
    }
  }
  catch (err) {
    res
      .clearCookie("email")
      .clearCookie("password")
      .redirect("/")
  }

});

module.exports = router;
