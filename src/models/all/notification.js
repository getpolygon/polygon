const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Notification = new Schema(
  {
    seen: { type: Boolean, default: false, required: true },
    account: { type: Schema.Types.ObjectId, ref: "Account" },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    timestamps: true,
  }
);

// Plugins
Notification.plugin(mongoosePaginate);

module.exports = model("Notification", Notification);
