// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const minio = require("../../db/minio");
const AccountSchema = require("../../models/all/account");
// const checkForDuplicates = require("../../helpers/checkForDuplicates");

// For fetching account details
exports.fetchAccount = async (req, res) => {
  res.json(req.user);
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
    objectStream.on(
      "end",
      async () => await minio.client.removeObjects(minio.bucket, files)
    );

    // Deleteing the account from MongoDB
    await AccountSchema.findByIdAndDelete(data.id);

    // Clearing the cookie and sending the response
    return res.status(200).clearCookie("jwt").send("Deleted");
  } else return res.status(400).send("Bad Request");
};

exports.updateAccount = async (req, res) => {};
