const mongoose = require("mongoose");

const SavedSchema = require("./saved");
const FriendSchema = require("./friend");
const PostSchema = require("./post/post");

const AccountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
  bio: { type: String, required: false },
  pictureUrl: { type: String, required: true },
  isPrivate: { type: Boolean, required: true },
  friends: {
    pending: { type: [FriendSchema], default: [] },
    approved: { type: [FriendSchema], default: [] },
    requested: { type: [FriendSchema], default: [] }
  },
  posts: [PostSchema],
  saved: [SavedSchema],
  datefield: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model("Account", AccountSchema);
