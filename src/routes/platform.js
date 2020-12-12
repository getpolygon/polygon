const router = require("express").Router();
const AccountSchema = require("../models/account");

// Platform
router.get("/", async (req, res) => {
  var emailCookie = req.cookies.email;
  var passwordCookie = req.cookies.password;

  /*
   * Check for cookies before rendering the index
   * If cookies persist redirect to the platform.ejs
   * If not redirect to either login or register (Maybe login)
   */

  try {
    if (!emailCookie && !passwordCookie) {
      res.clearCookie("email").clearCookie("password").redirect("/auth/login");
    } else {
      await AccountSchema.findOne({
        email: req.cookies.email,
        password: req.cookies.password
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
    }
  } catch (err) {
    res.clearCookie("email").clearCookie("password").redirect("/auth/login");
  }
});

// User Account
router.get("/user/:accountId", async (req, res) => {
  try {
    if (!req.cookies.email || !req.cookies.password) {
      return res.redirect("/");
    } else {
      const accountId = req.params.accountId;
      const currentAccount = await AccountSchema.findOne({
        email: req.cookies.email,
        password: req.cookies.password
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
    }
  } catch (err) {
    return res.clearCookie("email").clearCookie("password").redirect("/auth/login");
  }
});

// Notifications
router.get("/notifications", async (req, res) => {
  try {
    const currentAccount = await AccountSchema.findOne({
      email: req.cookies.email,
      password: req.cookies.password
    });
    if (currentAccount == null) {
      res.clearCookie("email").clearCookie("password").redirect("/auth/login");
    } else {
      res.render("notifications", {
        currentAccount: currentAccount,
        title: `Notifications | ArmSocial`
      });
    }
  } catch (err) {
    res.clearCookie("email").clearCookie("password").redirect("/auth/login");
  }
});

// Settings
router.get("/settings", async (req, res) => {
  let email = req.cookies.email;
  let password = req.cookies.password;

  try {
    if (!email || !password) {
      res.redirect("/");
    } else {
      const currentAccount = await AccountSchema.findOne({
        email: email,
        password: password
      });
      if (currentAccount == null) {
        res.clearCookie("email").clearCookie("password").redirect("/auth/login");
      } else
        res.render("settings", {
          currentAccount: currentAccount,
          title: "Settings | ArmSocial"
        });
    }
  } catch (err) {
    res.clearCookie("email").clearCookie("password").redirect("/");
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("email").clearCookie("password").redirect("/");
  req.session.destroy;
});

module.exports = router;
