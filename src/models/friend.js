const mongoose = require("mongoose");
const FriendSchema = new mongoose.Schema({
  accountId: { type: String },
  fullName: { type: String },
  email: { type: String },
  bio: { type: String },
  pictureUrl: { type: String },
  isPrivate: { type: Boolean }
});
module.exports = FriendSchema;
