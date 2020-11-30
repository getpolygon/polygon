const router = require("express").Router();
const mongoose = require("mongoose");

const AccountSchema = require("../models/account");

router.put("/add", async (req, res) => {
  var currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  var addedAccount = await AccountSchema.findById(req.query.account);

  await currentAccount.updateOne({
    $push: {
      "friends.requested": {
        _id: new mongoose.Types.ObjectId(),
        accountId: addedAccount._id,
        fullName: addedAccount.fullName,
        email: addedAccount.email,
        bio: addedAccount.bio,
        pictureUrl: addedAccount.pictureUrl,
        isPrivate: addedAccount.isPrivate
      }
    }
  });

  addedAccount.friends.pending.forEach(async (obj) => {
    if (obj.accountId === currentAccount._id) {
      await addedAccount.friends.pending.pull(obj);
      await addedAccount.save();
    }
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
        isPrivate: currentAccount.isPrivate
      }
    }
  });

  await currentAccount.save();
  res.json({
    result: "OK"
  });
});

router.put("/update", async (req, res) => {
  var accountToCheckDoc = await AccountSchema.findById(req.query.accountId);
  var currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  var { accept, decline, cancel } = req.query;

  if (cancel) {
    for (var i = 0; i < currentAccount.friends.requested.length; i++) {
      if (
        currentAccount.friends.requested[i].accountId == accountToCheckDoc._id
      ) {
        var accountToFind = await AccountSchema.findById(
          currentAccount.friends.requested[i].accountId
        );
        for (var z = 0; z < accountToFind.friends.pending.length; z++) {
          if (
            accountToFind.friends.pending[z].accountId == currentAccount._id
          ) {
            await accountToFind.friends.pending.pull(
              accountToFind.friends.pending[z]
            );
            await accountToFind.save();
          }
        }
        await currentAccount.friends.requested.pull(
          currentAccount.friends.requested[i]
        );
        await currentAccount.save().then((doc) => res.json(doc));
      }
    }
  }
});

router.get("/check", async (req, res) => {
  var accountToCheck = req.query.accountId;
  var currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  function get_requested() {
    for (var i = 0; i < currentAccount.friends.requested.length; i++) {
      if (currentAccount.friends.requested[i].accountId == accountToCheck) {
        return currentAccount.friends.requested[i];
      }
    }
  }

  function get_approved() {
    for (var i = 0; i < currentAccount.friends.approved.length; i++) {
      if (currentAccount.friends.approved[i].accountId == accountToCheck) {
        return currentAccount.friends.approved[i];
      }
    }
  }

  function get_pending() {
    for (var i = 0; i < currentAccount.friends.pending.length; i++) {
      if (currentAccount.friends.pending[i].accountId == accountToCheck) {
        return currentAccount.friends.pending[i];
      }
    }
  }

  function get_current_account() {
    if (currentAccount._id == accountToCheck) {
      return true;
    } else {
      return false;
    }
  }

  res.json({
    approved: get_approved(),
    requested: get_requested(),
    pending: get_pending(),
    is_current_account: get_current_account()
  });
});

module.exports = router;
