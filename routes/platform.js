require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");
const PostSchema = require("../models/post");

// Main page
router.get("/", async (req, res) => {
  var emailCookie = req.cookies.email;
  var passwordCookie = req.cookies.password;

  /*
   * Check for cookies before rendering the index
   * If cookies persist redirect to the platform.ejs
   * If not redirect to either login or register (Maybe login)
   */

  if (!emailCookie && !passwordCookie) {
    res.redirect("/auth/login");
  } else {
    Promise.all([
      await AccountSchema.find({ isPrivate: false }),
      await AccountSchema.findOne({
        email: req.cookies.email,
        password: req.cookies.password,
      }),
    ])
      .then(([accounts, currentAccount]) => {
        res.render("platform", {
          accounts: accounts,
          currentAccount: currentAccount,
          err: "We couldn't find any public accounts.",
          title: "Platform | ArmSocial"
        });
      })
      .catch(([err1, err2]) => {
        res.clearCookie("email", req.params.accountId);
        res.clearCookie("password", req.params.accountId);
        res.redirect("/auth/login", { err1: err1, err2: err2 });

        console.log(err1);
        console.log(err2);
      });
  }
});

// User's Account Page
router.get("/user/:accountId", async (req, res) => {
  if (!req.cookies.email || !req.cookies.password) {
    res.redirect("/");
  } else {
    const accountId = await req.params.accountId;
    const currentAccount = await AccountSchema.findOne({
      email: req.cookies.email,
      password: req.cookies.password,
    });
    const platformAccount = await AccountSchema.findById(accountId);
    const platformAccountPosts = await PostSchema.find({ authorId: accountId }).sort({ datefield: -1 });
    if (!platformAccount) {
      res.redirect("/");
    } else {
      res.render("platformAccount", {
        currentAccount: currentAccount,
        platformAccount: platformAccount,
        posts: platformAccountPosts,
        title: `${platformAccount.fullName} | ArmSocial`
      });
    }
  }
});

// Logout
router.post("/logout/:accountId", (req, res) => {
  res.clearCookie("email", req.params.accountId);
  res.clearCookie("password", req.params.accountId);
  res.redirect("/");
});

module.exports = router;
