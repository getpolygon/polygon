const router = require("express").Router();

const AccountSchema = require("../models/account");

// Getting the notifications for the current account
router.get("/fetch", async (req, res) => {
  // Getting current account
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });

  // Dismiss for dismissing a notification
  const { dismiss } = req.query;

  // If the query has dismiss parameter in it
  if (dismiss) {
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
  } else {
    res.json(currentAccount.friends.pending);
  }
});

module.exports = router;
