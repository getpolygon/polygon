const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Account = new mongoose.Schema({
  email: { type: String, required: true },
  avatar: { type: String, required: true },
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  bio: { type: String, required: false, default: "" },
  posts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  password: { type: String, required: true, minlength: 8 },
  friends: [{ type: mongoose.Types.ObjectId, ref: "Friend" }],
  isPrivate: { type: Boolean, required: true, default: false },
  timestamp: { type: Date, default: () => Date.now(), required: true },
  notifications: [{ type: mongoose.Types.ObjectId, ref: "Notification" }],
});

// Plugins
Account.plugin(mongoosePaginate);

module.exports = mongoose.model("Account", Account);
