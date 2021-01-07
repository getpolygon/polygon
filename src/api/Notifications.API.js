const router = require("express").Router();
const _ = require("lodash");
const AccountSchema = require("../models/account");

// Getting the notifications for the current account
router.get("/fetch", async (req, res) => {
  // Getting current account
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  // Dismiss for dismissing a notification
  const { decline, accept } = req.query;

  // If the query has decline parameter in it
  if (decline) {
    const { notification } = req.query;
    // Finding the notification with the id which we get from our query
    const foundNotification = await currentAccount.friends.pending.id(notification);
    // Finding the account with accountId parameter linked to the notification
    const foundAccount = await AccountSchema.findById(foundNotification.accountId);

    // Finding the notification that has the dismissing user's ID in it
    for (var i = 0; i < foundAccount.friends.requested.length; i++) {
      // Checking if the accountId of the notification matches current account's ID
      if (foundAccount.friends.requested[i].accountId != currentAccount._id) {
        continue;
      } else {
        // Remove the notification from the other user
        await foundAccount.friends.requested.pull(foundAccount.friends.requested[i]);
        // Save the updated account
        await foundAccount.save();
      }
    }
    // Removing the notification from the current account
    currentAccount.friends.pending.pull(foundNotification);

    // Saving current account
    await currentAccount
      .save()
      .then((doc) => res.json(doc))
      .catch((e) => console.error(e));
  }
  if (accept) {
    const { notification } = req.query;
    // The notification that came to my account
    const foundNotification = await currentAccount.friends.pending.id(notification);
    // Finding the other account by the accountId parameter given in the notification above
    const foundAccount = await AccountSchema.findById(foundNotification.accountId);

    await currentAccount.friends.pending.pull(foundNotification);

    _.each(foundAccount.friends.requested, async (request) => {
      if (request.accountId == currentAccount._id) {
        return await foundAccount.friends.requested.pull(request);
      }
    });

    const approvalFromCurrentAccount = currentAccount.friends.approved.create({
      accountId: foundAccount._id,
      fullName: foundAccount.fullName,
      email: foundAccount.email,
      bio: foundAccount.bio,
      pictureUrl: foundAccount.pictureUrl,
      isPrivate: foundAccount.isPrivate
    });

    const approvalFromFoundAccount = foundAccount.friends.approved.create({
      accountId: currentAccount._id,
      fullName: currentAccount.fullName,
      email: currentAccount.email,
      bio: currentAccount.bio,
      pictureUrl: currentAccount.pictureUrl,
      isPrivate: currentAccount.isPrivate
    });

    currentAccount.friends.approved.push(approvalFromCurrentAccount);
    foundAccount.friends.approved.push(approvalFromFoundAccount);

    await currentAccount.save();
    await foundAccount.save();

    return res.json({
      status: "OK"
    });
  } else {
    return res.json(currentAccount.friends.pending);
  }
});

module.exports = router;
