const router = require("express").Router();
const AccountSchema = require("../models/account");

// Platform
router.get("/", async (req, res) => {
  // var emailCookie = req.session.email;
  // var passwordCookie = req.session.password;

  /*
   * Check for cookies before rendering the index
   * If cookies persist redirect to the platform.ejs
   * If not redirect to either login or register (Maybe login)
   */

  try {
    await AccountSchema.findOne({
      email: req.session.email,
      password: req.session.password
    })
      .then((currentAccount) => {
        if (currentAccount == null) {
          res.clearCookie("email").clearCookie("password").redirect("/auth/login");
        } else {
          res.render("platform", {
            currentAccount: currentAccount,
            title: "ArmSocial"
          });
        }
      })
      .catch((err) => {
        res.clearCookie("email").clearCookie("password").redirect("/auth/login");
        console.log(err);
      });
  } catch (err) {
    req.session.destroy();
    res.redirect("/");
  }
});

// User Account
router.get("/user/:accountId", async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const currentAccount = await AccountSchema.findOne({
      email: req.session.email,
      password: req.session.password
    });
    const platformAccount = await AccountSchema.findById(accountId);
    if (currentAccount == null) {
      return res.clearCookie("email").clearCookie("password").redirect("/auth/login");
    }
    if (!platformAccount) {
      return res.redirect("/static/no-account.html");
    } else {
      return res.render("platform_account", {
        currentAccount: currentAccount,
        platformAccount: platformAccount,
        title: `${platformAccount.fullName} | ArmSocial`
      });
    }
  } catch (err) {
    console.error(err);
    req.session.destroy();
    res.redirect("/");
  }
});

// Notifications
router.get("/notifications", async (req, res) => {
  try {
    const currentAccount = await AccountSchema.findOne({
      email: req.session.email,
      password: req.session.password
    });
    if (currentAccount == null) {
      req.session.destroy();
      res.redirect("/");
    } else {
      res.render("notifications", {
        currentAccount: currentAccount,
        title: `Notifications | ArmSocial`
      });
    }
  } catch (err) {
    req.session.destroy();
    res.redirect("/");
  }
});

// Settings
router.get("/settings", async (req, res) => {
  let email = req.session.email;
  let password = req.session.password;

  try {
    const currentAccount = await AccountSchema.findOne({
      email: email,
      password: password
    });
    if (currentAccount == null) {
      req.session.destroy();
      res.redirect("/");
    } else
      res.render("settings", {
        currentAccount: currentAccount,
        title: "Settings | ArmSocial"
      });
  } catch (err) {
    req.session.destroy();
    res.redirect("/");
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  return res.clearCookie("connect.sid").redirect("/auth/login");
});

module.exports = router;
