const router = require("express").Router();
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const AccountSchema = require("../models/account");

router.get("/", (req, res) => {
  if (!req.cookies.email || !req.cookies.password) {
    req.session.destroy();
    return res.render("login", { title: "Login | ArmSocial" });
  } else {
    return res.redirect("/");
  }
});

router.post("/", async (req, res) => {
  let email = req.body.email;
  let Account = await AccountSchema.findOne({
    email: email
  })
    .then((doc) => {
      if (doc <= 0) {
        return [];
      } else {
        return doc;
      }
    })
    .catch((e) => {
      return e;
    });
  let password = await bcrypt
    .compare(req.body.password, Account.password)
    .then((result) => {
      if (result === true) return req.body.password;
      else return false;
    })
    .catch((e) => {
      return e;
    });

  if (email != Account.email || password === false) {
    return res.status(302).render("login", {
      err: "Please check your credentials or create an account",
      title: "Login | ArmSocial"
    });
  } else {
    // req.cookies.email = Account.email;
    // req.cookies.password = Account.password;

    // const token = jwt.sign(
    //   {
    //     email: Account.email,
    //     password: Account.password
    //   },
    //   process.env.JWT_TOKEN
    // );

    return (
      res
        .cookie("email", Account.email)
        .cookie("password", Account.password)
        // .json({
        //   token: token
        // })
        .redirect("/")
    ); // TODO: THIS IS TEMPORARY
  }
});

module.exports = router;
