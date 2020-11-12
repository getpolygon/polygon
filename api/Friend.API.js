const router = require("express").Router();
const mongoose = require("mongoose");

const AccountSchema = require("../models/account");

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

module.exports = router;
