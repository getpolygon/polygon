const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Account = new Schema(
  {
    // avatar: {
    //   poor: { type: String, required: true },
    //   good: { type: String, required: true },
    // },
    // cover: {
    //   poor: { type: String, required: true },
    //   good: { type: String, required: true },
    // },
    avatar: { type: String, required: true },
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    bio: { type: String, required: false, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    theme: { type: String, required: true, default: "light" },
    private: { type: Boolean, required: true, default: false },
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
  bio: "text",
  username: "text",
  lastName: "text",
  firstName: "text",
});

// Plugins
Account.plugin(mongoosePaginate);

module.exports = model("Account", Account);
