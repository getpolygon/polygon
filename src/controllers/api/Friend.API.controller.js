const _ = require("lodash");
const mongoose = require("mongoose");
const AccountSchema = require("../../models/account");

exports.addFriend = async (req, res) => {
  const currentAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
  });
  const addedAccount = await AccountSchema.findById(req.query.account);

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
};

exports.checkFriendship = async (req, res) => {
  const accountToCheck = req.query.accountId;
  const currentAccount = await AccountSchema.findOne({
    email: req.session.email,
    password: req.session.password
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
};
