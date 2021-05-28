const mongoose = require("mongoose");
const minio = require("../../db/minio");
const { AccountSchema } = require("../../models");

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
    } else return res.status(400).send();
  }
};

// For deleting account
exports.deleteAccount = async (req, res) => {
  const objectStream = minio.client.listObjectsV2(
    minio.config.MINIO_BUCKET,
    req.user._id + "/",
    true
  );

  // Pushing every object to a file array
  objectStream.on("data", async (obj) => {
    await minio.client.removeObject(minio.config.MINIO_BUCKET, obj.name);
  });

  // Deleteing the account from MongoDB
  await AccountSchema.findByIdAndDelete(req.user.id);

  // Clearing the cookie and sending the response
  return res.status(200).clearCookie("jwt").send();
};

exports.updateAccount = (req, res) => res.status(501).send();
