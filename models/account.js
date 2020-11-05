const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  authorId: { type: String, required: true },
  authorImage: { type: String, required: true },
  datefield: { type: String, required: true },
});

const AccountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 },
  bio: { type: String, required: false },
  pictureUrl: { type: String, required: true },
  isPrivate: { type: Boolean, required: true },
  friends: { type: Array, required: true },
  posts: [PostSchema],
  date: { type: String, required: true },
});

module.exports = mongoose.model("Account", AccountSchema);
