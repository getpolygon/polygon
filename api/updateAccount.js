require("mongoose");
const router = require("express").Router();

const AccountSchema = require("../models/account");

router.put("/", async (req, res, next) => {
  if (!req.cookies.email || !req.cookies.password) {
    res.json({ err: "Forbidden", status: 403 });
  } else {
    let currentAccount = await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password });
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    let fullName;
    let bio = req.query.bio;
    let email = req.query.email;
    let password = req.query.password;
    let privacy = req.query.privacy;

    if (privacy) {
      await currentAccount.updateOne({ isPrivate: privacy })
      .then(response => {
        res.json(response.privacy);
      })
      .catch(e => {
        res.json(e);
      });
    };
  };
});

module.exports = router;
