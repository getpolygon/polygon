// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const minio = require("../../db/minio");
const { AccountSchema } = require("../../models");
// const checkForDuplicates = require("../../helpers/checkForDuplicates");

// For fetching account details
exports.fetchAccount = async (req, res) => {
  const { accountId } = req.query;

  if (!accountId) return res.json(req.user);
  else {
    if (mongoose.Types.ObjectId.isValid(accountId)) {
      const account = await AccountSchema.findById(accountId, {
        password: 0,
        email: 0,
        notifications: 0,
        // Only populating the type field to keep everything private
      }).populate("friends", "type");
      return res.json(account);
    } else return res.status(400).send("Bad Request");
  }
};

// For deleting account
exports.deleteAccount = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.user.id)) {
    const files = [];
    const objectStream = minio.client.listObjectsV2(
      minio.bucket,
      data.id + "/",
      true
    );

    // Pushing every object to a file array
    objectStream.on("data", (obj) => files.push(obj.name));
    // Then deleting every file from the file array
    objectStream.on("end", () =>
      minio.client.removeObjects(minio.bucket, files)
    );

    // Deleteing the account from MongoDB
    await AccountSchema.findByIdAndDelete(data.id);

    // Clearing the cookie and sending the response
    return res.status(200).clearCookie("jwt").send("Deleted");
  } else return res.status(400).send("Bad Request");
};

exports.updateAccount = async (req, res) => {};
