require("mongoose");
const router = require("express").Router();

let avatarLinks = [
  "/static/img/1.png",
  "/static/img/2.png",
  "/static/img/3.png",
  "/static/img/4.png",
  "/static/img/5.png",
  "static/img/6.png",
];

const AccountSchema = require("../models/account");

// Register
router.get("/register", (req, res) => {
  if (!req.cookies.email & !req.cookies.password) {
    res.clearCookie("email");
    res.clearCookie("password");
    res.render("register", { title: "Register | ArmSocial" });
  } else {
    res.redirect("/auth/register");
  }
});

router.post("/register", async (req, res) => {
  let Account = new AccountSchema({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email,
    password: req.body.password,
    bio: req.body.bio,
    pictureUrl: req.body.avatar,
    isPrivate: req.body.privateCheck ? true : false,
    date: Date.now(),
  });

  var duplicateAccount = await AccountSchema.findOne({
    email: Account.email,
  }).then((list) => {
    if (list == null) {
      return [];
    } else {
      return list;
    }
  });

  if (Account.email == duplicateAccount.email) {
    res.redirect("/");
  }
  if (duplicateAccount == null || Account.email != duplicateAccount.email) {
    if (req.body.avatar) {
      // Select the image link as a link from Firebase
      Account.pictureUrl = `https://firebasestorage.googleapis.com/v0/b/arm-social.appspot.com/o/${req.body.email.replace(
        "@",
        "%40"
      )}.jpg?alt=media`;
    } else {
      // Select a random image link from where the image will be loaded
      Account.pictureUrl =
        avatarLinks[Math.floor(Math.random() * avatarLinks.length)];
    }
    await Account.save()
      .then(() => {
        res.cookie("email", Account.email, { maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("password", Account.password, {
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(`/user/${Account._id}`);
      })
      .catch((e) => {
        res.redirect("/");
        console.log(e);
      });
  }
});

// Login
router.get("/login", (req, res) => {
  if (!req.cookies.email && !req.cookies.password) {
    res.clearCookie("email");
    res.clearCookie("password");
    res.render("login", { title: "Login | ArmSocial" });
  } else {
    res.redirect("/");
  }
});

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const Account = await AccountSchema.findOne({
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
    res
      .status(404)
      .render("login", {
        err:
          "This account can't be found. Try checking your email and password and try again.",
        title: "Login | ArmSocial"
      });
  } else {
    res.cookie("email", email);
    res.cookie("password", password);
    res.redirect("/");
  }
});

module.exports = router;
