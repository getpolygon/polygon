const router = require("express").Router();
const AccountSchema = require("../models/account");

router.get("/", (req, res) => {
  if (!req.cookies.email && !req.cookies.password) {
    res.clearCookie("email");
    res.clearCookie("password");
    res.render("login", { title: "Login | ArmSocial" });
  } else {
    res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let Account = await AccountSchema.findOne({
    email: email,
    password: password,
  })
    .then((doc) => {
      if (doc <= 0) {
        return [];
      } else {
        return doc;
      }
    })
    .catch((e) => console.log(e));

  if (email != Account.email) {
    res.status(404).render("login", {
      err:
        "This account can't be found. Try checking your email and password and try again.",
      title: "Login | ArmSocial",
    });
  } else {
    res.cookie("email", email);
    res.cookie("password", password);
    res.redirect("/");
  }
});

module.exports = router;
