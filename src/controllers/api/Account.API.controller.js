const mongoose = require("mongoose");
const { AccountSchema, PostSchema } = require("../../models");

const AccountController = {
  // For fetching account details
  fetchAccount: async (req, res) => {
    const { accountId } = req.query;

    // If no account ID was provided
    if (!accountId) return res.json(req.user);
    else {
      // Checking the validity of the ID
      if (mongoose.Types.ObjectId.isValid(accountId)) {
        // Finding the account and omitting `password`, `email`, `notifications`, `friends` fields
        const account = await AccountSchema.findById(accountId, {
          password: 0,
          email: 0,
          notifications: 0,
          friends: 0,
          // Only populating the type field to keep everything private
        }).populate("friends", "type");

        // If the account does not exist
        if (!account) return res.status(404).send();
        else return res.json(account);
      } else return res.status(400).send();
    }
  },
  // For deleting account
  deleteAccount: async (req, res) => {
    // Getting the ID of the user
    const { id } = req.user;
    // Getting all posts
    const posts = await PostSchema.find({ author: id });
    // Deleteing the account from MongoDB
    const result = await AccountSchema.findByIdAndDelete(id);
    // Deleting the posts that are associated with this account
    // const postResult = await PostSchema.deleteMany({ author: id });

    // Clearing the cookie and sending the response
    return res.status(200).clearCookie("jwt").send();
  },
  // For updating account
  updateAccount: async (req, res) => {
    // Getting the user and the payload
    const { user, body } = req;

    // If theme was provided
    if (body?.theme) {
      // Getting the theme
      const { theme } = body;

      // If dark theme was selected
      if (theme?.dark && !theme?.light) {
        const result = await AccountSchema.findByIdAndUpdate(user.id, {
          theme: "dark",
        });
        return res.json({ result });
      }
      // If light theme was selected
      else if (theme?.light && !theme?.dark) {
        const result = await AccountSchema.findByIdAndUpdate(user.id, {
          theme: "light",
        });
        return res.json({ result });
      }
      // If there's no data/invalid
      else return res.status(401).send();
    }
    // If nothing was provided
    else return res.status(401).send();
  },
};

module.exports = AccountController;
