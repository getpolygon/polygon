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

router.delete("/unfriend", async (req, res) => {
  const currentAccount = await AccountSchema.findOne({ email: req.cookies.email });
  const { accountId } = req.query; // Account to unfriend
  const foundAccountToUnfriend = await AccountSchema.findById(accountId);

  for (var i = 0; i < currentAccount.friends.approved.length; i++) {
    if (currentAccount.friends.approved[i].accountId == accountId) {
      currentAccount.friends.approved.pull(currentAccount.friends.approved[i]);
      await currentAccount.save();
    } else {
      continue;
    }
  }

  for (var x = 0; x < foundAccountToUnfriend.friends.approved.length; x++) {
    if (foundAccountToUnfriend.friends.approved[x].accountId == currentAccount._id) {
      foundAccountToUnfriend.friends.approved.pull(foundAccountToUnfriend.friends.approved[x]);
      await foundAccountToUnfriend.save();
    } else {
      continue;
    }
  }

  res.json({
    status: "OK"
  });
});

router.put("/update", async (req, res) => {
  const { cancel, accept, decline, accountId } = req.query;
  const accountToCheckDoc = await AccountSchema.findById(accountId);
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  if (cancel && accountId) {
    return _.each(currentAccount.friends.requested, async (account) => {
      if (account.accountId == accountToCheckDoc.id) {
        const foundAccount = await AccountSchema.findById(account.accountId);
        _.each(foundAccount.friends.pending, async (account) => {
          if (account.accountId == currentAccount.id) {
            foundAccount.friends.pending.pull(account);
            await foundAccount.save();
          }
        });
        currentAccount.friends.requested.pull(account);
        await currentAccount.save();
        return res.json({
          status: "OK"
        });
      }
    });
  }

  if (decline && accountId) {
    console.log("decline friend request of", accountId);
    return _.each(currentAccount.friends.pending, async (account) => {
      if (account.accountId == accountToCheckDoc.id) {
        const foundAccount = await AccountSchema.findById(account.accountId);
        _.each(foundAccount.friends.requested, async (_account) => {
          if (_account.accountId == currentAccount.id) {
            foundAccount.friends.requested.pull(account);
            await foundAccount.save();
          }
        });
        currentAccount.friends.requested.pull(account);
        await currentAccount.save();
        return res.json({
          status: "OK"
        });
      }
    });
  }

  if (accept && accountId) {
    console.log("accept friend request of", accountId);
    _.each(currentAccount.friends.pending, async (account) => {
      if (account.accountId == accountToCheckDoc._id) {
        currentAccount.friends.pending.pull(account);
        const approved = currentAccount.friends.approved.create({
          accountId: accountToCheckDoc._id,
          fullName: accountToCheckDoc.fullName,
          email: accountToCheckDoc.email,
          bio: accountToCheckDoc.bio,
          pictureUrl: accountToCheckDoc.pictureUrl,
          isPrivate: accountToCheckDoc.isPrivate
        });
        currentAccount.friends.approved.push(approved);
        await currentAccount.save();
      }
    });
    _.each(accountToCheckDoc.friends.requested, async (account) => {
      if (account.accountId == currentAccount._id) {
        accountToCheckDoc.friends.requested.pull(account);
        const approved = accountToCheckDoc.friends.approved.create({
          accountId: currentAccount._id,
          fullName: currentAccount.fullName,
          email: currentAccount.email,
          bio: currentAccount.bio,
          pictureUrl: currentAccount.pictureUrl,
          isPrivate: currentAccount.isPrivate
        });
        accountToCheckDoc.friends.approved.push(approved);
        await accountToCheckDoc.save();
      }
    });

    return res.json({
      status: "OK"
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
