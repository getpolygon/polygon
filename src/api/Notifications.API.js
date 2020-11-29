const router = require("express").Router();

const AccountSchema = require("../models/account");

// Getting the notifications for the current account
router.get("/fetch", async (req, res) => {
  const currentAccount = await AccountSchema.findOne({
    email: req.cookies.email,
    password: req.cookies.password
  });
  const { dismiss } = req.query;
  if (dismiss) {
    const otherAccount = await AccountSchema.friends.findOne({ _id: dismiss });
    console.log(otherAccount);
    const { notification } = req.query;
    // TODO: This is not working I guess
    await AccountSchema.findByIdAndDelete(notification);
    await currentAccount.friends.pending.pull(notification);
    await currentAccount
      .save()
      .then((doc) => res.json(doc))
      .catch((e) => console.error(e));
  }
  if (!dismiss) {
    const notifications = [];
    currentAccount.friends.pending.forEach((request) =>
      notifications.push(request)
    );
    res.json(notifications);
  }
});

module.exports = router;
