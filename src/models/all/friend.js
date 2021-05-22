const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Friend = new mongoose.Schema({
  /**
   * Friend types
   * -----------------------------
   * 0 - Pending
   * 1 - Requested
   * 2 - Friends
   * -----------------------------
   */
  type: { type: Number, required: true, default: 0 },
  account: { type: mongoose.Types.ObjectId, ref: "Account" },
  timestamp: { type: Date, required: true, default: () => Date.now() },
});

// Plugins
// Friend.plugin(mongoosePaginate());

module.exports = mongoose.model("Friend", Friend);
