const router = require("express").Router();
const mongoose = require("mongoose");

const AccountSchema = require("../models/account");
const { obj } = require("../models/post");

router.put("/add", async (req, res) => {
  let currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password,
  });
  let addedAccount = await AccountSchema.findById(req.query.addedAccount);

  await currentAccount.updateOne({
    $push: {
      "friends.requested": {
        _id: new mongoose.Types.ObjectId(),
        accountId: addedAccount._id,
        fullName: addedAccount.fullName,
        email: addedAccount.email,
        bio: addedAccount.bio,
        pictureUrl: addedAccount.pictureUrl,
        isPrivate: addedAccount.isPrivate,
      },
    },
  });

  await addedAccount.updateOne({
    $push: {
      "friends.pending": {
        _id: new mongoose.Types.ObjectId(),
        accountId: currentAccount._id,
        fullName: currentAccount.fullName,
        email: currentAccount.email,
        bio: currentAccount.bio,
        pictureUrl: currentAccount.pictureUrl,
        isPrivate: currentAccount.isPrivate,
      },
    },
  });

  await currentAccount.save();
  await addedAccount.save();
  res.json({
    result: "OK",
  });
});

router.get("/check", async (req, res) => {
  const { accountId } = req.query;
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password,
  });

  if (accountId = currentAccount._id) {
    res.json([]);
  } else {
    currentAccount.friends.requested.forEach((obj) => {
      if ((obj._authorId = accountId)) {
        res.json(obj);
      } else {
        res.json([]);
      }
    });
  }
});

module.exports = router;
