const router = require("express").Router();

const AccountSchema = require("../models/account");

router.get("/", async (req, res) => {
  if (!req.cookies.email && !req.cookies.password) {
    res.clearCookie("password");
    res.clearCookie("email");
    res.redirect("/auth/login");
  } else {
    const accounts = await AccountSchema.find({ isPrivate: false }).sort({
      date: -1 /* Sorting by date from the latest to the oldesst */,
    });
    const currentAccount = await AccountSchema.findOne({
      email: req.cookies.email,
      password: req.cookies.password,
    });
    res.render("users", {
      accounts: accounts,
      currentAccount: currentAccount,
      err: "We couldn't find any public accounts.",
      title: "Users | ArmSocial"
    });
  }
});

module.exports = router;
