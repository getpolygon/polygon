const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Account = new Schema(
  {
    email: { type: String, required: true },
    avatar: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    password: { type: String, required: true, minlength: 8 },
    private: { type: Boolean, required: true, default: false },
    posts: { type: [{ type: Schema.Types.ObjectId, ref: "Post" }] },
    friends: { type: [{ type: Schema.Types.ObjectId, ref: "Friend" }] },
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    timestamps: true,
  }
);

// Plugins
Account.plugin(mongoosePaginate);

module.exports = model("Account", Account);
