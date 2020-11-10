require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");

// Main page
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
      res
        .clearCookie("email")
        .clearCookie("password")
        .redirect("/auth/login")
    } else {
      await AccountSchema.findOne({
        email: req.cookies.email,
        password: req.cookies.password,
      })
        .then(currentAccount => {
          if (currentAccount == null) {
            res
              .clearCookie("email")
              .clearCookie("password")
              .redirect("/auth/login")
          } else {
            res.render("platform", {
              currentAccount: currentAccount,
              title: "ArmSocial"
            });
          }

        })
        .catch(err => {
          res
            .clearCookie("email")
            .clearCookie("password")
            .redirect("/auth/login");
          console.log(err);
        });
    };
  }
  catch (err) {
    res
      .clearCookie("email")
      .clearCookie("password")
      .redirect("/auth/login")
  };
});


// User's Account Page
router.get("/user/:accountId", async (req, res) => {
  try {
    if (!req.cookies.email || !req.cookies.password) {
      res.redirect("/");
    } else {
      const accountId = req.params.accountId;
      const currentAccount = await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password });
      const platformAccount = await AccountSchema.findById(accountId);
      if (currentAccount == null) {
        res
          .clearCookie("email")
          .clearCookie("password")
          .redirect("/auth/login")
      } if (!platformAccount) {
        res.redirect("/static/no-account.html");
      } else {
        res.render("platformAccount", {
          currentAccount: currentAccount,
          platformAccount: platformAccount,
          title: `${platformAccount.fullName} | ArmSocial`
        });
      }
    }
  }
  catch (err) {
    res
      .clearCookie("email")
      .clearCookie("password")
      .redirect("/auth/login")
  };
});

// Notifications tab
router.get("/notifications", async (req, res) => {
  try {
    const currentAccount = await AccountSchema.findOne({
      email: req.cookies.email,
      password: req.cookies.password,
    });
    if (currentAccount == null) {
      res
        .clearCookie("email")
        .clearCookie("password")
        .redirect("/auth/login")
    } else {
      res.render("notifications", {
        currentAccount: currentAccount,
        title: `Notifications | ArmSocial`
      });
    };
  }
  catch (err) {
    res
      .clearCookie("email")
      .clearCookie("password")
      .redirect("/auth/login")
  }
});

// Logout
router.post("/logout/:accountId", (req, res) => {
  res
    .clearCookie("email")
    .clearCookie("password")
    .redirect("/")
});

module.exports = router;
