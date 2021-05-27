const _ = require("lodash");
const mongoose = require("mongoose");
const { AccountSchema, FriendSchema } = require("../../models");

// For sending a friend request
exports.addFriend = async (req, res) => {
  const { accountId } = req.query;

  if (!accountId) return res.status(400).send();
  else {
    const currentAccount = req.user;
    const addedAccount = await AccountSchema.findById(accountId).populate(
      "friends"
    );

    // If the other account does not exist
    if (!addedAccount) return res.status(410).send();
    else {
      // Checking for existing friend requests
      const existingFriendRequest = _.filter(addedAccount.friends, {
        sender: currentAccount._id,
      })[0];

      // If there are no existing requests in the other account
      if (!existingFriendRequest) {
        // Friend document that will go to the other account
        const outgoing = await FriendSchema.create({
          // Pending
          type: 0,
          owner: addedAccount,
          sender: currentAccount,
        });
        // Friend document that will go to current account
        const current = await FriendSchema.create({
          // Requested
          type: 1,
          sender: addedAccount,
          owner: currentAccount,
        });

        // Pushing the friend requests to both accounts
        addedAccount.friends.push(outgoing);
        currentAccount.friends.push(current);
        // Saving the accounts
        await addedAccount.save();
        await currentAccount.save();
        return res.json({ status: 1 });
      } else {
        switch (existingFriendRequest.type) {
          case 0: {
            await FriendSchema.findOneAndUpdate(
              { sender: addedAccount, owner: currentAccount },
              {
                type: 2,
              }
            );
            await FriendSchema.findOneAndUpdate(
              { sender: currentAccount, owner: addedAccount },
              {
                type: 2,
              }
            );

            return res.json({ type: 2 });
          }
          case 1: {
            return res.json({ status: 1 });
          }
          case 2: {
            return res.status(403).json({ status: 2, already: true });
          }
        }
      }
    }
  }
};

exports.checkFriendship = async (req, res) => {
  const currentAccount = req.user;
  const { accountId } = req.query;

  if (accountId) {
    if (accountId === currentAccount._id) return res.status(304).send();
    else {
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        const otherAccount = await AccountSchema.findById(accountId);

        if (!otherAccount) return res.status(404).send();
        else {
          const filtered = otherAccount.friends.filter(
            (request) => request.sender === currentAccount._id
          )[0];

          if (!filtered) return res.json({ type: 3 });
          else return res.json({ type: filtered.type });
        }
        // TODO
      } else return res.status(0).send();
    }
  } else return res.status(400).send();
};
