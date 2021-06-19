const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Account = new Schema(
  {
    avatar: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    private: { type: Boolean, required: true, default: false },
    // username: { type: String, required: true, unique: true },
    posts: { type: [{ type: Schema.Types.ObjectId, ref: "Post" }] },
    // friends: { type: [{ type: Schema.Types.ObjectId, ref: "Friend" }] },
    // notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  }
);

// Creating indexes
Account.index({
  firstName: 1,
  lastName: 1,
  email: -1,
  password: -1,
  // notifications: -1,
  // friends: -1,
  bio: 1,
  avatar: -1,
  username: 1,
});

// Plugins
Account.plugin(mongoosePaginate);

module.exports = model("Account", Account);
