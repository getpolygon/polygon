const Express = require("express");
const mongoose = require("mongoose");
const textCleaner = require("../../helpers/textCleaner");
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
          email: 0,
          posts: 0,
          theme: 0,
          password: 0,
          notifications: 0,
          // friends: 0,
        });
        // Only populating the type field to keep everything private
        // .populate("friends", "type");

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
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Promise<void>}
   */
  updateAccount: async (req, res) => {
    // Getting the user
    const { user } = req;
    // Getting the payload
    const { bio, theme } = req.body;

    // If theme was provided
    if (theme) {
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
      // If there's no data or it՛s invalid
      else return res.status(400).send();
    }
    // If the user wants to upate the bio
    else if (bio) {
      // Cleaning the text
      const cleanedBio = textCleaner(bio);
      // Updating the bio
      const result = await AccountSchema.findByIdAndUpdate(user.id, {
        bio: cleanedBio,
      });
      return res.json({ result });
    }
    // If nothing was provided or the choice doesn't match
    else return res.status(400).send();
  },
};

module.exports = AccountController;
