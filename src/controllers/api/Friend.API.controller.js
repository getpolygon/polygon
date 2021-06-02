const _ = require("lodash");
const mongoose = require("mongoose");
const { AccountSchema, FriendSchema } = require("../../models");

const FriendAPIController = {
  // For checking the relationship between accounts
  check: async (req, res) => {
    const currentAccount = req.user;
    const { accountId } = req.params;

    // Checking if account ID is the same as current account
    if (accountId === currentAccount.id) return res.status(304).send();
    else {
      // Checking if the account ID is valid
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        // Finding the other account
        const otherAccount = await AccountSchema.findById(accountId);

        // Checking if other account exists
        if (!otherAccount) return res.status(404).send();
        else {
          // Filtering out the request that contains the request sent from this account (may not be found and may be an empty array [])
          const filtered = otherAccount.friends.filter(
            (request) => request.sender === currentAccount._id
          )[0];

          // If there isn't an existing request
          if (!filtered) return res.json({ type: 3 });
          // If there is an existing request, send the type of that request
          else return res.json({ type: filtered.type });
        }
        // Bad Request
      } else return res.status(400).send();
    }
  },
  // For accepting a friend request
  accept: async (req, res) => {
    const { requestId } = req.params;

    if (mongoose.Types.ObjectId.isValid(requestId)) {
      const foundRequest = await FriendSchema.findById(requestId);

      if (!foundRequest) return res.status(404).send();
      else {
        foundRequest.type = 2;
        await foundRequest.save();
        return res.status(200).send();
      }
    } else return res.status(400).send();
  },
  // For declining a friend request
  decline: async (req, res) => {
    const { requestId } = req.params;

    if (mongoose.Types.ObjectId.isValid(requestId)) {
      const foundRequest = await FriendSchema.findById(requestId);

      if (!foundRequest) return res.status(404).send();
      else {
        const result = await FriendSchema.findByIdAndDelete(requestId);

        if (!result) return res.status(500).send(result);
        else return res.status(200).send();
      }
    } else return res.status(400).send();
  },
  // For sending a friend request
  request: async (req, res) => {
    const currentAccount = req.user;
    const { accountId: otherID } = req.params;

    const otherAccount = await AccountSchema.findById(otherID);

    if (!otherAccount) return res.status(404).send();
    else {
      const existingRequests = await FriendSchema.find({
        sender: currentAccount.id,
        owner: otherID,
      });

      if (existingRequests.length === 0) {
        const newRequest = new FriendSchema({
          type: 0,
          owner: otherAccount.id,
          sender: currentAccount.id,
        });

        await newRequest.save();

        return res.status(200).send();
      } else return res.status(403).send();
    }
  },
};

module.exports = FriendAPIController;
