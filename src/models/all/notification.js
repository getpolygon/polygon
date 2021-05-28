const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Notification = new mongoose.Schema({
  seen: { type: Boolean, default: false, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  timestamp: { type: Date, required: true, default: () => Date.now() },
});

// Plugins
Notification.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", Notification);
