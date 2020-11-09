const router = require("express").Router();

const AccountSchema = require("../models/account");

router.put("/", async (req, res, next) => {
  let currentAccount = await AccountSchema.findOne({ email: req.cookies.email, password: req.cookies.password });
  let { firstName, lastName, bio, email, password, privacy } = req.query;

  if (privacy) {
    await currentAccount
      .updateOne({ isPrivate: privacy })
      .then((response) => {
        res.json(response.privacy);
      })
      .catch((e) => {
        res.json(e);
      });
  };
  if (bio) {
    await currentAccount
      .updateOne({ bio: bio })
      .then((response) => {
        res.json(response.bio);
      })
      .catch((e) => {
        res.json(e);
      });
  };
  if (firstName || lastName) {
    await currentAccount
      .update({ firstName: firstName, lastName: lastName, fullName: `${firstName} ${lastName}` })
      .then((response) => {
        res.json({
          "firstName": response.firstName,
          "lastName": response.lastName,
          "fullName": response.fullName
        });
      })
      .catch((e) => res.json(e));
  };
  if (email && password) {
    if (email) {
      await currentAccount
        .updateOne({ email: email })
        .then((response) => {
          res.json(response.email);
        })
        .catch((e) => {
          res.json(e);
        });
    };
    if (password) {
      await currentAccount
        .updateOne({ password: password })
        .then((response) => {
          res.json(response.password);
        })
        .catch((e) => {
          res.json(e);
        });
    };
    if (email && password) {
      await currentAccount
        .update({ email: email, password: password })
        .then((response) => {
          res.json({
            "email": response.email,
            "password": response.password
          });
        })
        .catch((e) => {
          res.json(e);
        });
    };
  };
});

module.exports = router;
