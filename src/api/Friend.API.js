const _ = require("lodash");
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

  _.each(addedAccount.friends.pending, async (account) => {
    if (account.accountId == currentAccount.id) {
      addedAccount.friends.pending.pull(account);
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

  var { cancel } = req.query;

  if (cancel) {
    _.each(currentAccount.friends.requested, async (account) => {
      if (account.accountId == accountToCheckDoc.id) {
        var foundAccount = await AccountSchema.findById(account.accountId);
        _.each(foundAccount.friends.pending, async (account) => {
          if (account.accountId == currentAccount.id) {
            foundAccount.friends.pending.pull(account);
            await foundAccount.save();
          }
        });
        currentAccount.friends.requested.pull(account);
        res.json(currentAccount);
        await currentAccount.save();
      }
    });
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
